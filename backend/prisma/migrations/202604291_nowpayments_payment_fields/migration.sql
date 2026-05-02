ALTER TYPE "PaymentProvider" ADD VALUE IF NOT EXISTS 'nowpayments';

ALTER TYPE "AuditEventType" ADD VALUE IF NOT EXISTS 'payment_checkout_created';
ALTER TYPE "AuditEventType" ADD VALUE IF NOT EXISTS 'payment_failed';
ALTER TYPE "AuditEventType" ADD VALUE IF NOT EXISTS 'payment_mismatch_detected';

ALTER TABLE "payments" ADD COLUMN IF NOT EXISTS "checkout_url" TEXT;
