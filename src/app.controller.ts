import { Controller, Get, Query, Post, Body } from "@nestjs/common";
import { AppService } from "./app.service";
import { Coordinates } from "./type/coordinates.type";
import { ShippingDto } from "./dto/shipping.dto";

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
  getBestCoordinates(@Body() shippingDto: ShippingDto): Coordinates {
    return this.appService.getBestCoordinates(shippingDto);
  }
}
