import { Injectable } from "@nestjs/common";
import { Coordinates } from "./types/coordinates.types";
import { CustomerDto } from "./dto/customer.dto";
import { ShippingDto } from "./dto/shipping.dto";

@Injectable()
export class AppService {
  getCosts(authorizedCapital: number, productVolume: number): number {
    return authorizedCapital / productVolume;
  }

  getBestCooridates(shippingDto: ShippingDto): Coordinates {
    const { authorizedCapital, productVolume, iterationNumber, customers } =
      shippingDto;
    const costs = this.getCosts(authorizedCapital, productVolume);
    let { x, y } = this.getFirstIterationCoordinates(
      authorizedCapital,
      customers,
      costs
    );

    for (let i = 1; i < iterationNumber; i++) {
      const { xDividend, yDividend, divisor } = customers.reduce(
        (acc, customer) => {
          const { coordinates, transportTariff } = customer;

          const multiplier =
            (authorizedCapital * transportTariff) /
            (costs *
              Math.sqrt(
                Math.pow(coordinates.x - x, 2) + Math.pow(coordinates.y - y, 2)
              ));

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

  getFirstIterationCoordinates(
    authorizedCapital: number,
    customers: CustomerDto[],
    costs: number
  ) {
    const { xDividend, yDividend, divisor } = customers.reduce(
      (acc, customer) => {
        const { coordinates, transportTariff } = customer;

        const multiplier = (authorizedCapital * transportTariff) / costs;
        acc.xDividend += coordinates.x * multiplier;
        acc.yDividend += coordinates.y * multiplier;
        acc.divisor += multiplier;

        return acc;
      },
      { xDividend: 0, yDividend: 0, divisor: 0 }
    );

    return { x: xDividend / divisor, y: yDividend / divisor };
  }
}
