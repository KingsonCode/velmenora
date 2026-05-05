ALTER TABLE "challenge_accounts"
  ADD COLUMN IF NOT EXISTS "application_ip_address" VARCHAR(80),
  ADD COLUMN IF NOT EXISTS "application_user_agent" TEXT;

CREATE INDEX IF NOT EXISTS "challenge_accounts_application_ip_address_idx"
ON "challenge_accounts"("application_ip_address");
