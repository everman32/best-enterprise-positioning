import { Injectable } from "@nestjs/common";
import { CoordinatesDto } from "../dto/coordinates.dto";
import { GeolocationService } from "../geolocation/geolocation.service";

@Injectable()
export class CustomerService {
  constructor(private readonly geolocationService: GeolocationService) {}

  getPresentCosts(authorizedCapital: number, productVolume: number): number {
    return authorizedCapital / productVolume;
  }

  getMultiplier(
    authorizedCapital: number,
    transportTariff: number,
    productVolume: number
  ): number {
    return (
      transportTariff / this.getPresentCosts(authorizedCapital, productVolume)
    );
  }

  getTransportCosts(
    productVolume: number,
    transportTariff: number,
    firstCoordinates: CoordinatesDto,
    secondCoordinates: CoordinatesDto
  ): number {
    return (
      productVolume *
      transportTariff *
      this.geolocationService.getDistanceBetweenPoints(
        firstCoordinates.latitude,
        firstCoordinates.longitude,
        secondCoordinates.latitude,
        secondCoordinates.longitude
      )
    );
  }
}
