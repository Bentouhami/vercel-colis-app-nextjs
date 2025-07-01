/*
  Warnings:

  - You are about to drop the column `city` on the `addresses` table. All the data in the column will be lost.
  - You are about to drop the column `country` on the `addresses` table. All the data in the column will be lost.
  - You are about to drop the column `zipCode` on the `addresses` table. All the data in the column will be lost.
  - You are about to drop the `_AddressToCity` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user_addresses` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[name,countryId]` on the table `cities` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `cityId` to the `addresses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `countryId` to the `addresses` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_AddressToCity" DROP CONSTRAINT "_AddressToCity_A_fkey";

-- DropForeignKey
ALTER TABLE "_AddressToCity" DROP CONSTRAINT "_AddressToCity_B_fkey";

-- DropForeignKey
ALTER TABLE "user_addresses" DROP CONSTRAINT "user_addresses_addressId_fkey";

-- DropForeignKey
ALTER TABLE "user_addresses" DROP CONSTRAINT "user_addresses_userId_fkey";

-- AlterTable
ALTER TABLE "addresses" DROP COLUMN "city",
DROP COLUMN "country",
DROP COLUMN "zipCode",
ADD COLUMN     "cityId" INTEGER NOT NULL,
ADD COLUMN     "countryId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "cities" ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "countries" ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;

-- DropTable
DROP TABLE "_AddressToCity";

-- DropTable
DROP TABLE "user_addresses";

-- DropEnum
DROP TYPE "address_types";

-- CreateIndex
CREATE UNIQUE INDEX "cities_name_countryId_key" ON "cities"("name", "countryId");

-- AddForeignKey
ALTER TABLE "addresses" ADD CONSTRAINT "addresses_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "cities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "addresses" ADD CONSTRAINT "addresses_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "countries"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
