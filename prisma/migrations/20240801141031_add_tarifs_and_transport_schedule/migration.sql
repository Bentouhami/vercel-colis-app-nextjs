/*
  Warnings:

  - You are about to drop the column `price` on the `Parcel` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[phoneNumber]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Address" ALTER COLUMN "number" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Agency" ALTER COLUMN "location" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Coupon" ALTER COLUMN "expirationDate" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Parcel" DROP COLUMN "price";

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "phoneNumber" DROP NOT NULL;

-- CreateTable
CREATE TABLE "Tarifs" (
    "id" SERIAL NOT NULL,
    "weightRate" DOUBLE PRECISION NOT NULL,
    "volumeRate" DOUBLE PRECISION NOT NULL,
    "baseRate" DOUBLE PRECISION NOT NULL,
    "fixedRate" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Tarifs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TransportSchedule" (
    "id" SERIAL NOT NULL,
    "transportId" INTEGER NOT NULL,
    "departureDate" TIMESTAMP(3) NOT NULL,
    "arrivalDate" TIMESTAMP(3) NOT NULL,
    "isHoliday" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TransportSchedule_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_phoneNumber_key" ON "User"("phoneNumber");

-- AddForeignKey
ALTER TABLE "TransportSchedule" ADD CONSTRAINT "TransportSchedule_transportId_fkey" FOREIGN KEY ("transportId") REFERENCES "Transport"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
