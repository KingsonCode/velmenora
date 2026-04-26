import { Injectable } from "@nestjs/common";

@Injectable()
export class FraudDetectorService {
  analyze(account: any, prevMetrics: any) {
    const flags: string[] = [];

    const currentEquity = Number(account.currentEquity);
    const currentBalance = Number(account.currentBalance);

    const previousEquity = Number(
      prevMetrics?.equity ?? prevMetrics?.currentEquity ?? currentEquity,
    );

    const equityJump =
      previousEquity > 0 ? (currentEquity - previousEquity) / previousEquity : 0;

    if (equityJump > 0.3) {
      flags.push("sudden_equity_spike");
    }

    if (currentEquity < currentBalance) {
      flags.push("floating_loss_pattern");
    }

    return {
      flagged: flags.length > 0,
      flags,
      equityJump,
    };
  }
}
