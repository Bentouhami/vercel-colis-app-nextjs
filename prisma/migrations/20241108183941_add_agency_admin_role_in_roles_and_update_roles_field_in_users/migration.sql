/*
  Warnings:

  - You are about to drop the column `role` on the `users` table. All the data in the column will be lost.

*/
-- AlterEnum
ALTER TYPE "roles" ADD VALUE 'AGENCY_ADMIN';

-- AlterTable
ALTER TABLE "users" DROP COLUMN "role",
ADD COLUMN     "agencyId" INTEGER,
ADD COLUMN     "roles" "roles"[] DEFAULT ARRAY['CLIENT']::"roles"[];

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_agencyId_fkey" FOREIGN KEY ("agencyId") REFERENCES "agencies"("id") ON DELETE SET NULL ON UPDATE CASCADE;
