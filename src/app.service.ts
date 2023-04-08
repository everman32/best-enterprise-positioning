import { Injectable } from "@nestjs/common";
import { Coordinates } from "./type/coordinates.type";
import { ShippingDto } from "./dto/shipping.dto";
import { Positioning } from "./type/positioning.type";
import { DEGREE_RADIAN_DIFFERENCE, EARTH_MEAN_RADIUS } from "./app.constants";

@Injectable()
export class AppService {
  getPresentCosts(authorizedCapital: number, productVolume: number): number {
    return authorizedCapital / productVolume;
  }

  getBestCoordinates({
    authorizedCapital,
    iterationNumber,
    customers,
  }: ShippingDto): Coordinates {
    const positionings: Positioning[] = Array.from(
      { length: iterationNumber },
      () => ({
        coordinates: { x: 0, y: 0 },
        costs: 0,
      })
    );

    positionings.forEach((positioning, index) => {
      const previousIndex = index === 0 ? index : index - 1;

      const { xDividend, yDividend, divisor, transportCosts } =
        customers.reduce(
          (acc, { coordinates, transportTariff, productVolume }) => {
            const multiplier =
              (authorizedCapital * transportTariff) /
              (this.getPresentCosts(authorizedCapital, productVolume) *
                Math.sqrt(
                  (coordinates.x - positionings[previousIndex].coordinates.x) **
                    2 +
                    (coordinates.y -
                      positionings[previousIndex].coordinates.y) **
                      2
                ));

            acc.xDividend += coordinates.x * multiplier;
            acc.yDividend += coordinates.y * multiplier;
            acc.divisor += multiplier;
            acc.transportCosts +=
              productVolume *
              transportTariff *
              this.getDistanceBetweenPoints(
                positionings[previousIndex].coordinates.x,
                positionings[previousIndex].coordinates.y,
                coordinates.x,
                coordinates.y
              );

            return acc;
          },
          { xDividend: 0, yDividend: 0, divisor: 0, transportCosts: 0 }
        );

      positioning.coordinates.x = xDividend / divisor;
      positioning.coordinates.y = yDividend / divisor;
      positioning.costs = transportCosts;
    });

    const minCostsPositioning = positionings.reduce((current, previous) =>
      current.costs < previous.costs ? current : previous
    );

    return minCostsPositioning.coordinates;
  }

  getDistanceBetweenPoints(
    latitude1: number,
    longitude1: number,
    latitude2: number,
    longitude2: number
  ): number {
    const lat1 = this.degreesToRadians(latitude1);
    const lat2 = this.degreesToRadians(latitude2);
    const deltaLat = this.degreesToRadians(latitude2 - latitude1);
    const deltaLong = this.degreesToRadians(longitude2 - longitude1);

    const a =
      Math.sin(deltaLat / 2) ** 2 +
      Math.cos(lat1) * Math.cos(lat2) * Math.sin(deltaLong / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return EARTH_MEAN_RADIUS * c;
  }

  degreesToRadians(degrees: number): number {
    return (degrees * Math.PI) / DEGREE_RADIAN_DIFFERENCE;
  }
}
