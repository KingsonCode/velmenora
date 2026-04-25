"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.evaluateChallengeRules = evaluateChallengeRules;
const challenge_status_enum_1 = require("../enums/challenge-status.enum");
function round2(value) {
    return Math.round(value * 100) / 100;
}
function evaluateChallengeRules(account, rules, metrics) {
    const initialBalance = account.initialBalance;
    const dayStartBalance = account.dayStartBalance;
    const targetAmount = round2(initialBalance * (rules.profitTargetPct / 100));
    const netClosedProfit = round2(metrics.currentBalance - initialBalance);
    const targetReached = netClosedProfit >= targetAmount;
    const dailyLossAmount = round2(initialBalance * (rules.maxDailyLossPct / 100));
    const dailyLossLimitEquity = round2(dayStartBalance - dailyLossAmount);
    const dailyLossBreached = metrics.currentEquity < dailyLossLimitEquity;
    const overallDrawdownAmount = round2(initialBalance * (rules.maxOverallDrawdownPct / 100));
    const overallDrawdownFloor = round2(initialBalance - overallDrawdownAmount);
    const overallDrawdownBreached = metrics.currentEquity < overallDrawdownFloor;
    const minimumTradingDaysMet = metrics.tradingDaysCount >= rules.minTradingDays;
    const reasons = [];
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
            recommendedStatus: challenge_status_enum_1.ChallengeStatus.FAILED,
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
            recommendedStatus: challenge_status_enum_1.ChallengeStatus.UNDER_REVIEW,
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
        recommendedStatus: challenge_status_enum_1.ChallengeStatus.ACTIVE,
    };
}
//# sourceMappingURL=evaluate-challenge-rules.js.map