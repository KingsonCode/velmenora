ALTER TABLE "challenge_accounts"
ADD COLUMN IF NOT EXISTS "ref" VARCHAR(100);

CREATE INDEX IF NOT EXISTS "challenge_accounts_ref_idx"
ON "challenge_accounts"("ref");
