/*
  Warnings:

  - A unique constraint covering the columns `[trackingNumber]` on the table `Envoi` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "password" TEXT NOT NULL DEFAULT '';

-- CreateIndex
CREATE UNIQUE INDEX "Envoi_trackingNumber_key" ON "Envoi"("trackingNumber");
