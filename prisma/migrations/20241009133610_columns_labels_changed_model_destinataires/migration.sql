/*
  Warnings:

  - You are about to drop the column `nom` on the `destinataires` table. All the data in the column will be lost.
  - You are about to drop the column `prenom` on the `destinataires` table. All the data in the column will be lost.
  - You are about to drop the column `telephone` on the `destinataires` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[phoneNumber]` on the table `destinataires` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `firstName` to the `destinataires` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `destinataires` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phoneNumber` to the `destinataires` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "destinataires_telephone_key";

-- AlterTable
ALTER TABLE "destinataires" DROP COLUMN "nom",
DROP COLUMN "prenom",
DROP COLUMN "telephone",
ADD COLUMN     "firstName" TEXT NOT NULL,
ADD COLUMN     "lastName" TEXT NOT NULL,
ADD COLUMN     "phoneNumber" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "destinataires_phoneNumber_key" ON "destinataires"("phoneNumber");
