DO $$ BEGIN
  CREATE TYPE "RetakeDiscountStatus" AS ENUM ('active', 'used', 'expired', 'cancelled');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS "RetakeDiscount" (
  "id" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "userId" TEXT,
  "challengeAccountId" TEXT NOT NULL,
  "challengeId" TEXT,
  "planSlug" TEXT NOT NULL,
  "code" TEXT NOT NULL,
  "percentOff" DECIMAL(5,2) NOT NULL,
  "originalPrice" DECIMAL(10,2) NOT NULL,
  "discountedPrice" DECIMAL(10,2) NOT NULL,
  "currency" TEXT NOT NULL DEFAULT 'USD',
  "status" "RetakeDiscountStatus" NOT NULL DEFAULT 'active',
  "expiresAt" TIMESTAMP(3) NOT NULL,
  "usedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "RetakeDiscount_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "RetakeDiscount_challengeAccountId_key"
ON "RetakeDiscount"("challengeAccountId");

CREATE UNIQUE INDEX IF NOT EXISTS "RetakeDiscount_code_key"
ON "RetakeDiscount"("code");

CREATE INDEX IF NOT EXISTS "RetakeDiscount_email_idx"
ON "RetakeDiscount"("email");

CREATE INDEX IF NOT EXISTS "RetakeDiscount_userId_idx"
ON "RetakeDiscount"("userId");

CREATE INDEX IF NOT EXISTS "RetakeDiscount_planSlug_idx"
ON "RetakeDiscount"("planSlug");

CREATE INDEX IF NOT EXISTS "RetakeDiscount_status_idx"
ON "RetakeDiscount"("status");

CREATE INDEX IF NOT EXISTS "RetakeDiscount_expiresAt_idx"
ON "RetakeDiscount"("expiresAt");
