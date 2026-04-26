import { Module } from "@nestjs/common";
import { AdminModule } from "./admin/admin.module";
import { PrismaModule } from "./prisma/prisma.module";
import { HealthController } from "./health/health.controller";
import { FundedModule } from "./modules/funded/funded.module";

@Module({
  imports: [AdminModule, PrismaModule, FundedModule],
  controllers: [HealthController],
})
export class AppModule { }