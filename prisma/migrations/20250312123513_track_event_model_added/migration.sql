-- CreateEnum
CREATE TYPE "TrackingEventStatus" AS ENUM ('CREATED', 'COLLECTED', 'IN_TRANSIT', 'ARRIVED_AT_AGENCY', 'OUT_FOR_DELIVERY', 'DELIVERED', 'FAILED');

-- CreateTable
CREATE TABLE "tracking_events" (
    "id" SERIAL NOT NULL,
    "envoiId" INTEGER NOT NULL,
    "eventStatus" "TrackingEventStatus" NOT NULL,
    "location" TEXT,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tracking_events_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "tracking_events" ADD CONSTRAINT "tracking_events_envoiId_fkey" FOREIGN KEY ("envoiId") REFERENCES "envois"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
