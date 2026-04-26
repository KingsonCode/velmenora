import { Injectable } from "@nestjs/common";

@Injectable()
export class DayResetService {
  getUtcDayId(date = new Date()) {
    return date.toISOString().slice(0, 10);
  }

  needsReset(account: any, currentDayId: string) {
    return account.dayId !== currentDayId;
  }

  apply(account: any, currentBalance: number, currentEquity: number) {
    const dayId = this.getUtcDayId(new Date());

    if (!this.needsReset(account, dayId)) {
      return {
        resetApplied: false,
        dayId,
        dayStartBalance: Number(account.dayStartBalance),
        dayStartEquity: Number(account.dayStartEquity ?? account.dayStartBalance),
        intradayMinEquity: Math.min(
          Number(account.intradayMinEquity ?? currentEquity),
          currentEquity,
        ),
      };
    }

    return {
      resetApplied: true,
      dayId,
      dayStartBalance: currentBalance,
      dayStartEquity: currentEquity,
      intradayMinEquity: currentEquity,
    };
  }
}
