import { Module } from "@nestjs/common";
import { AdminModule } from "./admin/admin.module";
import { PrismaModule } from "./prisma/prisma.module";
import { HealthController } from "./health/health.controller";
import { FundedModule } from "./modules/funded/funded.module";
import { AuthModule } from "./auth/auth.module";
import { MemberModule } from "./member/member.module";

@Module({
  imports: [AdminModule, PrismaModule, FundedModule, AuthModule, MemberModule],
  controllers: [HealthController],
})
export class AppModule { }