/*
  Warnings:

  - Added the required column `verificationToken` to the `simulations` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "simulations" DROP COLUMN "verificationToken",
ADD COLUMN     "verificationToken" UUID NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "simulations_verificationToken_key" ON "simulations"("verificationToken");
