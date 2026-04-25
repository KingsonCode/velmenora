import { ChallengeStatus } from "../enums/challenge-status.enum";
import type {
  ChallengeAccount,
  ChallengeMetrics,
  FrozenChallengeRules,
  RuleEvaluationResult,
} from "../types/funded-domain.types";

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

export function evaluateChallengeRules(
  account: Pick<
    ChallengeAccount,
    | "initialBalance"
    | "dayStartBalance"
    | "peakEquity"
    | "dailyLossBreached"
    | "overallDrawdownBreached"
  >,
  rules: FrozenChallengeRules,
  metrics: ChallengeMetrics,
): RuleEvaluationResult {
  const initialBalance = account.initialBalance;
  const dayStartBalance = account.dayStartBalance;

  const targetAmount = round2(initialBalance * (rules.profitTargetPct / 100));
  const netClosedProfit = round2(metrics.currentBalance - initialBalance);
  const targetReached = netClosedProfit >= targetAmount;

  const dailyLossAmount = round2(
    initialBalance * (rules.maxDailyLossPct / 100),
  );
  const dailyLossLimitEquity = round2(dayStartBalance - dailyLossAmount);
  const dailyLossBreached = metrics.currentEquity < dailyLossLimitEquity;

  const peakEquity = Math.max(account.peakEquity, metrics.currentEquity);
  const overallDrawdownPct =
    peakEquity > 0
      ? round2(((peakEquity - metrics.currentEquity) / peakEquity) * 100)
      : 0;
  const overallDrawdownAmount = round2(peakEquity - metrics.currentEquity);
  const overallDrawdownFloor = round2(
    peakEquity * (1 - rules.maxOverallDrawdownPct / 100),
  );
  const overallDrawdownBreached =
    Boolean(account.overallDrawdownBreached) ||
    overallDrawdownPct >= rules.maxOverallDrawdownPct;

  const minimumTradingDaysMet =
    metrics.tradingDaysCount >= rules.minTradingDays;

  const reasons: string[] = [];

  if (dailyLossBreached) {
    reasons.push("max_daily_loss_breached");
  }

  if (overallDrawdownBreached) {
    reasons.push("max_overall_drawdown_breached");
  }

  if (dailyLossBreached || overallDrawdownBreached) {
    return {
      canContinue: false,
      hasPassed: false,
      hasFailed: true,
      reasons,
      derived: {
        targetAmount,
        targetReached,
        dailyLossAmount,
        dailyLossLimitEquity,
        dailyLossBreached,
        overallDrawdownAmount,
        overallDrawdownFloor,
        overallDrawdownBreached,
        minimumTradingDaysMet,
      },
      recommendedStatus: ChallengeStatus.FAILED,
    };
  }

  if (targetReached && minimumTradingDaysMet) {
    return {
      canContinue: true,
      hasPassed: true,
      hasFailed: false,
      reasons: [],
      derived: {
        targetAmount,
        targetReached,
        dailyLossAmount,
        dailyLossLimitEquity,
        dailyLossBreached,
        overallDrawdownAmount,
        overallDrawdownFloor,
        overallDrawdownBreached,
        minimumTradingDaysMet,
      },
      recommendedStatus: ChallengeStatus.UNDER_REVIEW,
    };
  }

  return {
    canContinue: true,
    hasPassed: false,
    hasFailed: false,
    reasons: [],
    derived: {
      targetAmount,
      targetReached,
      dailyLossAmount,
      dailyLossLimitEquity,
      dailyLossBreached,
      overallDrawdownAmount,
      overallDrawdownFloor,
      overallDrawdownBreached,
      minimumTradingDaysMet,
    },
    recommendedStatus: ChallengeStatus.ACTIVE,
  };
}
