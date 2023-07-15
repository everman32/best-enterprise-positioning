import { Injectable } from "@nestjs/common";
import {
  EARTH_MEAN_RADIUS,
  DEGREE_RADIAN_DIFFERENCE,
  GOOGLE_COORDINATES_PRECISION,
} from "./geolocation.constants";

@Injectable()
export class GeolocationService {
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
