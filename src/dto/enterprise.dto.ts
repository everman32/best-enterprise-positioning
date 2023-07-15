import { Type } from "class-transformer";
import { CoordinatesDto } from "./coordinates.dto";
import { IsNumber, Min, Max, ValidateNested } from "class-validator";

export class EnterpriseDto {
  @ValidateNested()
  @Type(() => CoordinatesDto)
  coordinates: CoordinatesDto;

  @Max(100000000)
  @Min(0.01)
  @IsNumber()
  transportCosts: number;
}
