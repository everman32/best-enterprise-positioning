import { Module } from "@nestjs/common";
import { EnterpriseService } from "./enterprise.service";
import { EnterpriseController } from "./enterprise.controller";
import { GeolocationModule } from "src/geolocation/geolocation.module";

@Module({
  imports: [GeolocationModule],
  providers: [EnterpriseService],
  controllers: [EnterpriseController],
})
export class EnterpriseModule {}
