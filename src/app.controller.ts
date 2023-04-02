import { Controller, Get, Query } from "@nestjs/common";
import { AppService } from "./app.service";

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
}
