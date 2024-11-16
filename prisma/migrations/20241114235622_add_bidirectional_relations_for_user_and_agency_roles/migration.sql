-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_agencyId_fkey";

-- CreateTable
CREATE TABLE "_AgencyAdmins" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_AgencyClients" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_AgencyAdmins_AB_unique" ON "_AgencyAdmins"("A", "B");

-- CreateIndex
CREATE INDEX "_AgencyAdmins_B_index" ON "_AgencyAdmins"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_AgencyClients_AB_unique" ON "_AgencyClients"("A", "B");

-- CreateIndex
CREATE INDEX "_AgencyClients_B_index" ON "_AgencyClients"("B");

-- AddForeignKey
ALTER TABLE "_AgencyAdmins" ADD CONSTRAINT "_AgencyAdmins_A_fkey" FOREIGN KEY ("A") REFERENCES "agencies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AgencyAdmins" ADD CONSTRAINT "_AgencyAdmins_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AgencyClients" ADD CONSTRAINT "_AgencyClients_A_fkey" FOREIGN KEY ("A") REFERENCES "agencies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AgencyClients" ADD CONSTRAINT "_AgencyClients_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
