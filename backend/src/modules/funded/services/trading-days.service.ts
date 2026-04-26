import { Injectable } from "@nestjs/common";

@Injectable()
export class TradingDaysService {
  isValidTradingDay(metrics: any) {
    const closedTrades = Number(metrics.closedTrades ?? 0);
    const volume = Number(metrics.volume ?? 0);
    const tradeCount = Number(metrics.tradeCount ?? 0);
    const tradingDurationMinutes = Number(metrics.tradingDurationMinutes ?? 0);
    const pnl = Number(metrics.pnl ?? 0);

    if (closedTrades < 1) return false;
    if (volume < 0.1) return false;
    if (tradeCount < 2) return false;
    if (tradingDurationMinutes < 10) return false;
    if (pnl === 0 && volume < 1) return false;

    return true;
  }

  computeDayId(date = new Date()) {
    return date.toISOString().slice(0, 10);
  }
}
