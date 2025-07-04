-- AlterTable
ALTER TABLE "tarifs" ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE INDEX "tracking_events_envoiId_createdAt_idx" ON "tracking_events"("envoiId", "createdAt");

-- CreateIndex
CREATE INDEX "tracking_events_eventStatus_createdAt_idx" ON "tracking_events"("eventStatus", "createdAt");
