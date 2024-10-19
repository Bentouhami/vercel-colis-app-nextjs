/*
  Warnings:

  - A unique constraint covering the columns `[verificationToken]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Made the column `isVerified` on table `users` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "users" ADD COLUMN     "verificationToken" VARCHAR(255),
ADD COLUMN     "verificationTokenExpires" TIMESTAMP(3),
ALTER COLUMN "isVerified" SET NOT NULL,
ALTER COLUMN "role" SET DEFAULT 'DESTINATAIRE';

-- CreateIndex
CREATE UNIQUE INDEX "users_verificationToken_key" ON "users"("verificationToken");
