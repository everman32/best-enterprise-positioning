import { Module } from "@nestjs/common";
import { EnterpriseService } from "./enterprise.service";
import { EnterpriseController } from "./enterprise.controller";

@Module({
  providers: [EnterpriseService],
  controllers: [EnterpriseController],
})
export class EnterpriseModule {}
