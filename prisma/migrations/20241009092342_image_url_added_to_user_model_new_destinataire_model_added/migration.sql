/*
  Warnings:

  - You are about to drop the column `image` on the `users` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[telephone]` on the table `destinataires` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "image",
ADD COLUMN     "imageUrl" TEXT DEFAULT '';

-- CreateIndex
CREATE UNIQUE INDEX "destinataires_telephone_key" ON "destinataires"("telephone");
