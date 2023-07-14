import { Controller, Get, Query, Post, Body } from "@nestjs/common";
import { TripDto } from "./dto/trip.dto";
import { Coordinates } from "./enterprise.constants";
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

  @Post("bestCoordinates")
  getBestCoordinates(@Body() tripDto: TripDto): Coordinates {
    return this.enterpriseService.getOptimalEnterprisePositioning(tripDto);
  }
}
