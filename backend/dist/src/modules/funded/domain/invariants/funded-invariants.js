"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assertPositiveMoney = assertPositiveMoney;
exports.assertPercentage = assertPercentage;
exports.assertTradingDays = assertTradingDays;
exports.assertFailureReasonForFailedStatus = assertFailureReasonForFailedStatus;
const challenge_status_enum_1 = require("../enums/challenge-status.enum");
function assertPositiveMoney(value, fieldName) {
    if (!Number.isFinite(value) || value < 0) {
        throw new Error(`${fieldName} must be a valid non-negative number`);
    }
}
function assertPercentage(value, fieldName) {
    if (!Number.isFinite(value) || value < 0 || value > 100) {
        throw new Error(`${fieldName} must be between 0 and 100`);
    }
}
function assertTradingDays(value) {
    if (!Number.isInteger(value) || value < 0) {
        throw new Error("tradingDaysCount must be a non-negative integer");
    }
}
function assertFailureReasonForFailedStatus(status, failureReason) {
    if (status === challenge_status_enum_1.ChallengeStatus.FAILED && !failureReason?.trim()) {
        throw new Error("failureReason is required when status is failed");
    }
}
//# sourceMappingURL=funded-invariants.js.map