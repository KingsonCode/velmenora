"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PayoutStatus = void 0;
var PayoutStatus;
(function (PayoutStatus) {
    PayoutStatus["DRAFT"] = "draft";
    PayoutStatus["REQUESTED"] = "requested";
    PayoutStatus["ELIGIBILITY_FAILED"] = "eligibility_failed";
    PayoutStatus["UNDER_REVIEW"] = "under_review";
    PayoutStatus["APPROVED"] = "approved";
    PayoutStatus["PAID"] = "paid";
    PayoutStatus["REJECTED"] = "rejected";
    PayoutStatus["CANCELLED"] = "cancelled";
})(PayoutStatus || (exports.PayoutStatus = PayoutStatus = {}));
//# sourceMappingURL=payout-status.enum.js.map