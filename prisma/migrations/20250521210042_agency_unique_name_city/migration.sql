/*
  Warnings:

  - A unique constraint covering the columns `[name,addressId]` on the table `agencies` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "agencies_name_addressId_key" ON "agencies"("name", "addressId");
