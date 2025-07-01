/*
  Warnings:

  - You are about to drop the column `countryId` on the `addresses` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "addresses" DROP CONSTRAINT "addresses_countryId_fkey";

-- AlterTable
ALTER TABLE "addresses" DROP COLUMN "countryId";
