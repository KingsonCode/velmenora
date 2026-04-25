-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('trader', 'admin', 'super_admin');

-- CreateEnum
CREATE TYPE "ChallengeStatus" AS ENUM ('draft', 'pending_payment', 'payment_confirmed', 'assigned', 'active', 'under_review', 'passed', 'failed', 'payout_pending', 'payout_approved', 'payout_paid', 'payout_rejected', 'suspended', 'cancelled');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('pending', 'paid', 'failed', 'refunded', 'manual_review');

-- CreateEnum
CREATE TYPE "SubmissionStatus" AS ENUM ('pending', 'received', 'under_review', 'approved', 'rejected');

-- CreateEnum
CREATE TYPE "ReviewStatus" AS ENUM ('pending', 'approved', 'rejected', 'needs_more_info');

-- CreateEnum
CREATE TYPE "PayoutStatus" AS ENUM ('draft', 'requested', 'eligibility_failed', 'under_review', 'approved', 'paid', 'rejected', 'cancelled');

-- CreateEnum
CREATE TYPE "MetricSource" AS ENUM ('manual', 'admin', 'api', 'import');

-- CreateEnum
CREATE TYPE "SubmissionType" AS ENUM ('screenshot', 'statement', 'account_report', 'other');

-- CreateEnum
CREATE TYPE "PaymentProvider" AS ENUM ('manual', 'paypal', 'stripe', 'flutterwave', 'paystack', 'mpesa', 'other');

-- CreateEnum
CREATE TYPE "AuditEventType" AS ENUM ('user_applied', 'payment_received', 'challenge_assigned', 'challenge_started', 'metrics_recorded', 'rule_breached', 'challenge_passed', 'challenge_failed', 'submission_created', 'submission_reviewed', 'payout_requested', 'payout_approved', 'payout_paid', 'admin_action');

-- CreateEnum
CREATE TYPE "AuditEntityType" AS ENUM ('user', 'funded_challenge', 'challenge_account', 'payment', 'submission', 'review_decision', 'payout_request', 'admin_note');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "phone" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'trader',
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "funded_challenges" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "fee_amount" DECIMAL(12,2) NOT NULL,
    "currency" VARCHAR(10) NOT NULL,
    "virtual_balance" DECIMAL(14,2) NOT NULL,
    "profit_target_pct" DECIMAL(5,2) NOT NULL,
    "max_daily_loss_pct" DECIMAL(5,2) NOT NULL,
    "max_overall_drawdown_pct" DECIMAL(5,2) NOT NULL,
    "min_trading_days" INTEGER NOT NULL,
    "max_duration_days" INTEGER,
    "payout_ratio_pct" DECIMAL(5,2) NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "funded_challenges_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "challenge_accounts" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "challenge_id" TEXT NOT NULL,
    "status" "ChallengeStatus" NOT NULL DEFAULT 'pending_payment',
    "payment_status" "PaymentStatus" NOT NULL DEFAULT 'pending',
    "assigned_at" TIMESTAMP(3),
    "started_at" TIMESTAMP(3),
    "ended_at" TIMESTAMP(3),
    "initial_balance" DECIMAL(14,2) NOT NULL,
    "day_start_balance" DECIMAL(14,2) NOT NULL,
    "day_start_at" TIMESTAMP(3),
    "current_balance" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "current_equity" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "peak_equity" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "total_pnl" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "daily_loss_pct" DECIMAL(5,2) NOT NULL DEFAULT 0,
    "overall_drawdown_pct" DECIMAL(5,2) NOT NULL DEFAULT 0,
    "trading_days_count" INTEGER NOT NULL DEFAULT 0,
    "last_metrics_at" TIMESTAMP(3),
    "passed_at" TIMESTAMP(3),
    "failed_at" TIMESTAMP(3),
    "failure_reason" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "challenge_accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "challenge_rule_snapshots" (
    "id" TEXT NOT NULL,
    "challenge_account_id" TEXT NOT NULL,
    "profit_target_pct" DECIMAL(5,2) NOT NULL,
    "max_daily_loss_pct" DECIMAL(5,2) NOT NULL,
    "max_overall_drawdown_pct" DECIMAL(5,2) NOT NULL,
    "min_trading_days" INTEGER NOT NULL,
    "max_duration_days" INTEGER,
    "payout_ratio_pct" DECIMAL(5,2) NOT NULL,
    "raw_rules_json" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "challenge_rule_snapshots_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "metric_snapshots" (
    "id" TEXT NOT NULL,
    "challenge_account_id" TEXT NOT NULL,
    "source" "MetricSource" NOT NULL,
    "balance" DECIMAL(14,2) NOT NULL,
    "equity" DECIMAL(14,2) NOT NULL,
    "realized_pnl" DECIMAL(14,2) NOT NULL,
    "unrealized_pnl" DECIMAL(14,2) NOT NULL,
    "daily_loss_pct" DECIMAL(5,2) NOT NULL,
    "overall_drawdown_pct" DECIMAL(5,2) NOT NULL,
    "trading_days_count" INTEGER NOT NULL,
    "snapshot_time" TIMESTAMP(3) NOT NULL,
    "raw_payload_json" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "metric_snapshots_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "submissions" (
    "id" TEXT NOT NULL,
    "challenge_account_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "submission_type" "SubmissionType" NOT NULL,
    "note" TEXT,
    "file_url" TEXT,
    "status" "SubmissionStatus" NOT NULL DEFAULT 'received',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "submissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "review_decisions" (
    "id" TEXT NOT NULL,
    "submission_id" TEXT,
    "challenge_account_id" TEXT NOT NULL,
    "reviewer_id" TEXT NOT NULL,
    "status" "ReviewStatus" NOT NULL,
    "decision_note" TEXT,
    "metadata_json" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "review_decisions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payout_requests" (
    "id" TEXT NOT NULL,
    "challenge_account_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "requested_amount" DECIMAL(12,2) NOT NULL,
    "currency" VARCHAR(10) NOT NULL,
    "status" "PayoutStatus" NOT NULL DEFAULT 'requested',
    "eligibility_snapshot_json" JSONB NOT NULL,
    "rejection_reason" TEXT,
    "requested_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reviewed_at" TIMESTAMP(3),
    "paid_at" TIMESTAMP(3),
    "reviewer_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payout_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payments" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "challenge_account_id" TEXT,
    "provider" "PaymentProvider" NOT NULL,
    "provider_reference" TEXT,
    "amount" DECIMAL(12,2) NOT NULL,
    "currency" VARCHAR(10) NOT NULL,
    "status" "PaymentStatus" NOT NULL DEFAULT 'pending',
    "paid_at" TIMESTAMP(3),
    "raw_payload_json" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" TEXT NOT NULL,
    "actor_user_id" TEXT,
    "entity_type" "AuditEntityType" NOT NULL,
    "entity_id" TEXT NOT NULL,
    "event_type" "AuditEventType" NOT NULL,
    "old_values_json" JSONB,
    "new_values_json" JSONB,
    "metadata_json" JSONB,
    "ip_address" TEXT,
    "user_agent" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admin_notes" (
    "id" TEXT NOT NULL,
    "challenge_account_id" TEXT NOT NULL,
    "admin_user_id" TEXT NOT NULL,
    "note" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "admin_notes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_role_idx" ON "users"("role");

-- CreateIndex
CREATE INDEX "users_created_at_idx" ON "users"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "funded_challenges_slug_key" ON "funded_challenges"("slug");

-- CreateIndex
CREATE INDEX "funded_challenges_is_active_idx" ON "funded_challenges"("is_active");

-- CreateIndex
CREATE INDEX "funded_challenges_created_at_idx" ON "funded_challenges"("created_at");

-- CreateIndex
CREATE INDEX "challenge_accounts_user_id_idx" ON "challenge_accounts"("user_id");

-- CreateIndex
CREATE INDEX "challenge_accounts_challenge_id_idx" ON "challenge_accounts"("challenge_id");

-- CreateIndex
CREATE INDEX "challenge_accounts_status_idx" ON "challenge_accounts"("status");

-- CreateIndex
CREATE INDEX "challenge_accounts_payment_status_idx" ON "challenge_accounts"("payment_status");

-- CreateIndex
CREATE INDEX "challenge_accounts_created_at_idx" ON "challenge_accounts"("created_at");

-- CreateIndex
CREATE INDEX "challenge_accounts_user_id_challenge_id_idx" ON "challenge_accounts"("user_id", "challenge_id");

-- CreateIndex
CREATE INDEX "challenge_accounts_user_id_status_idx" ON "challenge_accounts"("user_id", "status");

-- CreateIndex
CREATE INDEX "challenge_rule_snapshots_challenge_account_id_idx" ON "challenge_rule_snapshots"("challenge_account_id");

-- CreateIndex
CREATE INDEX "metric_snapshots_challenge_account_id_idx" ON "metric_snapshots"("challenge_account_id");

-- CreateIndex
CREATE INDEX "metric_snapshots_snapshot_time_idx" ON "metric_snapshots"("snapshot_time");

-- CreateIndex
CREATE INDEX "metric_snapshots_challenge_account_id_snapshot_time_idx" ON "metric_snapshots"("challenge_account_id", "snapshot_time");

-- CreateIndex
CREATE INDEX "submissions_challenge_account_id_idx" ON "submissions"("challenge_account_id");

-- CreateIndex
CREATE INDEX "submissions_user_id_idx" ON "submissions"("user_id");

-- CreateIndex
CREATE INDEX "submissions_status_idx" ON "submissions"("status");

-- CreateIndex
CREATE INDEX "submissions_created_at_idx" ON "submissions"("created_at");

-- CreateIndex
CREATE INDEX "review_decisions_submission_id_idx" ON "review_decisions"("submission_id");

-- CreateIndex
CREATE INDEX "review_decisions_challenge_account_id_idx" ON "review_decisions"("challenge_account_id");

-- CreateIndex
CREATE INDEX "review_decisions_reviewer_id_idx" ON "review_decisions"("reviewer_id");

-- CreateIndex
CREATE INDEX "review_decisions_status_idx" ON "review_decisions"("status");

-- CreateIndex
CREATE INDEX "review_decisions_created_at_idx" ON "review_decisions"("created_at");

-- CreateIndex
CREATE INDEX "payout_requests_challenge_account_id_idx" ON "payout_requests"("challenge_account_id");

-- CreateIndex
CREATE INDEX "payout_requests_user_id_idx" ON "payout_requests"("user_id");

-- CreateIndex
CREATE INDEX "payout_requests_status_idx" ON "payout_requests"("status");

-- CreateIndex
CREATE INDEX "payout_requests_requested_at_idx" ON "payout_requests"("requested_at");

-- CreateIndex
CREATE INDEX "payout_requests_reviewer_id_idx" ON "payout_requests"("reviewer_id");

-- CreateIndex
CREATE UNIQUE INDEX "payments_provider_reference_key" ON "payments"("provider_reference");

-- CreateIndex
CREATE INDEX "payments_user_id_idx" ON "payments"("user_id");

-- CreateIndex
CREATE INDEX "payments_challenge_account_id_idx" ON "payments"("challenge_account_id");

-- CreateIndex
CREATE INDEX "payments_status_idx" ON "payments"("status");

-- CreateIndex
CREATE INDEX "payments_created_at_idx" ON "payments"("created_at");

-- CreateIndex
CREATE INDEX "audit_logs_actor_user_id_idx" ON "audit_logs"("actor_user_id");

-- CreateIndex
CREATE INDEX "audit_logs_entity_type_entity_id_idx" ON "audit_logs"("entity_type", "entity_id");

-- CreateIndex
CREATE INDEX "audit_logs_event_type_idx" ON "audit_logs"("event_type");

-- CreateIndex
CREATE INDEX "audit_logs_created_at_idx" ON "audit_logs"("created_at");

-- CreateIndex
CREATE INDEX "admin_notes_challenge_account_id_idx" ON "admin_notes"("challenge_account_id");

-- CreateIndex
CREATE INDEX "admin_notes_admin_user_id_idx" ON "admin_notes"("admin_user_id");

-- CreateIndex
CREATE INDEX "admin_notes_created_at_idx" ON "admin_notes"("created_at");

-- AddForeignKey
ALTER TABLE "challenge_accounts" ADD CONSTRAINT "challenge_accounts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "challenge_accounts" ADD CONSTRAINT "challenge_accounts_challenge_id_fkey" FOREIGN KEY ("challenge_id") REFERENCES "funded_challenges"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "challenge_rule_snapshots" ADD CONSTRAINT "challenge_rule_snapshots_challenge_account_id_fkey" FOREIGN KEY ("challenge_account_id") REFERENCES "challenge_accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "metric_snapshots" ADD CONSTRAINT "metric_snapshots_challenge_account_id_fkey" FOREIGN KEY ("challenge_account_id") REFERENCES "challenge_accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "submissions" ADD CONSTRAINT "submissions_challenge_account_id_fkey" FOREIGN KEY ("challenge_account_id") REFERENCES "challenge_accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "submissions" ADD CONSTRAINT "submissions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "review_decisions" ADD CONSTRAINT "review_decisions_submission_id_fkey" FOREIGN KEY ("submission_id") REFERENCES "submissions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "review_decisions" ADD CONSTRAINT "review_decisions_challenge_account_id_fkey" FOREIGN KEY ("challenge_account_id") REFERENCES "challenge_accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "review_decisions" ADD CONSTRAINT "review_decisions_reviewer_id_fkey" FOREIGN KEY ("reviewer_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payout_requests" ADD CONSTRAINT "payout_requests_challenge_account_id_fkey" FOREIGN KEY ("challenge_account_id") REFERENCES "challenge_accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payout_requests" ADD CONSTRAINT "payout_requests_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payout_requests" ADD CONSTRAINT "payout_requests_reviewer_id_fkey" FOREIGN KEY ("reviewer_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_challenge_account_id_fkey" FOREIGN KEY ("challenge_account_id") REFERENCES "challenge_accounts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_actor_user_id_fkey" FOREIGN KEY ("actor_user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "admin_notes" ADD CONSTRAINT "admin_notes_challenge_account_id_fkey" FOREIGN KEY ("challenge_account_id") REFERENCES "challenge_accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "admin_notes" ADD CONSTRAINT "admin_notes_admin_user_id_fkey" FOREIGN KEY ("admin_user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;


ALTER TABLE funded_challenges
ADD CONSTRAINT chk_fee_amount_non_negative
CHECK (fee_amount >= 0);

ALTER TABLE funded_challenges
ADD CONSTRAINT chk_virtual_balance_positive
CHECK (virtual_balance > 0);

ALTER TABLE funded_challenges
ADD CONSTRAINT chk_profit_target_pct_range
CHECK (profit_target_pct >= 0 AND profit_target_pct <= 100);

ALTER TABLE funded_challenges
ADD CONSTRAINT chk_max_daily_loss_pct_range
CHECK (max_daily_loss_pct >= 0 AND max_daily_loss_pct <= 100);

ALTER TABLE funded_challenges
ADD CONSTRAINT chk_max_overall_drawdown_pct_range
CHECK (max_overall_drawdown_pct >= 0 AND max_overall_drawdown_pct <= 100);

ALTER TABLE funded_challenges
ADD CONSTRAINT chk_payout_ratio_pct_range
CHECK (payout_ratio_pct >= 0 AND payout_ratio_pct <= 100);

ALTER TABLE challenge_accounts
ADD CONSTRAINT chk_initial_balance_non_negative
CHECK (initial_balance >= 0);

ALTER TABLE challenge_accounts
ADD CONSTRAINT chk_day_start_balance_non_negative
CHECK (day_start_balance >= 0);

ALTER TABLE challenge_accounts
ADD CONSTRAINT chk_trading_days_count_non_negative
CHECK (trading_days_count >= 0);

ALTER TABLE payout_requests
ADD CONSTRAINT chk_requested_amount_positive
CHECK (requested_amount > 0);

ALTER TABLE payments
ADD CONSTRAINT chk_payment_amount_non_negative
CHECK (amount >= 0);

ALTER TABLE challenge_accounts
ADD CONSTRAINT chk_started_at_after_created_at
CHECK (
  started_at IS NULL OR started_at >= created_at
);

ALTER TABLE challenge_accounts
ADD CONSTRAINT chk_assigned_at_after_created_at
CHECK (
  assigned_at IS NULL OR assigned_at >= created_at
);

ALTER TABLE challenge_accounts
ADD CONSTRAINT chk_ended_at_after_created_at
CHECK (
  ended_at IS NULL OR ended_at >= created_at
);

ALTER TABLE challenge_accounts
ADD CONSTRAINT chk_passed_at_after_created_at
CHECK (
  passed_at IS NULL OR passed_at >= created_at
);

ALTER TABLE challenge_accounts
ADD CONSTRAINT chk_failed_at_after_created_at
CHECK (
  failed_at IS NULL OR failed_at >= created_at
);

ALTER TABLE challenge_accounts
ADD CONSTRAINT chk_ended_at_after_started_at
CHECK (
  ended_at IS NULL OR started_at IS NULL OR ended_at >= started_at
);

ALTER TABLE challenge_accounts
ADD CONSTRAINT chk_failed_requires_failure_reason
CHECK (
  status <> 'failed' OR failure_reason IS NOT NULL
);

ALTER TABLE challenge_accounts
ADD CONSTRAINT chk_passed_requires_passed_at
CHECK (
  status <> 'passed' OR passed_at IS NOT NULL
);

ALTER TABLE challenge_accounts
ADD CONSTRAINT chk_failed_requires_failed_at
CHECK (
  status <> 'failed' OR failed_at IS NOT NULL
);

ALTER TABLE payout_requests
ADD CONSTRAINT chk_payout_reviewed_at_when_terminal
CHECK (
  status NOT IN ('approved', 'paid', 'rejected')
  OR reviewed_at IS NOT NULL
);

ALTER TABLE payout_requests
ADD CONSTRAINT chk_payout_paid_at_when_paid
CHECK (
  status <> 'paid' OR paid_at IS NOT NULL
);

ALTER TABLE payout_requests
ADD CONSTRAINT chk_payout_reviewer_when_reviewed
CHECK (
  status NOT IN ('approved', 'paid', 'rejected')
  OR reviewer_id IS NOT NULL
);

ALTER TABLE payout_requests
ADD CONSTRAINT chk_payout_rejection_reason_when_rejected
CHECK (
  status <> 'rejected' OR rejection_reason IS NOT NULL
);

ALTER TABLE review_decisions
ADD CONSTRAINT chk_review_decision_note_when_rejected
CHECK (
  status <> 'rejected' OR decision_note IS NOT NULL
);

CREATE UNIQUE INDEX unique_active_challenge_per_user_plan
ON challenge_accounts (user_id, challenge_id)
WHERE status IN (
  'pending_payment',
  'payment_confirmed',
  'assigned',
  'active',
  'under_review',
  'passed',
  'payout_pending',
  'payout_approved'
);

CREATE UNIQUE INDEX unique_open_payout_per_challenge_account
ON payout_requests (challenge_account_id)
WHERE status IN (
  'requested',
  'under_review',
  'approved'
);

CREATE UNIQUE INDEX unique_rule_snapshot_per_challenge_account
ON challenge_rule_snapshots (challenge_account_id);

CREATE UNIQUE INDEX unique_paid_payment_per_challenge_account
ON payments (challenge_account_id)
WHERE status = 'paid' AND challenge_account_id IS NOT NULL;

CREATE INDEX idx_submissions_challenge_account_created_at
ON submissions (challenge_account_id, created_at DESC);

CREATE INDEX idx_review_decisions_challenge_account_created_at
ON review_decisions (challenge_account_id, created_at DESC);

CREATE INDEX idx_metric_snapshots_challenge_account_snapshot_time_desc
ON metric_snapshots (challenge_account_id, snapshot_time DESC);

CREATE INDEX idx_audit_logs_entity_created_at
ON audit_logs (entity_type, entity_id, created_at DESC);

CREATE INDEX idx_payout_requests_challenge_account_created_at
ON payout_requests (challenge_account_id, created_at DESC);

CREATE INDEX idx_challenge_accounts_status_created_at
ON challenge_accounts (status, created_at DESC);

CREATE INDEX idx_payout_requests_status_requested_at
ON payout_requests (status, requested_at DESC);
