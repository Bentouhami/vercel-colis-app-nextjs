/*
  Warnings:

  - Made the column `destinataireId` on table `envois` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `destinataireId` to the `notifications` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `notifications` table without a default value. This is not possible if the table is not empty.
  - Made the column `phoneNumber` on table `users` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "envois" DROP CONSTRAINT "envois_destinataireId_fkey";

-- AlterTable
ALTER TABLE "envois" ALTER COLUMN "destinataireId" SET NOT NULL;

-- AlterTable
ALTER TABLE "notifications" ADD COLUMN     "destinataireId" INTEGER NOT NULL,
ADD COLUMN     "userId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "tarifs" ADD COLUMN     "agencyId" INTEGER;

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "phoneNumber" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_destinataireId_fkey" FOREIGN KEY ("destinataireId") REFERENCES "destinataires"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "envois" ADD CONSTRAINT "envois_destinataireId_fkey" FOREIGN KEY ("destinataireId") REFERENCES "destinataires"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tarifs" ADD CONSTRAINT "tarifs_agencyId_fkey" FOREIGN KEY ("agencyId") REFERENCES "agencies"("id") ON DELETE SET NULL ON UPDATE CASCADE;
