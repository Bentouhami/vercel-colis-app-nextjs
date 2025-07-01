/*
  Warnings:

  - You are about to drop the column `status` on the `envois` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "envois" DROP COLUMN "status",
ADD COLUMN     "envoiStatus" "envoi_status" NOT NULL DEFAULT 'PENDING',
ALTER COLUMN "comment" SET DEFAULT 'No comment provided yet!';
