import { Type } from "class-transformer";
import { IsNumber, IsArray, Min, Max, ValidateNested } from "class-validator";
import { CustomerDto } from "./customer.dto";

export class TripDto {
  @Max(100000000)
  @Min(0.01)
  @IsNumber()
  threshold: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CustomerDto)
  customers: CustomerDto[];
}
