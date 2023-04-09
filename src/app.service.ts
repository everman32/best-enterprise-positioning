import { Injectable } from "@nestjs/common";
import { Coordinates } from "./type/coordinates.type";
import { ShippingDto } from "./dto/shipping.dto";
import { Positioning } from "./type/positioning.type";
import { DEGREE_RADIAN_DIFFERENCE, EARTH_MEAN_RADIUS } from "./app.constants";
import { Customer } from "./type/customer.type";

@Injectable()
export class AppService {
  getPresentCosts(authorizedCapital: number, productVolume: number): number {
    return authorizedCapital / productVolume;
  }

  getBestCoordinates({
    authorizedCapital,
    threshold,
    customers,
  }: ShippingDto): Coordinates {
    const positionings: Positioning[] = [
      { coordinates: { x: 0, y: 0 }, transportCosts: 0 },
    ];

    for (let index = 0; ; index++) {
      const prevPositioning = positionings[index === 0 ? index : index - 1];
      const { xDividend, yDividend, divisor, transportCosts } =
        this.getCustomerTotals(
          customers,
          authorizedCapital,
          prevPositioning.coordinates
        );

      positionings[index] = {
        coordinates: {
          x: xDividend / divisor,
          y: yDividend / divisor,
        },
        transportCosts,
      };

      if (
        index > 0 &&
        Math.abs(transportCosts - prevPositioning.transportCosts) <= threshold
      ) {
        break;
      }
    }
    return positionings[positionings.length - 1].coordinates;
  }

  getCustomerTotals(
    customers: Customer[],
    authorizedCapital: number,
    positioningCoordinates: Coordinates
  ) {
    return customers.reduce(
      (acc, { coordinates: { x, y }, transportTariff, productVolume }) => {
        const multiplier = this.getMultiplier(
          authorizedCapital,
          transportTariff,
          productVolume,
          { x, y },
          positioningCoordinates
        );

        acc.xDividend += x * multiplier;
        acc.yDividend += y * multiplier;
        acc.divisor += multiplier;
        acc.transportCosts += this.getTransportCosts(
          productVolume,
          transportTariff,
          positioningCoordinates,
          { x, y }
        );

        return acc;
      },
      { xDividend: 0, yDividend: 0, divisor: 0, transportCosts: 0 }
    );
  }

  getMultiplier(
    authorizedCapital: number,
    transportTariff: number,
    productVolume: number,
    coordinates: Coordinates,
    positioningCoordinates: Coordinates
  ): number {
    return (
      (authorizedCapital * transportTariff) /
      (this.getPresentCosts(authorizedCapital, productVolume) *
        Math.sqrt(
          (coordinates.x - positioningCoordinates.x) ** 2 +
            (coordinates.y - positioningCoordinates.y) ** 2
        ))
    );
  }

  getTransportCosts(
    productVolume: number,
    transportTariff: number,
    positioningCoordinates: Coordinates,
    coordinates: Coordinates
  ): number {
    return (
      productVolume *
      transportTariff *
      this.getDistanceBetweenPoints(
        positioningCoordinates.x,
        positioningCoordinates.y,
        coordinates.x,
        coordinates.y
      )
    );
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
