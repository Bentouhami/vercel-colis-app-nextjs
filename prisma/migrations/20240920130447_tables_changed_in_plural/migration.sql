/*
  Warnings:

  - The `role` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `Address` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Agency` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Coupon` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Envoi` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `EnvoiCoupon` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Parcel` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Tarifs` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Transport` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TransportSchedule` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserCoupon` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "user_roles" AS ENUM ('USER', 'CLIENT', 'DESTINATAIRE', 'ADMIN');

-- CreateEnum
CREATE TYPE "envoi_status" AS ENUM ('PENDING', 'SENT', 'DELIVERED', 'CANCELLED', 'RETURNED');

-- DropForeignKey
ALTER TABLE "Agency" DROP CONSTRAINT "Agency_addressId_fkey";

-- DropForeignKey
ALTER TABLE "Envoi" DROP CONSTRAINT "Envoi_arrivalAgencyId_fkey";

-- DropForeignKey
ALTER TABLE "Envoi" DROP CONSTRAINT "Envoi_clientId_fkey";

-- DropForeignKey
ALTER TABLE "Envoi" DROP CONSTRAINT "Envoi_departureAgencyId_fkey";

-- DropForeignKey
ALTER TABLE "Envoi" DROP CONSTRAINT "Envoi_destinationId_fkey";

-- DropForeignKey
ALTER TABLE "Envoi" DROP CONSTRAINT "Envoi_transportId_fkey";

-- DropForeignKey
ALTER TABLE "EnvoiCoupon" DROP CONSTRAINT "EnvoiCoupon_couponId_fkey";

-- DropForeignKey
ALTER TABLE "EnvoiCoupon" DROP CONSTRAINT "EnvoiCoupon_envoiId_fkey";

-- DropForeignKey
ALTER TABLE "Parcel" DROP CONSTRAINT "Parcel_envoiId_fkey";

-- DropForeignKey
ALTER TABLE "TransportSchedule" DROP CONSTRAINT "TransportSchedule_transportId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_addressId_fkey";

-- DropForeignKey
ALTER TABLE "UserCoupon" DROP CONSTRAINT "UserCoupon_couponId_fkey";

-- DropForeignKey
ALTER TABLE "UserCoupon" DROP CONSTRAINT "UserCoupon_userId_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "role",
ADD COLUMN     "role" "user_roles" NOT NULL DEFAULT 'USER';

-- DropTable
DROP TABLE "Address";

-- DropTable
DROP TABLE "Agency";

-- DropTable
DROP TABLE "Coupon";

-- DropTable
DROP TABLE "Envoi";

-- DropTable
DROP TABLE "EnvoiCoupon";

-- DropTable
DROP TABLE "Parcel";

-- DropTable
DROP TABLE "Tarifs";

-- DropTable
DROP TABLE "Transport";

-- DropTable
DROP TABLE "TransportSchedule";

-- DropTable
DROP TABLE "UserCoupon";

-- DropEnum
DROP TYPE "EnvoiStatus";

-- DropEnum
DROP TYPE "UserRole";

-- CreateTable
CREATE TABLE "addresses" (
    "id" SERIAL NOT NULL,
    "street" TEXT NOT NULL,
    "number" TEXT,
    "city" TEXT NOT NULL,
    "zipCode" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "addresses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "agencies" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "location" TEXT,
    "addressId" INTEGER NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "agencies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "coupons" (
    "id" SERIAL NOT NULL,
    "couponCode" TEXT NOT NULL,
    "discountAmount" DOUBLE PRECISION NOT NULL,
    "discountPercentage" DOUBLE PRECISION NOT NULL,
    "numberOfUses" INTEGER NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "expirationDate" TIMESTAMP(3),
    "termsAndConditions" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "coupons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_coupons" (
    "userId" INTEGER NOT NULL,
    "couponId" INTEGER NOT NULL,

    CONSTRAINT "user_coupons_pkey" PRIMARY KEY ("userId","couponId")
);

-- CreateTable
CREATE TABLE "transports" (
    "id" SERIAL NOT NULL,
    "number" TEXT NOT NULL,
    "baseVolume" DOUBLE PRECISION NOT NULL,
    "baseWeight" DOUBLE PRECISION NOT NULL,
    "currentVolume" DOUBLE PRECISION NOT NULL,
    "currentWeight" DOUBLE PRECISION NOT NULL,
    "isAvailable" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "transports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "envois" (
    "id" SERIAL NOT NULL,
    "trackingNumber" TEXT NOT NULL,
    "clientId" INTEGER NOT NULL,
    "destinationId" INTEGER NOT NULL,
    "dateSent" TIMESTAMP(3) NOT NULL,
    "departureAgencyId" INTEGER NOT NULL,
    "dateDelivered" TIMESTAMP(3) NOT NULL,
    "arrivalAgencyId" INTEGER NOT NULL,
    "status" "envoi_status" NOT NULL DEFAULT 'SENT',
    "totalWeight" DOUBLE PRECISION NOT NULL,
    "totalVolume" DOUBLE PRECISION NOT NULL,
    "totalPrice" DOUBLE PRECISION NOT NULL,
    "transportId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "envois_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "envoi_coupons" (
    "envoiId" INTEGER NOT NULL,
    "couponId" INTEGER NOT NULL,

    CONSTRAINT "envoi_coupons_pkey" PRIMARY KEY ("envoiId","couponId")
);

-- CreateTable
CREATE TABLE "parcels" (
    "id" SERIAL NOT NULL,
    "height" DOUBLE PRECISION NOT NULL,
    "volume" DOUBLE PRECISION NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL,
    "width" DOUBLE PRECISION NOT NULL,
    "length" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "envoiId" INTEGER NOT NULL,

    CONSTRAINT "parcels_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tarifs" (
    "id" SERIAL NOT NULL,
    "weightRate" DOUBLE PRECISION NOT NULL,
    "volumeRate" DOUBLE PRECISION NOT NULL,
    "baseRate" DOUBLE PRECISION NOT NULL,
    "fixedRate" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tarifs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transport_schedules" (
    "id" SERIAL NOT NULL,
    "transportId" INTEGER NOT NULL,
    "departureDate" TIMESTAMP(3) NOT NULL,
    "arrivalDate" TIMESTAMP(3) NOT NULL,
    "isHoliday" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "transport_schedules_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "agencies_addressId_key" ON "agencies"("addressId");

-- CreateIndex
CREATE UNIQUE INDEX "envois_trackingNumber_key" ON "envois"("trackingNumber");

-- AddForeignKey
ALTER TABLE "agencies" ADD CONSTRAINT "agencies_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "addresses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "addresses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_coupons" ADD CONSTRAINT "user_coupons_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_coupons" ADD CONSTRAINT "user_coupons_couponId_fkey" FOREIGN KEY ("couponId") REFERENCES "coupons"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "envois" ADD CONSTRAINT "envois_arrivalAgencyId_fkey" FOREIGN KEY ("arrivalAgencyId") REFERENCES "agencies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "envois" ADD CONSTRAINT "envois_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "envois" ADD CONSTRAINT "envois_departureAgencyId_fkey" FOREIGN KEY ("departureAgencyId") REFERENCES "agencies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "envois" ADD CONSTRAINT "envois_destinationId_fkey" FOREIGN KEY ("destinationId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "envois" ADD CONSTRAINT "envois_transportId_fkey" FOREIGN KEY ("transportId") REFERENCES "transports"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "envoi_coupons" ADD CONSTRAINT "envoi_coupons_envoiId_fkey" FOREIGN KEY ("envoiId") REFERENCES "envois"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "envoi_coupons" ADD CONSTRAINT "envoi_coupons_couponId_fkey" FOREIGN KEY ("couponId") REFERENCES "coupons"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "parcels" ADD CONSTRAINT "parcels_envoiId_fkey" FOREIGN KEY ("envoiId") REFERENCES "envois"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transport_schedules" ADD CONSTRAINT "transport_schedules_transportId_fkey" FOREIGN KEY ("transportId") REFERENCES "transports"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
