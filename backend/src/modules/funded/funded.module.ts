import { AffiliateMembershipService } from './services/affiliate-membership.service';
import { AffiliateNotificationService } from './services/affiliate-notification.service';
import { AdminAffiliateApplicationsController } from './admin-affiliate-applications.controller';
import { AffiliateMeController } from './affiliate-me.controller';
import { Module } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";

import { ChallengeLifecycleService } from "./ChallengeLifecycleService";
import { FundedController } from "./funded.controller";
import { MetricsController } from "./metrics.controller";
import { ReviewController } from "./review.controller";
import { PayoutController } from "./payout.controller";
import { AffiliateCommissionReviewController } from "./affiliate-commission-review.controller";

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
import { AffiliatePayoutService } from "./services/affiliate-payout.service";
import { AffiliateCommissionReviewService } from "./services/affiliate-commission-review.service";

import { NowPaymentsService } from "./payments/nowpayments.service";
import { PaymentProcessingService } from "./payments/payment-processing.service";
import { CtaTrackingController } from "./cta-tracking/cta-tracking.controller";
import { CtaTrackingService } from "./cta-tracking/cta-tracking.service";

import { AdminAffiliatePayoutsController } from "./admin-affiliate-payouts.controller";

@Module({
  controllers: [
    FundedController,
    MetricsController,
    ReviewController,
    PayoutController,
    AffiliateCommissionReviewController,
    CtaTrackingController,
    AffiliateMeController,
    AdminAffiliateApplicationsController,
    AdminAffiliatePayoutsController,
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
    AffiliatePayoutService,
    AffiliateCommissionReviewService,

    // payments
    NowPaymentsService,
    PaymentProcessingService,
    CtaTrackingService,
    AffiliateMembershipService,
    AffiliateNotificationService,],
  exports: [MetricsOrchestrator],
})
export class FundedModule {}
