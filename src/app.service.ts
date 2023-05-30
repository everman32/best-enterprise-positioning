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
      { coordinates: { latitude: 0, longitude: 0 }, transportCosts: 0 },
    ];

    for (let index = 0; ; index++) {
      const prevPositioning = positionings[index === 0 ? index : index - 1];

      const { latitude, longitude } = this.getCustomerIterativePositioning(
          customers,
          authorizedCapital,
          prevPositioning.coordinates
        );

      const { transportCosts } = this.getCustomerTransportCosts(
        customers,
        prevPositioning.coordinates
      );

      positionings[index] = {
        coordinates: {
          latitude,
          longitude,
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
    positionings[positionings.length - 1].coordinates.latitude =
      Math.round(
        positionings[positionings.length - 1].coordinates.latitude * 10e4
      ) / 10e4;
    positionings[positionings.length - 1].coordinates.longitude =
      Math.round(
        positionings[positionings.length - 1].coordinates.longitude * 10e4
      ) / 10e4;

    return positionings[positionings.length - 1].coordinates;
  }

  getCustomerInitialPositioning(
    customers: Customer[],
    authorizedCapital: number
  ) {
    const { xDividend, yDividend, divisor } = customers.reduce(
      (
        acc,
        { coordinates: { latitude, longitude }, transportTariff, productVolume }
      ) => {
        const multiplier = this.getMultiplier(
          authorizedCapital,
          transportTariff,
          productVolume
        );

        acc.xDividend += latitude * multiplier;
        acc.yDividend += longitude * multiplier;
        acc.divisor += multiplier;

        return acc;
      },
      { xDividend: 0, yDividend: 0, divisor: 0 }
    );

    return { latitude: xDividend / divisor, longitude: yDividend / divisor };
  }

  getCustomerIterativePositioning(
    customers: Customer[],
    authorizedCapital: number,
    positioningCoordinates: Coordinates
  ) {
    const { xDividend, yDividend, divisor } = customers.reduce(
      (
        acc,
        { coordinates: { latitude, longitude }, transportTariff, productVolume }
      ) => {
        const multiplier =
          this.getMultiplier(
          authorizedCapital,
          transportTariff,
            productVolume
          ) /
          Math.sqrt(
            (latitude - positioningCoordinates.latitude) ** 2 +
              (longitude - positioningCoordinates.longitude) ** 2
        );

        acc.xDividend += latitude * multiplier;
        acc.yDividend += longitude * multiplier;
        acc.divisor += multiplier;

        return acc;
      },
      { xDividend: 0, yDividend: 0, divisor: 0 }
    );

    return { latitude: xDividend / divisor, longitude: yDividend / divisor };
  }

  getCustomerTransportCosts(
    customers: Customer[],
    positioningCoordinates: Coordinates
  ) {
    return customers.reduce(
      (
        acc,
        { coordinates: { latitude, longitude }, transportTariff, productVolume }
      ) => {
        acc.transportCosts += this.getTransportCosts(
          productVolume,
          transportTariff,
          positioningCoordinates,
          { latitude, longitude }
        );

        return acc;
      },
      { transportCosts: 0 }
    );
  }

  getMultiplier(
    authorizedCapital: number,
    transportTariff: number,
    productVolume: number
  ): number {
    return (
      (authorizedCapital * transportTariff) /
      this.getPresentCosts(authorizedCapital, productVolume)
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
        positioningCoordinates.latitude,
        positioningCoordinates.longitude,
        coordinates.latitude,
        coordinates.longitude
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
