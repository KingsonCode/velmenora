-- Create dedicated affiliate commission status enum.
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'AffiliateCommissionStatus') THEN
    CREATE TYPE "AffiliateCommissionStatus" AS ENUM (
      'pending',
      'approved',
      'rejected',
      'payout_requested',
      'paid'
    );
  END IF;
END $$;

-- Create dedicated affiliate payout status enum.
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'AffiliatePayoutStatus') THEN
    CREATE TYPE "AffiliatePayoutStatus" AS ENUM (
      'requested',
      'approved',
      'rejected',
      'paid',
      'cancelled'
    );
  END IF;
END $$;

-- Add affiliate_payout enum value into AuditEntityType if not present.
ALTER TYPE "AuditEntityType" ADD VALUE IF NOT EXISTS 'affiliate_payout';

-- Affiliate payout batch table.
CREATE TABLE IF NOT EXISTS "affiliate_payouts" (
  "id" TEXT NOT NULL,
  "affiliate_id" TEXT NOT NULL,
  "amount" DECIMAL(12,2) NOT NULL,
  "currency" VARCHAR(10) NOT NULL,
  "status" "AffiliatePayoutStatus" NOT NULL DEFAULT 'requested',
  "method" VARCHAR(50),
  "reference" VARCHAR(120),
  "notes" TEXT,
  "requested_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "approved_at" TIMESTAMP(3),
  "rejected_at" TIMESTAMP(3),
  "paid_at" TIMESTAMP(3),
  "reviewer_id" TEXT,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "affiliate_payouts_pkey" PRIMARY KEY ("id")
);

-- Add nullable payout relation on affiliate commissions first.
ALTER TABLE "affiliate_commissions"
  ADD COLUMN IF NOT EXISTS "affiliate_payout_id" TEXT;

-- Convert affiliate_commissions.status away from generic PayoutStatus.
ALTER TABLE "affiliate_commissions"
  ALTER COLUMN "status" DROP DEFAULT;

ALTER TABLE "affiliate_commissions"
  ALTER COLUMN "status" TYPE "AffiliateCommissionStatus"
  USING (
    CASE "status"::text
      WHEN 'draft' THEN 'pending'
      WHEN 'requested' THEN 'approved'
      WHEN 'eligibility_failed' THEN 'rejected'
      WHEN 'under_review' THEN 'payout_requested'
      WHEN 'approved' THEN 'approved'
      WHEN 'paid' THEN 'paid'
      WHEN 'rejected' THEN 'rejected'
      WHEN 'cancelled' THEN 'rejected'
      ELSE 'pending'
    END
  )::"AffiliateCommissionStatus";

ALTER TABLE "affiliate_commissions"
  ALTER COLUMN "status" SET DEFAULT 'approved';

-- Indexes.
CREATE INDEX IF NOT EXISTS "affiliate_payouts_affiliate_id_idx" ON "affiliate_payouts"("affiliate_id");
CREATE INDEX IF NOT EXISTS "affiliate_payouts_status_idx" ON "affiliate_payouts"("status");
CREATE INDEX IF NOT EXISTS "affiliate_payouts_requested_at_idx" ON "affiliate_payouts"("requested_at");
CREATE INDEX IF NOT EXISTS "affiliate_payouts_reviewer_id_idx" ON "affiliate_payouts"("reviewer_id");
CREATE INDEX IF NOT EXISTS "affiliate_commissions_affiliate_payout_id_idx" ON "affiliate_commissions"("affiliate_payout_id");

-- Foreign keys guarded for repeat-safe deploys.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'affiliate_payouts_affiliate_id_fkey'
  ) THEN
    ALTER TABLE "affiliate_payouts"
      ADD CONSTRAINT "affiliate_payouts_affiliate_id_fkey"
      FOREIGN KEY ("affiliate_id") REFERENCES "affiliates"("id")
      ON DELETE RESTRICT ON UPDATE CASCADE;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'affiliate_payouts_reviewer_id_fkey'
  ) THEN
    ALTER TABLE "affiliate_payouts"
      ADD CONSTRAINT "affiliate_payouts_reviewer_id_fkey"
      FOREIGN KEY ("reviewer_id") REFERENCES "users"("id")
      ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'affiliate_commissions_affiliate_payout_id_fkey'
  ) THEN
    ALTER TABLE "affiliate_commissions"
      ADD CONSTRAINT "affiliate_commissions_affiliate_payout_id_fkey"
      FOREIGN KEY ("affiliate_payout_id") REFERENCES "affiliate_payouts"("id")
      ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
END $$;
