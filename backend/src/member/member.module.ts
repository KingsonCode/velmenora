import { Module } from "@nestjs/common";
import { PrismaModule } from "../prisma/prisma.module";
import { MemberController } from "./member.controller";

@Module({
  imports: [PrismaModule],
  controllers: [MemberController],
})
export class MemberModule {}
