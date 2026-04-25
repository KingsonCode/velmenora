"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CHALLENGE_STATUS_TRANSITIONS = void 0;
exports.canTransitionChallengeStatus = canTransitionChallengeStatus;
const challenge_status_enum_1 = require("../enums/challenge-status.enum");
exports.CHALLENGE_STATUS_TRANSITIONS = {
    [challenge_status_enum_1.ChallengeStatus.DRAFT]: [
        challenge_status_enum_1.ChallengeStatus.PENDING_PAYMENT,
        challenge_status_enum_1.ChallengeStatus.CANCELLED,
    ],
    [challenge_status_enum_1.ChallengeStatus.PENDING_PAYMENT]: [
        challenge_status_enum_1.ChallengeStatus.PAYMENT_CONFIRMED,
        challenge_status_enum_1.ChallengeStatus.CANCELLED,
    ],
    [challenge_status_enum_1.ChallengeStatus.PAYMENT_CONFIRMED]: [
        challenge_status_enum_1.ChallengeStatus.ASSIGNED,
        challenge_status_enum_1.ChallengeStatus.CANCELLED,
    ],
    [challenge_status_enum_1.ChallengeStatus.ASSIGNED]: [
        challenge_status_enum_1.ChallengeStatus.ACTIVE,
        challenge_status_enum_1.ChallengeStatus.SUSPENDED,
        challenge_status_enum_1.ChallengeStatus.CANCELLED,
    ],
    [challenge_status_enum_1.ChallengeStatus.ACTIVE]: [
        challenge_status_enum_1.ChallengeStatus.UNDER_REVIEW,
        challenge_status_enum_1.ChallengeStatus.FAILED,
        challenge_status_enum_1.ChallengeStatus.SUSPENDED,
        challenge_status_enum_1.ChallengeStatus.CANCELLED,
    ],
    [challenge_status_enum_1.ChallengeStatus.UNDER_REVIEW]: [
        challenge_status_enum_1.ChallengeStatus.PASSED,
        challenge_status_enum_1.ChallengeStatus.FAILED,
        challenge_status_enum_1.ChallengeStatus.SUSPENDED,
    ],
    [challenge_status_enum_1.ChallengeStatus.PASSED]: [
        challenge_status_enum_1.ChallengeStatus.PAYOUT_PENDING,
    ],
    [challenge_status_enum_1.ChallengeStatus.FAILED]: [],
    [challenge_status_enum_1.ChallengeStatus.PAYOUT_PENDING]: [
        challenge_status_enum_1.ChallengeStatus.PAYOUT_APPROVED,
        challenge_status_enum_1.ChallengeStatus.PAYOUT_REJECTED,
    ],
    [challenge_status_enum_1.ChallengeStatus.PAYOUT_APPROVED]: [
        challenge_status_enum_1.ChallengeStatus.PAYOUT_PAID,
    ],
    [challenge_status_enum_1.ChallengeStatus.PAYOUT_PAID]: [],
    [challenge_status_enum_1.ChallengeStatus.PAYOUT_REJECTED]: [],
    [challenge_status_enum_1.ChallengeStatus.SUSPENDED]: [
        challenge_status_enum_1.ChallengeStatus.ACTIVE,
        challenge_status_enum_1.ChallengeStatus.FAILED,
        challenge_status_enum_1.ChallengeStatus.CANCELLED,
    ],
    [challenge_status_enum_1.ChallengeStatus.CANCELLED]: [],
};
function canTransitionChallengeStatus(from, to) {
    return exports.CHALLENGE_STATUS_TRANSITIONS[from]?.includes(to) ?? false;
}
//# sourceMappingURL=challenge-status.transitions.js.map