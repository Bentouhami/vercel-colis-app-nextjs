/*
  Warnings:

  - You are about to drop the column `gender` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `imageUrl` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "gender",
DROP COLUMN "imageUrl",
ADD COLUMN     "image" VARCHAR(255) DEFAULT '',
ALTER COLUMN "role" DROP NOT NULL;
