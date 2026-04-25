"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditEventType = void 0;
var AuditEventType;
(function (AuditEventType) {
    AuditEventType["USER_APPLIED"] = "user_applied";
    AuditEventType["PAYMENT_RECEIVED"] = "payment_received";
    AuditEventType["CHALLENGE_ASSIGNED"] = "challenge_assigned";
    AuditEventType["CHALLENGE_STARTED"] = "challenge_started";
    AuditEventType["METRICS_RECORDED"] = "metrics_recorded";
    AuditEventType["RULE_BREACHED"] = "rule_breached";
    AuditEventType["CHALLENGE_PASSED"] = "challenge_passed";
    AuditEventType["CHALLENGE_FAILED"] = "challenge_failed";
    AuditEventType["SUBMISSION_CREATED"] = "submission_created";
    AuditEventType["SUBMISSION_REVIEWED"] = "submission_reviewed";
    AuditEventType["PAYOUT_REQUESTED"] = "payout_requested";
    AuditEventType["PAYOUT_APPROVED"] = "payout_approved";
    AuditEventType["PAYOUT_PAID"] = "payout_paid";
    AuditEventType["ADMIN_ACTION"] = "admin_action";
})(AuditEventType || (exports.AuditEventType = AuditEventType = {}));
//# sourceMappingURL=audit-event-type.enum.js.map