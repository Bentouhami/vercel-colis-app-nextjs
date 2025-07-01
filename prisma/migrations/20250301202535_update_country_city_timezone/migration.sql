/*
  Warnings:

  - You are about to drop the column `latitude` on the `addresses` table. All the data in the column will be lost.
  - You are about to drop the column `longitude` on the `addresses` table. All the data in the column will be lost.
  - You are about to drop the column `number` on the `addresses` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `cities` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `cities` table. All the data in the column will be lost.
  - You are about to drop the column `countryCode` on the `countries` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `countries` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `countries` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[iso2]` on the table `countries` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "address_types" AS ENUM ('HOME', 'OFFICE', 'BILLING', 'SHIPPING', 'OTHER');

-- DropForeignKey
ALTER TABLE "cities" DROP CONSTRAINT "cities_countryId_fkey";

-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_addressId_fkey";

-- DropIndex
DROP INDEX "countries_countryCode_key";

-- AlterTable
ALTER TABLE "addresses" DROP COLUMN "latitude",
DROP COLUMN "longitude",
DROP COLUMN "number",
ADD COLUMN     "boxNumber" VARCHAR(10),
ADD COLUMN     "complement" VARCHAR(100),
ADD COLUMN     "streetNumber" VARCHAR(10),
ALTER COLUMN "street" SET DATA TYPE VARCHAR(100);

-- AlterTable
ALTER TABLE "agencies" ALTER COLUMN "capacity" DROP NOT NULL,
ALTER COLUMN "availableSlots" DROP NOT NULL;

-- AlterTable
ALTER TABLE "cities" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
ADD COLUMN     "latitude" VARCHAR(50),
ADD COLUMN     "longitude" VARCHAR(50),
ADD COLUMN     "population" INTEGER,
ADD COLUMN     "timezone" VARCHAR(100),
ALTER COLUMN "cityCode" DROP NOT NULL,
ALTER COLUMN "name" SET DATA TYPE VARCHAR(100);

-- AlterTable
ALTER TABLE "countries" DROP COLUMN "countryCode",
DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
ADD COLUMN     "capital" VARCHAR(100),
ADD COLUMN     "currency" VARCHAR(10),
ADD COLUMN     "currency_name" VARCHAR(100),
ADD COLUMN     "currency_symbol" VARCHAR(5),
ADD COLUMN     "emoji" VARCHAR(10),
ADD COLUMN     "emojiU" VARCHAR(10),
ADD COLUMN     "iso2" VARCHAR(2),
ADD COLUMN     "iso3" VARCHAR(3),
ADD COLUMN     "latitude" VARCHAR(50),
ADD COLUMN     "longitude" VARCHAR(50),
ADD COLUMN     "nationality" VARCHAR(100),
ADD COLUMN     "native" VARCHAR(100),
ADD COLUMN     "numeric_code" VARCHAR(10),
ADD COLUMN     "phone_code" VARCHAR(10),
ADD COLUMN     "region" VARCHAR(100),
ADD COLUMN     "subregion" VARCHAR(100),
ADD COLUMN     "tld" VARCHAR(10),
ALTER COLUMN "name" SET DATA TYPE VARCHAR(100);

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "isEnterprise" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "lastLogin" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "timezones" (
    "id" SERIAL NOT NULL,
    "countryId" INTEGER NOT NULL,
    "zoneName" VARCHAR(100) NOT NULL,
    "gmtOffset" INTEGER,
    "gmtOffsetName" VARCHAR(20),
    "abbreviation" VARCHAR(10),
    "tzName" VARCHAR(100),

    CONSTRAINT "timezones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_addresses" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "addressId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "addressType" "address_types" NOT NULL,

    CONSTRAINT "user_addresses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_UserToUserAddress" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_UserToUserAddress_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_UserToUserAddress_B_index" ON "_UserToUserAddress"("B");

-- CreateIndex
CREATE UNIQUE INDEX "countries_iso2_key" ON "countries"("iso2");

-- AddForeignKey
ALTER TABLE "cities" ADD CONSTRAINT "cities_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "countries"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "timezones" ADD CONSTRAINT "timezones_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "countries"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_addresses" ADD CONSTRAINT "user_addresses_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "addresses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserToUserAddress" ADD CONSTRAINT "_UserToUserAddress_A_fkey" FOREIGN KEY ("A") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserToUserAddress" ADD CONSTRAINT "_UserToUserAddress_B_fkey" FOREIGN KEY ("B") REFERENCES "user_addresses"("id") ON DELETE CASCADE ON UPDATE CASCADE;
