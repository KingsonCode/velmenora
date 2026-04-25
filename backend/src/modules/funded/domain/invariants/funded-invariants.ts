import { ChallengeStatus } from "../enums/challenge-status.enum";

export function assertPositiveMoney(value: number, fieldName: string): void {
    if (!Number.isFinite(value) || value < 0) {
        throw new Error(`${fieldName} must be a valid non-negative number`);
    }
}

export function assertPercentage(value: number, fieldName: string): void {
    if (!Number.isFinite(value) || value < 0 || value > 100) {
        throw new Error(`${fieldName} must be between 0 and 100`);
    }
}

export function assertTradingDays(value: number): void {
    if (!Number.isInteger(value) || value < 0) {
        throw new Error("tradingDaysCount must be a non-negative integer");
    }
}

export function assertFailureReasonForFailedStatus(
    status: ChallengeStatus,
    failureReason?: string | null,
): void {
    if (status === ChallengeStatus.FAILED && !failureReason?.trim()) {
        throw new Error("failureReason is required when status is failed");
    }
}