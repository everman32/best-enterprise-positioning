import { Injectable } from "@nestjs/common";
import { Coordinates } from "./types/coordinates.types";
import { ShippingDto } from "./dto/shipping.dto";

@Injectable()
export class AppService {
  getCosts(authorizedCapital: number, productVolume: number): number {
    return authorizedCapital / productVolume;
  }

  getBestCoordinates({
    authorizedCapital,
    productVolume,
    iterationNumber,
    customers,
  }: ShippingDto): Coordinates {
    const costs = this.getCosts(authorizedCapital, productVolume);

    let x = 0,
      y = 0;

    for (let i = 0; i < iterationNumber; i++) {
      const { xDividend, yDividend, divisor } = customers.reduce(
        (acc, { coordinates, transportTariff }) => {
          const multiplier =
            (authorizedCapital * transportTariff) /
            (costs *
              Math.sqrt((coordinates.x - x) ** 2 + (coordinates.y - y) ** 2));

          acc.xDividend += coordinates.x * multiplier;
          acc.yDividend += coordinates.y * multiplier;
          acc.divisor += multiplier;

          return acc;
        },
        { xDividend: 0, yDividend: 0, divisor: 0 }
      );

      x = xDividend / divisor;
      y = yDividend / divisor;
    }
    return { x, y };
  }
}
