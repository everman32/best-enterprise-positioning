import { Module } from "@nestjs/common";
import { EnterpriseService } from "./enterprise.service";
import { EnterpriseController } from "./enterprise.controller";
import { GeolocationModule } from "../geolocation/geolocation.module";
import { CustomerModule } from "../customer/customer.module";

@Module({
  imports: [GeolocationModule, CustomerModule],
  providers: [EnterpriseService],
  controllers: [EnterpriseController],
})
export class EnterpriseModule {}
