import { Module } from "@nestjs/common";
import { PrismaModule } from "../../prisma/prisma.module";
import { FundedController } from "./funded.controller";
import { ChallengeLifecycleService } from "./ChallengeLifecycleService";

@Module({
    imports: [PrismaModule],
    controllers: [FundedController],
    providers: [ChallengeLifecycleService],
})
export class FundedModule { }