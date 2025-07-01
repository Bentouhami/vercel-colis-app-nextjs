/*
  Warnings:

  - You are about to drop the column `cityCode` on the `cities` table. All the data in the column will be lost.
  - You are about to drop the column `population` on the `cities` table. All the data in the column will be lost.
  - You are about to drop the column `timezone` on the `cities` table. All the data in the column will be lost.
  - You are about to alter the column `latitude` on the `cities` table. The data in that column could be lost. The data in that column will be cast from `VarChar(50)` to `VarChar(20)`.
  - You are about to alter the column `longitude` on the `cities` table. The data in that column could be lost. The data in that column will be cast from `VarChar(50)` to `VarChar(20)`.
  - You are about to drop the column `currency_name` on the `countries` table. All the data in the column will be lost.
  - You are about to drop the column `currency_symbol` on the `countries` table. All the data in the column will be lost.
  - You are about to drop the column `emojiU` on the `countries` table. All the data in the column will be lost.
  - You are about to drop the column `nationality` on the `countries` table. All the data in the column will be lost.
  - You are about to drop the column `native` on the `countries` table. All the data in the column will be lost.
  - You are about to drop the column `numeric_code` on the `countries` table. All the data in the column will be lost.
  - You are about to drop the column `phone_code` on the `countries` table. All the data in the column will be lost.
  - You are about to drop the column `region` on the `countries` table. All the data in the column will be lost.
  - You are about to drop the column `subregion` on the `countries` table. All the data in the column will be lost.
  - You are about to drop the column `tld` on the `countries` table. All the data in the column will be lost.
  - You are about to alter the column `capital` on the `countries` table. The data in that column could be lost. The data in that column will be cast from `VarChar(100)` to `VarChar(50)`.
  - You are about to alter the column `emoji` on the `countries` table. The data in that column could be lost. The data in that column will be cast from `VarChar(10)` to `VarChar(5)`.
  - You are about to alter the column `latitude` on the `countries` table. The data in that column could be lost. The data in that column will be cast from `VarChar(50)` to `VarChar(20)`.
  - You are about to alter the column `longitude` on the `countries` table. The data in that column could be lost. The data in that column will be cast from `VarChar(50)` to `VarChar(20)`.
  - You are about to drop the column `gmtOffsetName` on the `timezones` table. All the data in the column will be lost.
  - You are about to drop the column `tzName` on the `timezones` table. All the data in the column will be lost.
  - You are about to alter the column `zoneName` on the `timezones` table. The data in that column could be lost. The data in that column will be cast from `VarChar(100)` to `VarChar(50)`.
  - A unique constraint covering the columns `[iso3]` on the table `countries` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `phonecode` to the `countries` table without a default value. This is not possible if the table is not empty.
  - Made the column `iso2` on table `countries` required. This step will fail if there are existing NULL values in that column.
  - Made the column `iso3` on table `countries` required. This step will fail if there are existing NULL values in that column.
  - Made the column `gmtOffset` on table `timezones` required. This step will fail if there are existing NULL values in that column.
  - Made the column `abbreviation` on table `timezones` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "cities" DROP CONSTRAINT "cities_countryId_fkey";

-- DropForeignKey
ALTER TABLE "timezones" DROP CONSTRAINT "timezones_countryId_fkey";

-- AlterTable
ALTER TABLE "cities" DROP COLUMN "cityCode",
DROP COLUMN "population",
DROP COLUMN "timezone",
ALTER COLUMN "latitude" SET DATA TYPE VARCHAR(20),
ALTER COLUMN "longitude" SET DATA TYPE VARCHAR(20);

-- AlterTable
ALTER TABLE "countries" DROP COLUMN "currency_name",
DROP COLUMN "currency_symbol",
DROP COLUMN "emojiU",
DROP COLUMN "nationality",
DROP COLUMN "native",
DROP COLUMN "numeric_code",
DROP COLUMN "phone_code",
DROP COLUMN "region",
DROP COLUMN "subregion",
DROP COLUMN "tld",
ADD COLUMN     "phonecode" VARCHAR(10) NOT NULL,
ALTER COLUMN "capital" SET DATA TYPE VARCHAR(50),
ALTER COLUMN "emoji" SET DATA TYPE VARCHAR(5),
ALTER COLUMN "iso2" SET NOT NULL,
ALTER COLUMN "iso3" SET NOT NULL,
ALTER COLUMN "latitude" SET DATA TYPE VARCHAR(20),
ALTER COLUMN "longitude" SET DATA TYPE VARCHAR(20);

-- AlterTable
ALTER TABLE "timezones" DROP COLUMN "gmtOffsetName",
DROP COLUMN "tzName",
ALTER COLUMN "zoneName" SET DATA TYPE VARCHAR(50),
ALTER COLUMN "gmtOffset" SET NOT NULL,
ALTER COLUMN "abbreviation" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "countries_iso3_key" ON "countries"("iso3");

-- AddForeignKey
ALTER TABLE "cities" ADD CONSTRAINT "cities_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "countries"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "timezones" ADD CONSTRAINT "timezones_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "countries"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
