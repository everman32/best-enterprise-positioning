import { Controller, Get, Query, Post, Body } from "@nestjs/common";
import { AppService } from "./app.service";
import { Coordinates } from "./types/coordinates.types";
import { ShippingDto } from "./dto/shipping.dto";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get("costs")
  getCosts(
    @Query("authorizedCapital") authorizedCapital: number,
    @Query("productVolume") productVolume: number
  ): number {
    return this.appService.getCosts(authorizedCapital, productVolume);
  }

  @Post("bestCoordinates")
  getBestCoordinates(@Body() shippingDto: ShippingDto): Coordinates {
    return this.appService.getBestCoordinates(shippingDto);
  }
}
