/*
  Warnings:

  - You are about to drop the column `simulationId` on the `parcels` table. All the data in the column will be lost.
  - You are about to drop the column `departureAgencyId` on the `simulations` table. All the data in the column will be lost.
  - You are about to drop the column `destinationAgencyId` on the `simulations` table. All the data in the column will be lost.
  - Added the required column `departureAgency` to the `simulations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `destinationAgency` to the `simulations` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "parcels" DROP CONSTRAINT "parcels_simulationId_fkey";

-- DropForeignKey
ALTER TABLE "simulations" DROP CONSTRAINT "simulations_departureAgencyId_fkey";

-- DropForeignKey
ALTER TABLE "simulations" DROP CONSTRAINT "simulations_destinationAgencyId_fkey";

-- AlterTable
ALTER TABLE "parcels" DROP COLUMN "simulationId";

-- AlterTable
ALTER TABLE "simulations" DROP COLUMN "departureAgencyId",
DROP COLUMN "destinationAgencyId",
ADD COLUMN     "departureAgency" TEXT NOT NULL,
ADD COLUMN     "destinationAgency" TEXT NOT NULL,
ADD COLUMN     "parcels" JSONB;
