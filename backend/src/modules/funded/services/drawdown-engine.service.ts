import { Injectable } from "@nestjs/common";

@Injectable()
export class DrawdownEngineService {
  evaluate(account: any) {
    const initialBalance = Number(account.initialBalance);
    const currentEquity = Number(account.currentEquity);

    const maxDailyLossPct = Number(
      account.challenge?.maxDailyLossPct ?? account.maxDailyLossPct ?? 5,
    );

    const maxOverallDrawdownPct = Number(
      account.challenge?.maxOverallDrawdownPct ??
        account.maxOverallDrawdownPct ??
        10,
    );

    const dayStartEquity = Number(
      account.dayStartEquity ?? account.dayStartBalance ?? initialBalance,
    );

    const rawDailyLossPct =
      dayStartEquity > 0
        ? ((dayStartEquity - currentEquity) / dayStartEquity) * 100
        : 0;

    const rawOverallDrawdownPct =
      initialBalance > 0
        ? ((initialBalance - currentEquity) / initialBalance) * 100
        : 0;

    const dailyLossPct = Math.max(0, rawDailyLossPct);
    const overallDrawdownPct = Math.max(0, rawOverallDrawdownPct);

    const dailyLossBreached = dailyLossPct >= maxDailyLossPct;
    const overallDrawdownBreached =
      overallDrawdownPct >= maxOverallDrawdownPct;

    let failureReason: string | null = null;

    if (dailyLossBreached) {
      failureReason = `Daily loss limit breached: ${dailyLossPct.toFixed(
        2,
      )}% >= ${maxDailyLossPct.toFixed(2)}%`;
    }

    if (overallDrawdownBreached) {
      failureReason = `Overall drawdown limit breached: ${overallDrawdownPct.toFixed(
        2,
      )}% >= ${maxOverallDrawdownPct.toFixed(2)}%`;
    }

    return {
      dailyLossPct,
      overallDrawdownPct,
      dailyLossBreached,
      overallDrawdownBreached,
      breached: dailyLossBreached || overallDrawdownBreached,
      failureReason,
    };
  }
}
