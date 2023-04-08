import { Injectable } from "@nestjs/common";
import { Coordinates } from "./type/coordinates.type";
import { ShippingDto } from "./dto/shipping.dto";

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
    let x = 0,
      y = 0;

    for (let i = 0; i < iterationNumber; i++) {
      const { xDividend, yDividend, divisor, transportCosts } =
        customers.reduce(
          (acc, { coordinates, transportTariff, productVolume }) => {
            const multiplier =
              (authorizedCapital * transportTariff) /
              (this.getPresentCosts(authorizedCapital, productVolume) *
                Math.sqrt((coordinates.x - x) ** 2 + (coordinates.y - y) ** 2));

            acc.xDividend += coordinates.x * multiplier;
            acc.yDividend += coordinates.y * multiplier;
            acc.divisor += multiplier;
            acc.transportCosts += productVolume * transportTariff;

            return acc;
          },
          { xDividend: 0, yDividend: 0, divisor: 0, transportCosts: 0 }
        );

      x = xDividend / divisor;
      y = yDividend / divisor;
    }
    return { x, y };
  }
}
