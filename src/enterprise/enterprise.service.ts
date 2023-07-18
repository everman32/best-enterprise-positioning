import { Injectable } from "@nestjs/common";
import { CustomerService } from "src/customer/customer.service";
import { GeolocationService } from "src/geolocation/geolocation.service";
import { CoordinatesDto } from "../dto/coordinates.dto";
import { CustomerDto } from "../dto/customer.dto";
import { EnterpriseDto } from "../dto/enterprise.dto";
import { TripDto } from "../dto/trip.dto";
import {
  LAST_POSITIONING_INDEX,
  PENULTIMATE_POSITIONING_INDEX,
} from "./enterprise.constants";

@Injectable()
export class EnterpriseService {
  constructor(
    private readonly geolocationService: GeolocationService,
    private readonly customerService: CustomerService
  ) {}

  getOptimalPositioning({
    authorizedCapital,
    threshold,
    customers,
  }: TripDto): CoordinatesDto {
    const initialCoordinates: CoordinatesDto = this.getInitialPositioning(
      authorizedCapital,
      customers
    );

    const enterprises: EnterpriseDto[] = [];

    enterprises.push({
      coordinates: initialCoordinates,
      transportCosts: this.getTransportCosts(customers, initialCoordinates),
    });

    do {
      const newCoordinates = this.getIterativePositioning(
        authorizedCapital,
        customers,
        enterprises.at(LAST_POSITIONING_INDEX).coordinates
      );

      enterprises.push({
        coordinates: newCoordinates,
        transportCosts: this.getTransportCosts(customers, newCoordinates),
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

  getInitialPositioning(
    authorizedCapital: number,
    customers: CustomerDto[]
  ): CoordinatesDto {
    const { xDividend, yDividend, divisor } = customers.reduce(
      (
        acc,
        { coordinates: { latitude, longitude }, transportTariff, productVolume }
      ) => {
        const multiplier = this.customerService.getMultiplier(
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

  getIterativePositioning(
    authorizedCapital: number,
    customers: CustomerDto[],
    enterpriseCoordinates: CoordinatesDto
  ): CoordinatesDto {
    const { xDividend, yDividend, divisor } = customers.reduce(
      (
        acc,
        { coordinates: { latitude, longitude }, transportTariff, productVolume }
      ) => {
        const multiplier =
          this.customerService.getMultiplier(
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

  getTransportCosts(
    customers: CustomerDto[],
    enterpriseCoordinates: CoordinatesDto
  ): number {
    const { transportCosts } = customers.reduce(
      (
        acc,
        { coordinates: { latitude, longitude }, transportTariff, productVolume }
      ) => {
        acc.transportCosts += this.customerService.getTransportCosts(
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
}
