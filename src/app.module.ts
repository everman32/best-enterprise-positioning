import { Module } from "@nestjs/common";
import { EnterpriseModule } from "./enterprise/enterprise.module";

@Module({
  imports: [EnterpriseModule],
})
export class AppModule {}
