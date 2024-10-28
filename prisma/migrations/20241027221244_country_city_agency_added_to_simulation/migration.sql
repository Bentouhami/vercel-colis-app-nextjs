/*
  Warnings:

  - You are about to alter the column `totalPrice` on the `simulations` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `DoublePrecision`.
  - You are about to alter the column `totalVolume` on the `simulations` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `DoublePrecision`.
  - You are about to alter the column `totalWeight` on the `simulations` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `DoublePrecision`.
  - Added the required column `departureCity` to the `simulations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `departureCountry` to the `simulations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `destinationCity` to the `simulations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `destinationCountry` to the `simulations` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `status` on the `simulations` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Made the column `arrivalDate` on table `simulations` required. This step will fail if there are existing NULL values in that column.
  - Made the column `departureDate` on table `simulations` required. This step will fail if there are existing NULL values in that column.
  - Made the column `totalVolume` on table `simulations` required. This step will fail if there are existing NULL values in that column.
  - Made the column `totalWeight` on table `simulations` required. This step will fail if there are existing NULL values in that column.
  - Made the column `parcels` on table `simulations` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "simulations" ADD COLUMN     "departureCity" TEXT NOT NULL,
ADD COLUMN     "departureCountry" TEXT NOT NULL,
ADD COLUMN     "destinationCity" TEXT NOT NULL,
ADD COLUMN     "destinationCountry" TEXT NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" TEXT NOT NULL,
ALTER COLUMN "totalPrice" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "arrivalDate" SET NOT NULL,
ALTER COLUMN "departureDate" SET NOT NULL,
ALTER COLUMN "totalVolume" SET NOT NULL,
ALTER COLUMN "totalVolume" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "totalWeight" SET NOT NULL,
ALTER COLUMN "totalWeight" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "parcels" SET NOT NULL;
