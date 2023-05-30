import { Controller, Get, Query, Post, Body } from "@nestjs/common";
import { AppService } from "./app.service";
import { Coordinates } from "./type/coordinates.type";
import { TripDto } from "./dto/trip.dto";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get("presentCosts")
  getPresentCosts(
    @Query("authorizedCapital") authorizedCapital: number,
    @Query("productVolume") productVolume: number
  ): number {
    return this.appService.getPresentCosts(authorizedCapital, productVolume);
  }

  @Post("bestCoordinates")
  getBestCoordinates(@Body() tripDto: TripDto): Coordinates {
    return this.appService.getOptimalEnterprisePositioning(tripDto);
  }
}
