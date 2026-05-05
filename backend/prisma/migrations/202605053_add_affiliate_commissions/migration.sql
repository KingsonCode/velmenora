CREATE TABLE IF NOT EXISTS "affiliate_commissions" (
  "id" TEXT NOT NULL,
  "affiliate_id" TEXT NOT NULL,
  "challenge_account_id" TEXT NOT NULL,
  "payment_id" TEXT NOT NULL,
  "ref" VARCHAR(80) NOT NULL,
  "plan_slug" VARCHAR(100) NOT NULL,
  "amount" DECIMAL(12,2) NOT NULL,
  "currency" VARCHAR(10) NOT NULL,
  "status" "PayoutStatus" NOT NULL DEFAULT 'requested',
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "affiliate_commissions_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "affiliate_commissions_affiliate_id_fkey"
    FOREIGN KEY ("affiliate_id") REFERENCES "affiliates"("id")
    ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "affiliate_commissions_challenge_account_id_fkey"
    FOREIGN KEY ("challenge_account_id") REFERENCES "challenge_accounts"("id")
    ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "affiliate_commissions_payment_id_fkey"
    FOREIGN KEY ("payment_id") REFERENCES "payments"("id")
    ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE UNIQUE INDEX IF NOT EXISTS "affiliate_commissions_payment_id_key"
ON "affiliate_commissions"("payment_id");

CREATE INDEX IF NOT EXISTS "affiliate_commissions_affiliate_id_idx"
ON "affiliate_commissions"("affiliate_id");

CREATE INDEX IF NOT EXISTS "affiliate_commissions_challenge_account_id_idx"
ON "affiliate_commissions"("challenge_account_id");

CREATE INDEX IF NOT EXISTS "affiliate_commissions_status_idx"
ON "affiliate_commissions"("status");

CREATE INDEX IF NOT EXISTS "affiliate_commissions_created_at_idx"
ON "affiliate_commissions"("created_at");
