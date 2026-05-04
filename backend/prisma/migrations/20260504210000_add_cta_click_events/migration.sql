CREATE TABLE IF NOT EXISTS "cta_click_events" (
  "id" TEXT NOT NULL,
  "placement" TEXT NOT NULL,
  "label" TEXT,
  "href" TEXT,
  "page_path" TEXT,
  "referrer" TEXT,
  "user_agent" TEXT,
  "country" TEXT,
  "ip_hash" TEXT,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "cta_click_events_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "cta_click_events_placement_idx"
ON "cta_click_events"("placement");

CREATE INDEX IF NOT EXISTS "cta_click_events_created_at_idx"
ON "cta_click_events"("created_at");
