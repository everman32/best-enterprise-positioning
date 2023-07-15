import { IsLatitude, IsLongitude } from "class-validator";

export class CoordinatesDto {
  @IsLatitude()
  latitude: number;
  @IsLongitude()
  longitude: number;
}
