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

    const dailyLossPct =
      ((dayStartEquity - currentEquity) / dayStartEquity) * 100;

    const overallDrawdownPct =
      ((initialBalance - currentEquity) / initialBalance) * 100;

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
