import { Injectable } from "@nestjs/common";

@Injectable()
export class ProfitGuardService {
  evaluate(account: any) {
    const initialBalance = Number(account.initialBalance);
    const currentBalance = Number(account.currentBalance);
    const currentEquity = Number(account.currentEquity);

    const targetProfitPct = Number(
      account.targetProfitPct ?? account.challenge?.profitTargetPct ?? 8,
    );

    const minTradingDays = Number(
      account.minTradingDays ?? account.challenge?.minTradingDays ?? 5,
    );

    const tradingDaysCount = Number(account.tradingDaysCount ?? 0);

    const profitPct =
      ((currentBalance - initialBalance) / initialBalance) * 100;

    const hasFloatingLoss = currentEquity < currentBalance;
    const meetsTarget = profitPct >= targetProfitPct;
    const meetsDays = tradingDaysCount >= minTradingDays;

    const suspicious =
      tradingDaysCount > 0 && profitPct > tradingDaysCount * 5;

    return {
      profitPct,
      canPass: meetsTarget && meetsDays && !hasFloatingLoss && !suspicious,
      suspicious,
      reason: this.getReason({
        meetsTarget,
        meetsDays,
        hasFloatingLoss,
        suspicious,
      }),
    };
  }

  private getReason(flags: {
    meetsTarget: boolean;
    meetsDays: boolean;
    hasFloatingLoss: boolean;
    suspicious: boolean;
  }) {
    if (!flags.meetsTarget) return "target_not_reached";
    if (!flags.meetsDays) return "min_days_not_met";
    if (flags.hasFloatingLoss) return "floating_loss_present";
    if (flags.suspicious) return "suspicious_growth";
    return null;
  }
}
