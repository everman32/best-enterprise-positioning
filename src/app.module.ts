import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { EnterpriseModule } from "./enterprise/enterprise.module";
import { GeolocationModule } from "./geolocation/geolocation.module";
import { CustomerModule } from "./customer/customer.module";

@Module({
  imports: [
    ConfigModule.forRoot(),
    EnterpriseModule,
    GeolocationModule,
    CustomerModule,
  ],
})
export class AppModule {}
