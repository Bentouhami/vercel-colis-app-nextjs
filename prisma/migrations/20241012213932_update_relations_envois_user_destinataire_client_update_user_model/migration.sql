/*
  Warnings:

  - You are about to drop the column `verified` on the `users` table. All the data in the column will be lost.
  - The `role` column on the `users` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `destinataires` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `envoiId` to the `notifications` table without a default value. This is not possible if the table is not empty.
  - Added the required column `envoisId` to the `notifications` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "roles" AS ENUM ('CLIENT', 'ADMIN', 'DESTINATAIRE');

-- DropForeignKey
ALTER TABLE "envois" DROP CONSTRAINT "envois_destinataireId_fkey";

-- DropForeignKey
ALTER TABLE "notifications" DROP CONSTRAINT "notifications_destinataireId_fkey";

-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_addressId_fkey";

-- AlterTable
ALTER TABLE "envois" ALTER COLUMN "status" SET DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "notifications" ADD COLUMN     "envoiId" INTEGER NOT NULL,
ADD COLUMN     "envoisId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "verified",
ADD COLUMN     "isVerified" BOOLEAN DEFAULT false,
ALTER COLUMN "password" DROP NOT NULL,
ALTER COLUMN "addressId" DROP NOT NULL,
DROP COLUMN "role",
ADD COLUMN     "role" "roles" NOT NULL DEFAULT 'CLIENT';

-- DropTable
DROP TABLE "destinataires";

-- DropEnum
DROP TYPE "user_roles";

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_envoiId_fkey" FOREIGN KEY ("envoiId") REFERENCES "envois"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_destinataireId_fkey" FOREIGN KEY ("destinataireId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "addresses"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "envois" ADD CONSTRAINT "envois_destinataireId_fkey" FOREIGN KEY ("destinataireId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
