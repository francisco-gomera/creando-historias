CREATE TABLE IF NOT EXISTS "AdSlotImpression" (
  "id" TEXT NOT NULL,
  "placementId" TEXT NOT NULL,
  "adKey" TEXT,
  "articleId" TEXT,
  "authorId" TEXT,
  "route" TEXT,
  "country" TEXT NOT NULL DEFAULT 'UNKNOWN',
  "deviceType" TEXT NOT NULL DEFAULT 'desktop',
  "anonymousSessionHash" TEXT NOT NULL,
  "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "AdSlotImpression_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "AdSlotImpression_placementId_timestamp_idx"
  ON "AdSlotImpression"("placementId", "timestamp");

CREATE INDEX IF NOT EXISTS "AdSlotImpression_articleId_timestamp_idx"
  ON "AdSlotImpression"("articleId", "timestamp");

CREATE INDEX IF NOT EXISTS "AdSlotImpression_authorId_timestamp_idx"
  ON "AdSlotImpression"("authorId", "timestamp");

CREATE INDEX IF NOT EXISTS "AdSlotImpression_timestamp_idx"
  ON "AdSlotImpression"("timestamp");
