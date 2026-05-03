import { Module } from "@nestjs/common";
import { PrismaModule } from "../prisma/prisma.module";
import { AdminController } from "./admin.controller";
import { FundedModule } from "../modules/funded/funded.module";

@Module({
  imports: [PrismaModule, FundedModule],
  controllers: [AdminController],
})
export class AdminModule {}
