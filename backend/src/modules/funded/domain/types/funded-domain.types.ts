import { ChallengeStatus } from "../enums/challenge-status.enum";
import { MetricSource } from "../enums/metric-source.enum";
import { PaymentProvider } from "../enums/payment-provider.enum";
import { PaymentStatus } from "../enums/payment-status.enum";
import { PayoutStatus } from "../enums/payout-status.enum";
import { ReviewStatus } from "../enums/review-status.enum";
import { SubmissionStatus } from "../enums/submission-status.enum";
import { SubmissionType } from "../enums/submission-type.enum";
import { UserRole } from "../enums/user-role.enum";

export type DomainId = string;

export type MoneyCurrency = string;

export type FundedUser = {
    id: DomainId;
    email: string;
    passwordHash: string;
    fullName: string;
    phone?: string | null;
    role: UserRole;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
};

export type FundedChallengePlan = {
    id: DomainId;
    slug: string;
    name: string;
    feeAmount: number;
    currency: MoneyCurrency;
    virtualBalance: number;
    profitTargetPct: number;
    maxDailyLossPct: number;
    maxOverallDrawdownPct: number;
    minTradingDays: number;
    maxDurationDays?: number | null;
    payoutRatioPct: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
};

export type ChallengeAccount = {
    id: DomainId;
    userId: DomainId;
    challengeId: DomainId;
    status: ChallengeStatus;
    paymentStatus: PaymentStatus;
    assignedAt?: Date | null;
    startedAt?: Date | null;
    endedAt?: Date | null;
    initialBalance: number;
    currentBalance: number;
    currentEquity: number;
    peakEquity: number;
    totalPnl: number;
    dailyLossPct: number;
    overallDrawdownPct: number;
    tradingDaysCount: number;
    dayStartBalance: number;
    dayStartAt?: Date | null;
    lastMetricsAt?: Date | null;
    passedAt?: Date | null;
    failedAt?: Date | null;
    failureReason?: string | null;
    createdAt: Date;
    updatedAt: Date;
};

export type FrozenChallengeRules = {
    profitTargetPct: number;
    maxDailyLossPct: number;
    maxOverallDrawdownPct: number;
    minTradingDays: number;
    maxDurationDays?: number | null;
    payoutRatioPct: number;
};

export type ChallengeMetrics = {
    source: MetricSource;
    currentBalance: number;
    currentEquity: number;
    realizedPnl: number;
    unrealizedPnl: number;
    dailyLossPct: number;
    overallDrawdownPct: number;
    tradingDaysCount: number;
    snapshotTime: Date;
};

export type RuleEvaluationDerived = {
    targetAmount: number;
    targetReached: boolean;
    dailyLossAmount: number;
    dailyLossLimitEquity: number;
    dailyLossBreached: boolean;
    overallDrawdownAmount: number;
    overallDrawdownFloor: number;
    overallDrawdownBreached: boolean;
    minimumTradingDaysMet: boolean;
};

export type RuleEvaluationResult = {
    canContinue: boolean;
    hasPassed: boolean;
    hasFailed: boolean;
    reasons: string[];
    derived: RuleEvaluationDerived;
    recommendedStatus: Extract<
        ChallengeStatus,
        ChallengeStatus.ACTIVE | ChallengeStatus.UNDER_REVIEW | ChallengeStatus.FAILED
    >;
};

export type ApplyForChallengeInput = {
    fullName: string;
    email: string;
    phone?: string;
    challengeSlug: string;
};

export type ApplyForChallengeOutput = {
    applicationId: string;
    challengeAccountId: string;
    userId: string;
    status: ChallengeStatus.PENDING_PAYMENT;
    paymentStatus: PaymentStatus.PENDING;
};

export type ConfirmPaymentInput = {
    provider: PaymentProvider;
    providerReference: string;
    amount: number;
    currency: string;
    challengeAccountId?: string;
    rawPayload?: unknown;
};

export type ConfirmPaymentOutput = {
    paymentId: string;
    challengeAccountId: string;
    paymentStatus: PaymentStatus.PAID;
    challengeStatus: ChallengeStatus.ASSIGNED;
    idempotentReplay: boolean;
};

export type StartChallengeInput = {
    challengeAccountId: string;
    actorUserId: string;
};

export type StartChallengeOutput = {
    challengeAccountId: string;
    status: ChallengeStatus.ACTIVE;
    startedAt: Date;
};

export type RecordMetricsInput = {
    challengeAccountId: string;
    source: MetricSource;
    currentBalance: number;
    currentEquity: number;
    realizedPnl: number;
    unrealizedPnl: number;
    tradingDaysCount: number;
    snapshotTime?: Date;
    rawPayload?: unknown;
};

export type RecordMetricsOutput = {
    metricSnapshotId: string;
    challengeStatus: ChallengeStatus;
    evaluation: RuleEvaluationResult;
};

export type SubmitProofInput = {
    challengeAccountId: string;
    userId: string;
    submissionType: SubmissionType;
    note?: string;
    fileUrl?: string;
};

export type SubmitProofOutput = {
    submissionId: string;
    status: SubmissionStatus.RECEIVED;
};

export type ReviewChallengeInput = {
    challengeAccountId: string;
    reviewerId: string;
    submissionId?: string;
    decision: ReviewStatus.APPROVED | ReviewStatus.REJECTED | ReviewStatus.NEEDS_MORE_INFO;
    decisionNote?: string;
    metadata?: unknown;
};

export type ReviewChallengeOutput = {
    reviewDecisionId: string;
    challengeStatus: ChallengeStatus;
};

export type RequestPayoutInput = {
    challengeAccountId: string;
    userId: string;
    requestedAmount: number;
    currency: string;
};

export type RequestPayoutOutput = {
    payoutRequestId: string;
    status: PayoutStatus.UNDER_REVIEW;
};