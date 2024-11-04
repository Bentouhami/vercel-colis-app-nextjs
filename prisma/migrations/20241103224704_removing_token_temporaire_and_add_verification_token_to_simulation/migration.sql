/*
  Warnings:

  - You are about to drop the column `tokenTemporaire` on the `simulations` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[verificationToken]` on the table `simulations` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "simulations_tokenTemporaire_key";

-- AlterTable
ALTER TABLE "simulations" DROP COLUMN "tokenTemporaire",
ADD COLUMN     "verificationToken" VARCHAR(255),
ALTER COLUMN "status" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "simulations_verificationToken_key" ON "simulations"("verificationToken");
