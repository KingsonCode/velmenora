"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChallengeStatus = void 0;
var ChallengeStatus;
(function (ChallengeStatus) {
    ChallengeStatus["DRAFT"] = "draft";
    ChallengeStatus["PENDING_PAYMENT"] = "pending_payment";
    ChallengeStatus["PAYMENT_CONFIRMED"] = "payment_confirmed";
    ChallengeStatus["ASSIGNED"] = "assigned";
    ChallengeStatus["ACTIVE"] = "active";
    ChallengeStatus["UNDER_REVIEW"] = "under_review";
    ChallengeStatus["PASSED"] = "passed";
    ChallengeStatus["FAILED"] = "failed";
    ChallengeStatus["PAYOUT_PENDING"] = "payout_pending";
    ChallengeStatus["PAYOUT_APPROVED"] = "payout_approved";
    ChallengeStatus["PAYOUT_PAID"] = "payout_paid";
    ChallengeStatus["PAYOUT_REJECTED"] = "payout_rejected";
    ChallengeStatus["SUSPENDED"] = "suspended";
    ChallengeStatus["CANCELLED"] = "cancelled";
})(ChallengeStatus || (exports.ChallengeStatus = ChallengeStatus = {}));
//# sourceMappingURL=challenge-status.enum.js.map