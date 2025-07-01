/*
  Warnings:

  - A unique constraint covering the columns `[zoneName,countryId]` on the table `timezones` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "timezones_zoneName_countryId_key" ON "timezones"("zoneName", "countryId");
