import { Module } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";

import { ChallengeLifecycleService } from "./ChallengeLifecycleService";
import { FundedController } from "./funded.controller";
import { MetricsController } from "./metrics.controller";
import { ReviewController } from "./review.controller";
import { PayoutController } from "./payout.controller";

import { MetricsOrchestrator } from "./orchestrators/metrics-orchestrator.service";

import { ProfitGuardService } from "./services/profit-guard.service";
import { TradingDaysService } from "./services/trading-days.service";
import { TimeEngineService } from "./services/time-engine.service";
import { FraudDetectorService } from "./services/fraud-detector.service";
import { StateMachineService } from "./services/state-machine.service";
import { DrawdownEngineService } from "./services/drawdown-engine.service";
import { DayResetService } from "./services/day-reset.service";
import { ReviewDecisionService } from "./services/review-decision.service";
import { PayoutRequestService } from "./services/payout-request.service";
import { PayoutReviewService } from "./services/payout-review.service";
import { PayoutExecutionService } from "./services/payout-execution.service";
import { AdminGuardService } from "./services/admin-guard.service";

@Module({
  controllers: [
    FundedController,
    MetricsController,
    ReviewController,
    PayoutController,
  ],
  providers: [
    PrismaService,
    ChallengeLifecycleService,

    // core
    MetricsOrchestrator,

    // engines
    ProfitGuardService,
    TradingDaysService,
    TimeEngineService,
    FraudDetectorService,
    StateMachineService,
    DrawdownEngineService,
    DayResetService,
    ReviewDecisionService,
    PayoutRequestService,
    PayoutReviewService,
    PayoutExecutionService,
    AdminGuardService,
  ],
})
export class FundedModule {}
