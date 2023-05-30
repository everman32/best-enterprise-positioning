import { Injectable } from "@nestjs/common";
import { Coordinates } from "./type/coordinates.type";
import { TripDto } from "./dto/trip.dto";
import { Enterprise } from "./type/enterprise.type";
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

  getOptimalEnterprisePositioning({
    authorizedCapital,
    threshold,
    customers,
  }: TripDto): Coordinates {
    const initialCoordinates: Coordinates = this.getInitialEnterpisePositioning(
      customers,
      authorizedCapital
    );

    const enterprises: Enterprise[] = [];

    enterprises.push({
      coordinates: initialCoordinates,
      transportCosts: this.getEnterpriseTransportCosts(
        customers,
        initialCoordinates
      ),
    });

    do {
      const newCoordinates = this.getIterativeEnterprisePositioning(
        customers,
        authorizedCapital,
        enterprises.at(LAST_POSITIONING_INDEX).coordinates
      );

      enterprises.push({
        coordinates: newCoordinates,
        transportCosts: this.getEnterpriseTransportCosts(
          customers,
          newCoordinates
        ),
      });
    } while (
      enterprises.at(PENULTIMATE_POSITIONING_INDEX).transportCosts -
        enterprises.at(LAST_POSITIONING_INDEX).transportCosts >
      threshold
    );

    return {
      latitude: this.roundDecimalToCoordinates(
        enterprises.at(LAST_POSITIONING_INDEX).coordinates.latitude
      ),
      longitude: this.roundDecimalToCoordinates(
        enterprises.at(LAST_POSITIONING_INDEX).coordinates.longitude
      ),
    };
  }

  getInitialEnterpisePositioning(
    customers: Customer[],
    authorizedCapital: number
  ): Coordinates {
    const { xDividend, yDividend, divisor } = customers.reduce(
      (
        acc,
        { coordinates: { latitude, longitude }, transportTariff, productVolume }
      ) => {
        const multiplier = this.getCustomerMultiplier(
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

  getIterativeEnterprisePositioning(
    customers: Customer[],
    authorizedCapital: number,
    enterpriseCoordinates: Coordinates
  ): Coordinates {
    const { xDividend, yDividend, divisor } = customers.reduce(
      (
        acc,
        { coordinates: { latitude, longitude }, transportTariff, productVolume }
      ) => {
        const multiplier =
          this.getCustomerMultiplier(
            authorizedCapital,
            transportTariff,
            productVolume
          ) /
          Math.sqrt(
            (latitude - enterpriseCoordinates.latitude) ** 2 +
              (longitude - enterpriseCoordinates.longitude) ** 2
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

  getEnterpriseTransportCosts(
    customers: Customer[],
    enterpriseCoordinates: Coordinates
  ): number {
    const { transportCosts } = customers.reduce(
      (
        acc,
        { coordinates: { latitude, longitude }, transportTariff, productVolume }
      ) => {
        acc.transportCosts += this.getTransportCosts(
          productVolume,
          transportTariff,
          enterpriseCoordinates,
          { latitude, longitude }
        );

        return acc;
      },
      { transportCosts: 0 }
    );

    return transportCosts;
  }

  getCustomerMultiplier(
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
    firstCoordinates: Coordinates,
    secondCoordinates: Coordinates
  ): number {
    return (
      productVolume *
      transportTariff *
      this.getDistanceBetweenPoints(
        firstCoordinates.latitude,
        firstCoordinates.longitude,
        secondCoordinates.latitude,
        secondCoordinates.longitude
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
