import { Module } from "@nestjs/common";
import { EnterpriseService } from "./enterprise.service";
import { EnterpriseController } from "./enterprise.controller";
import { GeolocationModule } from "src/geolocation/geolocation.module";
import { CustomerModule } from "src/customer/customer.module";

@Module({
  imports: [GeolocationModule, CustomerModule],
  providers: [EnterpriseService],
  controllers: [EnterpriseController],
})
export class EnterpriseModule {}
