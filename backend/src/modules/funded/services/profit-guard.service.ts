import { Injectable } from "@nestjs/common";

@Injectable()
export class ProfitGuardService {
  evaluate(account: any) {
    const initialBalance = Number(account.initialBalance);
    const currentBalance = Number(account.currentBalance);
    const currentEquity = Number(account.currentEquity);

    const targetProfitPct = Number(
      account.targetProfitPct ?? account.challenge?.profitTargetPct ?? 10,
    );

    const minTradingDays = Number(
      account.minTradingDays ?? account.challenge?.minTradingDays ?? 7,
    );

    const tradingDaysCount = Number(account.tradingDaysCount ?? 0);

    const maxDailyProfitPct = Number(
      account.maxDailyProfitPct ?? account.challenge?.maxDailyProfitPct ?? 35,
    );

    const bestDayProfit = Number(account.bestDayProfit ?? 0);

    const profit = currentBalance - initialBalance;
    const profitPct = initialBalance > 0 ? (profit / initialBalance) * 100 : 0;

    const bestDayProfitPctOfTotal =
      profit > 0 ? (bestDayProfit / profit) * 100 : 0;

    const hasFloatingLoss = currentEquity < currentBalance;
    const meetsTarget = profitPct >= targetProfitPct;
    const meetsDays = tradingDaysCount >= minTradingDays;

    const consistencyBreached =
      profit > 0 &&
      meetsTarget &&
      meetsDays &&
      bestDayProfitPctOfTotal > maxDailyProfitPct;

    const suspicious =
      tradingDaysCount > 0 && profitPct > tradingDaysCount * 5;

    return {
      profit,
      profitPct,
      targetProfitPct,
      minTradingDays,
      tradingDaysCount,
      maxDailyProfitPct,
      bestDayProfit,
      bestDayProfitPctOfTotal,
      meetsTarget,
      meetsDays,
      hasFloatingLoss,
      consistencyBreached,
      suspicious,
      canPass:
        meetsTarget &&
        meetsDays &&
        !hasFloatingLoss &&
        !consistencyBreached &&
        !suspicious,
      reason: this.getReason({
        meetsTarget,
        meetsDays,
        hasFloatingLoss,
        consistencyBreached,
        suspicious,
      }),
    };
  }

  private getReason(flags: {
    meetsTarget: boolean;
    meetsDays: boolean;
    hasFloatingLoss: boolean;
    consistencyBreached: boolean;
    suspicious: boolean;
  }) {
    if (!flags.meetsTarget) return "target_not_reached";
    if (!flags.meetsDays) return "min_days_not_met";
    if (flags.hasFloatingLoss) return "floating_loss_present";
    if (flags.consistencyBreached) return "consistency_rule_breached";
    if (flags.suspicious) return "suspicious_growth";
    return null;
  }
}
