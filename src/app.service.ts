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
      const { xDividend, yDividend, divisor, transportCosts } =
        this.getCustomerTotals(
          customers,
          authorizedCapital,
          prevPositioning.coordinates
        );

      positionings[index] = {
        coordinates: {
          latitude: xDividend / divisor,
          longitude: yDividend / divisor,
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
      (
        acc,
        { coordinates: { latitude, longitude }, transportTariff, productVolume }
      ) => {
        const multiplier = this.getMultiplier(
          authorizedCapital,
          transportTariff,
          productVolume,
          { latitude, longitude },
          positioningCoordinates
        );

        acc.xDividend += latitude * multiplier;
        acc.yDividend += longitude * multiplier;
        acc.divisor += multiplier;
        acc.transportCosts += this.getTransportCosts(
          productVolume,
          transportTariff,
          positioningCoordinates,
          { latitude, longitude }
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
          (coordinates.latitude - positioningCoordinates.latitude) ** 2 +
            (coordinates.longitude - positioningCoordinates.longitude) ** 2
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
