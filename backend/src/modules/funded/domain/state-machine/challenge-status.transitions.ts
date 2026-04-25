import { ChallengeStatus } from "../enums/challenge-status.enum";

export const CHALLENGE_STATUS_TRANSITIONS: Record<ChallengeStatus, ChallengeStatus[]> = {
    [ChallengeStatus.DRAFT]: [
        ChallengeStatus.PENDING_PAYMENT,
        ChallengeStatus.CANCELLED,
    ],
    [ChallengeStatus.PENDING_PAYMENT]: [
        ChallengeStatus.PAYMENT_CONFIRMED,
        ChallengeStatus.CANCELLED,
    ],
    [ChallengeStatus.PAYMENT_CONFIRMED]: [
        ChallengeStatus.ASSIGNED,
        ChallengeStatus.CANCELLED,
    ],
    [ChallengeStatus.ASSIGNED]: [
        ChallengeStatus.ACTIVE,
        ChallengeStatus.SUSPENDED,
        ChallengeStatus.CANCELLED,
    ],
    [ChallengeStatus.ACTIVE]: [
        ChallengeStatus.UNDER_REVIEW,
        ChallengeStatus.FAILED,
        ChallengeStatus.SUSPENDED,
        ChallengeStatus.CANCELLED,
    ],
    [ChallengeStatus.UNDER_REVIEW]: [
        ChallengeStatus.PASSED,
        ChallengeStatus.FAILED,
        ChallengeStatus.SUSPENDED,
    ],
    [ChallengeStatus.PASSED]: [
        ChallengeStatus.PAYOUT_PENDING,
    ],
    [ChallengeStatus.FAILED]: [],
    [ChallengeStatus.PAYOUT_PENDING]: [
        ChallengeStatus.PAYOUT_APPROVED,
        ChallengeStatus.PAYOUT_REJECTED,
    ],
    [ChallengeStatus.PAYOUT_APPROVED]: [
        ChallengeStatus.PAYOUT_PAID,
    ],
    [ChallengeStatus.PAYOUT_PAID]: [],
    [ChallengeStatus.PAYOUT_REJECTED]: [],
    [ChallengeStatus.SUSPENDED]: [
        ChallengeStatus.ACTIVE,
        ChallengeStatus.FAILED,
        ChallengeStatus.CANCELLED,
    ],
    [ChallengeStatus.CANCELLED]: [],
};

export function canTransitionChallengeStatus(
    from: ChallengeStatus,
    to: ChallengeStatus,
): boolean {
    return CHALLENGE_STATUS_TRANSITIONS[from]?.includes(to) ?? false;
}