import { Module } from "@nestjs/common";
import { FundedController } from "./funded.controller";

@Module({
  controllers: [FundedController],
})
export class FundedModule { }