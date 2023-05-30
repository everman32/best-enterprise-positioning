import { Injectable } from "@nestjs/common";
import { Coordinates } from "./type/coordinates.type";
import { ShippingDto } from "./dto/shipping.dto";
import { Positioning } from "./type/positioning.type";
import {
  DEGREE_RADIAN_DIFFERENCE,
  EARTH_MEAN_RADIUS,
  GOOGLE_COORDINATES_PRECISION,
  LAST_POSITIONING_INDEX,
  PENULTIMATE_POSITIONING_INDEX,
} from "./app.constants";
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
    const initialPositioning: Coordinates = this.getCustomerInitialPositioning(
      customers,
      authorizedCapital
    );

    const positionings: Positioning[] = [];

    positionings.push({
      coordinates: initialPositioning,
      transportCosts: this.getCustomerTransportCosts(
        customers,
        initialPositioning
      ),
    });

    do {
      const newPositioning = this.getCustomerIterativePositioning(
        customers,
        authorizedCapital,
        positionings.at(LAST_POSITIONING_INDEX).coordinates
      );

      positionings.push({
        coordinates: newPositioning,
        transportCosts: this.getCustomerTransportCosts(
          customers,
          newPositioning
        ),
      });
    } while (
      positionings.at(PENULTIMATE_POSITIONING_INDEX).transportCosts -
        positionings.at(LAST_POSITIONING_INDEX).transportCosts >
      threshold
    );

    return {
      latitude: this.roundDecimalToCoordinates(
        positionings.at(LAST_POSITIONING_INDEX).coordinates.latitude
      ),
      longitude: this.roundDecimalToCoordinates(
        positionings.at(LAST_POSITIONING_INDEX).coordinates.longitude
      ),
    };
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
    const { transportCosts } = customers.reduce(
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

    return transportCosts;
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

  roundDecimalToCoordinates(decimal: number) {
    return (
      Math.round(decimal * GOOGLE_COORDINATES_PRECISION) /
      GOOGLE_COORDINATES_PRECISION
    );
  }
}
