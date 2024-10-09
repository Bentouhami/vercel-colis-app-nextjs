/*
  Warnings:

  - You are about to drop the column `destinationId` on the `envois` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "envois" DROP CONSTRAINT "envois_destinationId_fkey";

-- AlterTable
ALTER TABLE "envois" DROP COLUMN "destinationId";
