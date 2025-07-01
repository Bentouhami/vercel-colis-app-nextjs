/*
  Warnings:

  - You are about to drop the column `addressId` on the `users` table. All the data in the column will be lost.
  - You are about to drop the `_UserToUserAddress` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_UserToUserAddress" DROP CONSTRAINT "_UserToUserAddress_A_fkey";

-- DropForeignKey
ALTER TABLE "_UserToUserAddress" DROP CONSTRAINT "_UserToUserAddress_B_fkey";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "addressId";

-- DropTable
DROP TABLE "_UserToUserAddress";

-- AddForeignKey
ALTER TABLE "user_addresses" ADD CONSTRAINT "user_addresses_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
