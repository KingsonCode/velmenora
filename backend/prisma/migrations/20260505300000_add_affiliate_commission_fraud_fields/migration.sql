ALTER TABLE "affiliate_commissions"
  ADD COLUMN IF NOT EXISTS "fraud_flag" VARCHAR(40) NOT NULL DEFAULT 'none',
  ADD COLUMN IF NOT EXISTS "fraud_reason" TEXT,
  ADD COLUMN IF NOT EXISTS "fraud_checked_at" TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "fraud_metadata_json" JSONB;

CREATE INDEX IF NOT EXISTS "affiliate_commissions_fraud_flag_idx"
ON "affiliate_commissions"("fraud_flag");
