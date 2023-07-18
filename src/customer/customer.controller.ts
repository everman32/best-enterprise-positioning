import { Controller, Get, Query } from "@nestjs/common";
import { CustomerService } from "./customer.service";

@Controller("customer")
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Get("presentCosts")
  getPresentCosts(
    @Query("authorizedCapital") authorizedCapital: number,
    @Query("productVolume") productVolume: number
  ): number {
    return this.customerService.getPresentCosts(
      authorizedCapital,
      productVolume
    );
  }
}
