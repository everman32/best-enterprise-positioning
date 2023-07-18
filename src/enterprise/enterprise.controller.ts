import {
  Controller,
  Get,
  Query,
  Post,
  Body,
  ValidationPipe,
} from "@nestjs/common";
import { CoordinatesDto } from "../dto/coordinates.dto";
import { TripDto } from "../dto/trip.dto";
import { EnterpriseService } from "./enterprise.service";

@Controller("enterprise")
export class EnterpriseController {
  constructor(private readonly enterpriseService: EnterpriseService) {}

  @Get("presentCosts")
  getPresentCosts(
    @Query("authorizedCapital") authorizedCapital: number,
    @Query("productVolume") productVolume: number
  ): number {
    return this.enterpriseService.getPresentCosts(
      authorizedCapital,
      productVolume
    );
  }

  @Post("optimalPositioning")
  getOptimalPositioning(
    @Body(new ValidationPipe()) tripDto: TripDto
  ): CoordinatesDto {
    return this.enterpriseService.getOptimalPositioning(tripDto);
  }
}
