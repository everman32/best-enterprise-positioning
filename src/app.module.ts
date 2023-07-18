import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { EnterpriseModule } from "./enterprise/enterprise.module";
import { GeolocationModule } from "./geolocation/geolocation.module";

@Module({
  imports: [ConfigModule.forRoot(), EnterpriseModule, GeolocationModule],
})
export class AppModule {}
