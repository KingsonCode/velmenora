import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import {
  AuditEntityType,
  AuditEventType,
  ChallengeStatus,
  MetricSource,
} from "@prisma/client";

import { PrismaService } from "../../../prisma/prisma.service";
import { ProfitGuardService } from "../services/profit-guard.service";
import { TradingDaysService } from "../services/trading-days.service";
import { TimeEngineService } from "../services/time-engine.service";
import { FraudDetectorService } from "../services/fraud-detector.service";
import { StateMachineService } from "../services/state-machine.service";
import { DrawdownEngineService } from "../services/drawdown-engine.service";
import { DayResetService } from "../services/day-reset.service";
import { RetakeDiscountService } from "../services/retake-discount.service";

@Injectable()
export class MetricsOrchestrator {
  constructor(
    @Inject(PrismaService)
    private readonly prisma: PrismaService,

    @Inject(ProfitGuardService)
    private readonly profitGuard: ProfitGuardService,

    @Inject(TradingDaysService)
    private readonly tradingDays: TradingDaysService,

    @Inject(TimeEngineService)
    private readonly timeEngine: TimeEngineService,

    @Inject(FraudDetectorService)
    private readonly fraud: FraudDetectorService,

    @Inject(StateMachineService)
    private readonly stateMachine: StateMachineService,

    @Inject(DrawdownEngineService)
    private readonly drawdown: DrawdownEngineService,

    @Inject(DayResetService)
    private readonly dayReset: DayResetService,
    private readonly retakeDiscountService: RetakeDiscountService,
  ) {}

  async process(accountId: string, metrics: any) {
    const account = await this.prisma.challengeAccount.findUnique({
      where: { id: accountId },
      include: { challenge: true },
    });

    if (!account) {
      throw new NotFoundException("Challenge account not found");
    }

    const previousStatus = account.status;

    if (previousStatus !== ChallengeStatus.active) {
      await this.prisma.auditLog.create({
        data: {
          actorUserId: null,
          entityType: AuditEntityType.challenge_account,
          entityId: accountId,
          eventType: AuditEventType.admin_action,
          oldValuesJson: {
            status: previousStatus,
          },
          newValuesJson: {
            status: previousStatus,
          },
          metadataJson: {
            source: "metrics_orchestrator",
            action: "metrics_rejected",
            reason: "account_not_active",
            attemptedMetrics: metrics,
          },
        },
      });

      return {
        ok: false,
        rejected: true,
        reason: "account_not_active",
        challengeAccount: account,
        decision: {
          previousStatus,
          nextStatus: previousStatus,
        },
      };
    }

    const prevMetrics = await this.prisma.metricSnapshot.findFirst({
      where: { challengeAccountId: accountId },
      orderBy: { snapshotTime: "desc" },
    });

    const currentBalance = Number(metrics.currentBalance);
    const currentEquity = Number(metrics.currentEquity);
    const initialBalance = Number(account.initialBalance);
    const previousPeakEquity = Number(account.peakEquity ?? account.initialBalance);

    const peakEquity = Math.max(previousPeakEquity, currentEquity);
    const totalPnl = currentBalance - initialBalance;
    const realizedPnl = Number(metrics.realizedPnl ?? metrics.pnl ?? totalPnl);
    const unrealizedPnl = currentEquity - currentBalance;

    const incomingMaxObservedLot = Number(metrics.maxObservedLot ?? 0);
    const incomingMaxObservedRiskPct = Number(metrics.maxObservedRiskPct ?? 0);
    const previousMaxObservedLot = Number(account.maxObservedLot ?? 0);
    const previousMaxObservedRiskPct = Number(account.maxObservedRiskPct ?? 0);

    const maxObservedLot = Math.max(previousMaxObservedLot, incomingMaxObservedLot);
    const maxObservedRiskPct = Math.max(
      previousMaxObservedRiskPct,
      incomingMaxObservedRiskPct,
    );

    const maxLotSize = Number(account.challenge?.maxLotSize ?? 1);
    const maxRiskPerTradePct = Number(account.challenge?.maxRiskPerTradePct ?? 2);

    const riskCheck = {
      maxObservedLot,
      maxObservedRiskPct,
      maxLotSize,
      maxRiskPerTradePct,
      breached:
        maxObservedLot > maxLotSize ||
        maxObservedRiskPct > maxRiskPerTradePct,
      failureReason:
        maxObservedLot > maxLotSize
          ? "max_lot_size_breached"
          : maxObservedRiskPct > maxRiskPerTradePct
            ? "max_risk_per_trade_breached"
            : null,
    };

    const dayReset = this.dayReset.apply(account, currentBalance, currentEquity);
    const dayId = dayReset.dayId;
    const isValidTradingDay = this.tradingDays.isValidTradingDay(metrics);

    const projectedTradingDaysCount =
      isValidTradingDay && account.dayId !== dayId
        ? account.tradingDaysCount + 1
        : account.tradingDaysCount;

    const projectedAccount = {
      ...account,
      currentBalance,
      currentEquity,
      peakEquity,
      totalPnl,
      tradingDaysCount: projectedTradingDaysCount,
      dayId,
      dayStartBalance: dayReset.dayStartBalance,
      dayStartEquity: dayReset.dayStartEquity,
      intradayMinEquity: dayReset.intradayMinEquity,
    };

    const drawdownCheck = this.drawdown.evaluate(projectedAccount);

    const bestDayProfitResult = await this.prisma.metricSnapshot.groupBy({
      by: ["dayId"],
      where: {
        challengeAccountId: accountId,
        dayId: { not: null },
      },
      _max: {
        realizedPnl: true,
      },
    });

    const historicalBestDayProfit = bestDayProfitResult.reduce((max, row) => {
      return Math.max(max, Number(row._max.realizedPnl ?? 0));
    }, 0);

    const bestDayProfit = Math.max(historicalBestDayProfit, realizedPnl);

    const profitCheck = this.profitGuard.evaluate({
      ...projectedAccount,
      bestDayProfit,
    });

    const consistencyCheck = {
      breached: Boolean(profitCheck.consistencyBreached),
      failureReason: profitCheck.consistencyBreached
        ? "consistency_rule_breached"
        : null,
      bestDayProfit,
      bestDayProfitPctOfTotal: profitCheck.bestDayProfitPctOfTotal,
      maxDailyProfitPct: profitCheck.maxDailyProfitPct,
    };

    const fraudCheck = this.fraud.analyze(projectedAccount, prevMetrics);

    let nextStatus: ChallengeStatus = previousStatus;
    let failureReason = account.failureReason;
    let eventType: AuditEventType = AuditEventType.metrics_recorded;

    if (this.timeEngine.isExpired(account)) {
      nextStatus = ChallengeStatus.failed;
      failureReason = "time_expired";
      eventType = AuditEventType.challenge_failed;
    } else if (drawdownCheck.breached) {
      nextStatus = ChallengeStatus.failed;
      failureReason = drawdownCheck.failureReason;
      eventType = AuditEventType.rule_breached;
    } else if (riskCheck.breached) {
      nextStatus = ChallengeStatus.failed;
      failureReason = riskCheck.failureReason;
      eventType = AuditEventType.rule_breached;
    } else if (consistencyCheck.breached) {
      nextStatus = ChallengeStatus.failed;
      failureReason = consistencyCheck.failureReason;
      eventType = AuditEventType.rule_breached;
    } else if (profitCheck.canPass) {
      nextStatus = ChallengeStatus.under_review;
      eventType = AuditEventType.metrics_recorded;
    }

    this.stateMachine.enforce(previousStatus, nextStatus);

    const dailyLossPct = drawdownCheck.dailyLossPct;
    const overallDrawdownPct = drawdownCheck.overallDrawdownPct;
    const now = new Date();

    const savedAccount = await this.prisma.$transaction(async (tx) => {
      const updated = await tx.challengeAccount.update({
        where: { id: accountId },
        data: {
          currentBalance,
          currentEquity,
          peakEquity,
          totalPnl,
          dailyLossPct,
          overallDrawdownPct,
          dailyLossBreached: drawdownCheck.dailyLossBreached,
          overallDrawdownBreached: drawdownCheck.overallDrawdownBreached,
          consistencyBreached: consistencyCheck.breached,
          riskBreached: riskCheck.breached,
          maxObservedLot,
          maxObservedRiskPct,
          status: nextStatus,
          failureReason,
          tradingDaysCount: projectedTradingDaysCount,
          dayId,
          dayStartBalance: dayReset.dayStartBalance,
          dayStartEquity: dayReset.dayStartEquity,
          intradayMinEquity: dayReset.intradayMinEquity,
          lastMetricsAt: now,
          failedAt:
            nextStatus === ChallengeStatus.failed ? now : account.failedAt,
          endedAt:
            nextStatus === ChallengeStatus.failed ? now : account.endedAt,
        },
      });

      await tx.metricSnapshot.create({
        data: {
          challengeAccountId: accountId,
          source: MetricSource.api,
          balance: currentBalance,
          equity: currentEquity,
          peakEquity,
          dayStartEquity: dayReset.dayStartEquity,
          dayId,
          realizedPnl,
          unrealizedPnl,
          dailyLossPct,
          overallDrawdownPct,
          tradingDaysCount: projectedTradingDaysCount,
          snapshotTime: new Date(),
          maxObservedLot,
          maxObservedRiskPct,
          rawPayloadJson: metrics,
        },
      });

      await tx.auditLog.create({
        data: {
          actorUserId: null,
          entityType: AuditEntityType.challenge_account,
          entityId: accountId,
          eventType,
          oldValuesJson: {
            status: previousStatus,
            currentBalance: account.currentBalance,
            currentEquity: account.currentEquity,
            tradingDaysCount: account.tradingDaysCount,
          },
          newValuesJson: {
            status: nextStatus,
            currentBalance,
            currentEquity,
            tradingDaysCount: projectedTradingDaysCount,
          },
          metadataJson: {
            source: "metrics_orchestrator",
            drawdownCheck,
            profitCheck,
            consistencyCheck,
            riskCheck,
            fraudCheck,
            isValidTradingDay,
            dayReset,
            dayId,
            failureReason,
          },
        },
      });

      return updated;
    });


    if (
      String(previousStatus) !== ChallengeStatus.failed &&
      nextStatus === ChallengeStatus.failed
    ) {
      try {
        const retakeDiscount =
          await this.retakeDiscountService.createForFailedAccount(accountId);

        await this.prisma.auditLog.create({
          data: {
            actorUserId: null,
            entityType: AuditEntityType.challenge_account,
            entityId: accountId,
            eventType: AuditEventType.admin_action,
            metadataJson: {
              source: "metrics_orchestrator",
              action: "retake_discount_created",
              retakeDiscountId: retakeDiscount.id,
              retakeDiscountCode: retakeDiscount.code,
              percentOff: Number(retakeDiscount.percentOff),
              originalPrice: Number(retakeDiscount.originalPrice),
              discountedPrice: Number(retakeDiscount.discountedPrice),
              expiresAt: retakeDiscount.expiresAt,
            },
          },
        });
      } catch (error) {
        await this.prisma.auditLog.create({
          data: {
            actorUserId: null,
            entityType: AuditEntityType.challenge_account,
            entityId: accountId,
            eventType: AuditEventType.admin_action,
            metadataJson: {
              source: "metrics_orchestrator",
              action: "retake_discount_create_failed",
              error: error instanceof Error ? error.message : String(error),
            },
          },
        });
      }
    }


    return {
      ok: true,
      challengeAccount: savedAccount,
      decision: {
        previousStatus,
        nextStatus,
        drawdownCheck,
        profitCheck,
        consistencyCheck,
        riskCheck,
        fraudCheck,
        isValidTradingDay,
        dayReset,
        dayId,
      },
    };
  }
}
