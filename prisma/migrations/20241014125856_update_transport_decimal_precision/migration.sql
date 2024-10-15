/*
  Warnings:

  - You are about to drop the `transports` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "envois" DROP CONSTRAINT "envois_transportId_fkey";

-- DropForeignKey
ALTER TABLE "transport_schedules" DROP CONSTRAINT "transport_schedules_transportId_fkey";

-- DropTable
DROP TABLE "transports";

-- CreateTable
CREATE TABLE "Transport" (
    "id" SERIAL NOT NULL,
    "number" VARCHAR(15) NOT NULL,
    "baseVolume" DECIMAL(12,2) NOT NULL,
    "baseWeight" DECIMAL(10,2) NOT NULL,
    "currentVolume" DECIMAL(12,2) NOT NULL,
    "currentWeight" DECIMAL(10,2) NOT NULL,
    "isAvailable" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Transport_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "envois" ADD CONSTRAINT "envois_transportId_fkey" FOREIGN KEY ("transportId") REFERENCES "Transport"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transport_schedules" ADD CONSTRAINT "transport_schedules_transportId_fkey" FOREIGN KEY ("transportId") REFERENCES "Transport"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
