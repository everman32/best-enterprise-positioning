import { Injectable } from "@nestjs/common";
import { Coordinates } from "./type/coordinates.type";
import { ShippingDto } from "./dto/shipping.dto";
import { Positioning } from "./type/positioning.type";

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
            acc.transportCosts += productVolume * transportTariff;

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
}
