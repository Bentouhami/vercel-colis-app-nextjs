/*
  Warnings:

  - You are about to drop the `agency_admins` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "activity_types" AS ENUM ('AGENCY_CREATED', 'AGENCY_UPDATED', 'AGENCY_DELETED', 'CLIENT_LINKED', 'CLIENT_UNLINKED', 'CLIENT_UPDATED', 'CLIENT_DELETED', 'CLIENT_CREATED', 'ENVOI_CREATED', 'ENVOI_UPDATED', 'ENVOI_DELETED', 'PAYMENT_CREATED', 'PAYMENT_UPDATED', 'PAYMENT_DELETED', 'TRACKING_EVENT_CREATED', 'TRACKING_EVENT_UPDATED', 'TRACKING_EVENT_DELETED', 'APPOINTMENT_CREATED', 'APPOINTMENT_UPDATED', 'APPOINTMENT_DELETED', 'NOTIFICATION_CREATED', 'NOTIFICATION_UPDATED', 'NOTIFICATION_DELETED', 'AGENCY_ADMIN_ADDED', 'AGENCY_ADMIN_REMOVED', 'ACCOUNTANT_ADDED', 'ACCOUNTANT_REMOVED', 'SUPER_ADMIN_ADDED', 'SUPER_ADMIN_REMOVED', 'TRANSPORT_CREATED', 'TRANSPORT_UPDATED', 'TRANSPORT_DELETED', 'TARIF_CREATED', 'TARIF_UPDATED', 'TARIF_DELETED', 'PDF_EXPORTED', 'CSV_EXPORTED');

-- DropForeignKey
ALTER TABLE "agency_admins" DROP CONSTRAINT "agency_admins_adminId_fkey";

-- DropForeignKey
ALTER TABLE "agency_admins" DROP CONSTRAINT "agency_admins_agencyId_fkey";

-- AlterTable
ALTER TABLE "agencies" ADD COLUMN     "createdById" INTEGER;

-- DropTable
DROP TABLE "agency_admins";

-- CreateTable
CREATE TABLE "agency_staff" (
    "id" SERIAL NOT NULL,
    "staffId" INTEGER NOT NULL,
    "agencyId" INTEGER NOT NULL,
    "staffRole" "roles" NOT NULL,

    CONSTRAINT "agency_staff_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "activity_logs" (
    "id" SERIAL NOT NULL,
    "activityType" "activity_types" NOT NULL,
    "staffId" INTEGER,
    "agencyId" INTEGER,
    "details" TEXT,
    "staffRole" "roles" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "activity_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "agency_staff_staffId_agencyId_staffRole_key" ON "agency_staff"("staffId", "agencyId", "staffRole");

-- AddForeignKey
ALTER TABLE "agency_staff" ADD CONSTRAINT "agency_staff_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "agency_staff" ADD CONSTRAINT "agency_staff_agencyId_fkey" FOREIGN KEY ("agencyId") REFERENCES "agencies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activity_logs" ADD CONSTRAINT "activity_logs_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activity_logs" ADD CONSTRAINT "activity_logs_agencyId_fkey" FOREIGN KEY ("agencyId") REFERENCES "agencies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "agencies" ADD CONSTRAINT "agencies_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
