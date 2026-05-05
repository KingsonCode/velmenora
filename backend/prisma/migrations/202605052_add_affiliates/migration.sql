CREATE TABLE IF NOT EXISTS "affiliates" (
  "id" TEXT NOT NULL,
  "user_id" TEXT NOT NULL,
  "slug" VARCHAR(80) NOT NULL,
  "is_active" BOOLEAN NOT NULL DEFAULT true,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "affiliates_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "affiliates_user_id_fkey"
    FOREIGN KEY ("user_id") REFERENCES "users"("id")
    ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE UNIQUE INDEX IF NOT EXISTS "affiliates_user_id_key"
ON "affiliates"("user_id");

CREATE UNIQUE INDEX IF NOT EXISTS "affiliates_slug_key"
ON "affiliates"("slug");

CREATE INDEX IF NOT EXISTS "affiliates_is_active_idx"
ON "affiliates"("is_active");

CREATE INDEX IF NOT EXISTS "affiliates_created_at_idx"
ON "affiliates"("created_at");
