/*
  Warnings:

  - Added the required column `availableSlots` to the `agencies` table without a default value. This is not possible if the table is not empty.
  - Added the required column `capacity` to the `agencies` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "agencies" ADD COLUMN     "availableSlots" INTEGER NOT NULL,
ADD COLUMN     "capacity" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "envois" ADD COLUMN     "qrCodeUrl" TEXT;

-- CreateTable
CREATE TABLE "notifications" (
    "id" SERIAL NOT NULL,
    "message" TEXT NOT NULL,
    "agencyId" INTEGER NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "appointments" (
    "id" SERIAL NOT NULL,
    "envoiId" INTEGER NOT NULL,
    "agencyId" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "appointments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "appointments_envoiId_key" ON "appointments"("envoiId");

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_agencyId_fkey" FOREIGN KEY ("agencyId") REFERENCES "agencies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_envoiId_fkey" FOREIGN KEY ("envoiId") REFERENCES "envois"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_agencyId_fkey" FOREIGN KEY ("agencyId") REFERENCES "agencies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
