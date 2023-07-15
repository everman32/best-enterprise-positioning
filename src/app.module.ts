import { Module } from "@nestjs/common";
import { EnterpriseModule } from "./enterprise/enterprise.module";
import { GeolocationModule } from "./geolocation/geolocation.module";

@Module({
  imports: [EnterpriseModule, GeolocationModule],
})
export class AppModule {}
