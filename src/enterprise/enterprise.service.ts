import { Injectable } from "@nestjs/common";
import { GeolocationService } from "src/geolocation/geolocation.service";
import { TripDto } from "./dto/trip.dto";
import {
  Coordinates,
  Enterprise,
  LAST_POSITIONING_INDEX,
  PENULTIMATE_POSITIONING_INDEX,
  Customer,
} from "./enterprise.constants";

@Injectable()
export class EnterpriseService {
  constructor(private readonly geolocationService: GeolocationService) {}

  getPresentCosts(authorizedCapital: number, productVolume: number): number {
    return authorizedCapital / productVolume;
  }

  getOptimalEnterprisePositioning({
    threshold,
    customers,
  }: TripDto): Coordinates {
    const initialCoordinates: Coordinates =
      this.getInitialEnterpisePositioning(customers);

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
      latitude: this.geolocationService.roundDecimalToCoordinates(
        enterprises.at(LAST_POSITIONING_INDEX).coordinates.latitude
      ),
      longitude: this.geolocationService.roundDecimalToCoordinates(
        enterprises.at(LAST_POSITIONING_INDEX).coordinates.longitude
      ),
    };
  }

  getInitialEnterpisePositioning(customers: Customer[]): Coordinates {
    const { xDividend, yDividend, divisor } = customers.reduce(
      (
        acc,
        { coordinates: { latitude, longitude }, transportTariff, productVolume }
      ) => {
        const multiplier = this.getCustomerMultiplier(
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
    enterpriseCoordinates: Coordinates
  ): Coordinates {
    const { xDividend, yDividend, divisor } = customers.reduce(
      (
        acc,
        { coordinates: { latitude, longitude }, transportTariff, productVolume }
      ) => {
        const multiplier =
          this.getCustomerMultiplier(transportTariff, productVolume) /
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
    transportTariff: number,
    productVolume: number
  ): number {
    return transportTariff * productVolume;
  }

  getTransportCosts(
    productVolume: number,
    transportTariff: number,
    firstCoordinates: Coordinates,
    secondCoordinates: Coordinates
  ): number {
    return (
      this.getCustomerMultiplier(transportTariff, productVolume) *
      this.geolocationService.getDistanceBetweenPoints(
        firstCoordinates.latitude,
        firstCoordinates.longitude,
        secondCoordinates.latitude,
        secondCoordinates.longitude
      )
    );
  }
}
