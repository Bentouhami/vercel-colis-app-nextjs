/*
  Warnings:

  - The `status` column on the `Envoi` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "EnvoiStatus" AS ENUM ('PENDING', 'SENT', 'DELIVERED', 'CANCELLED', 'RETURNED');

-- AlterTable
ALTER TABLE "Envoi" DROP COLUMN "status",
ADD COLUMN     "status" "EnvoiStatus" NOT NULL DEFAULT 'SENT';
