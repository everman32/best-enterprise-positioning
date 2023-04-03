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
    const firstIterationCoordinates = this.getFirstIterationCoordinates(
      authorizedCapital,
      customers,
      costs
    );

    return firstIterationCoordinates;
  }

  getFirstIterationCoordinates(
    authorizedCapital: number,
    customers: CustomerDto[],
    costs: number
  ) {
    const { xDividend, yDividend, divisor } = customers.reduce(
      (acc, customer) => {
        const { coordinates, transportTariff } = customer;
        acc.xDividend +=
          (coordinates.x * authorizedCapital * transportTariff) / costs;

        acc.yDividend +=
          (coordinates.y * authorizedCapital * transportTariff) / costs;

        acc.divisor += (authorizedCapital * customer.transportTariff) / costs;

        return acc;
      },
      { xDividend: 0, yDividend: 0, divisor: 0 }
    );

    return { x: xDividend / divisor, y: yDividend / divisor };
  }
}
