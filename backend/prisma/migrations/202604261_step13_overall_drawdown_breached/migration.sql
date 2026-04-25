ALTER TABLE "challenge_accounts"
ADD COLUMN IF NOT EXISTS "overall_drawdown_breached" BOOLEAN NOT NULL DEFAULT false;
