-- AlterTable
ALTER TABLE "users" ADD COLUMN     "image" TEXT DEFAULT '',
ADD COLUMN     "verified" BOOLEAN NOT NULL DEFAULT false;
