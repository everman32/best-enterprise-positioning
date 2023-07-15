import { Type } from "class-transformer";
import { IsNumber, Max, Min, ValidateNested } from "class-validator";
import { CoordinatesDto } from "./coordinates.dto";

export class CustomerDto {
  @ValidateNested()
  @Type(() => CoordinatesDto)
  coordinates: CoordinatesDto;

  @Max(100000000)
  @Min(0.01)
  @IsNumber()
  transportTariff: number;

  @Max(100000)
  @Min(0.01)
  @IsNumber()
  productVolume: number;
}
