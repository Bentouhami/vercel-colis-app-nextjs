/*
  Warnings:

  - You are about to drop the `_AgencyAdmins` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_AgencyClients` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `verification_tokens` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_AgencyAdmins" DROP CONSTRAINT "_AgencyAdmins_A_fkey";

-- DropForeignKey
ALTER TABLE "_AgencyAdmins" DROP CONSTRAINT "_AgencyAdmins_B_fkey";

-- DropForeignKey
ALTER TABLE "_AgencyClients" DROP CONSTRAINT "_AgencyClients_A_fkey";

-- DropForeignKey
ALTER TABLE "_AgencyClients" DROP CONSTRAINT "_AgencyClients_B_fkey";

-- DropTable
DROP TABLE "_AgencyAdmins";

-- DropTable
DROP TABLE "_AgencyClients";

-- DropTable
DROP TABLE "verification_tokens";

-- CreateTable
CREATE TABLE "agency_clients" (
    "clientId" INTEGER NOT NULL,
    "agencyId" INTEGER NOT NULL,

    CONSTRAINT "agency_clients_pkey" PRIMARY KEY ("clientId","agencyId")
);

-- CreateTable
CREATE TABLE "agency_admins" (
    "adminId" INTEGER NOT NULL,
    "agencyId" INTEGER NOT NULL,

    CONSTRAINT "agency_admins_pkey" PRIMARY KEY ("adminId","agencyId")
);

-- AddForeignKey
ALTER TABLE "agency_clients" ADD CONSTRAINT "agency_clients_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "agency_clients" ADD CONSTRAINT "agency_clients_agencyId_fkey" FOREIGN KEY ("agencyId") REFERENCES "agencies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "agency_admins" ADD CONSTRAINT "agency_admins_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "agency_admins" ADD CONSTRAINT "agency_admins_agencyId_fkey" FOREIGN KEY ("agencyId") REFERENCES "agencies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
