-- CreateEnum
CREATE TYPE "payment_method" AS ENUM ('CARD', 'CASH');

-- CreateEnum
CREATE TYPE "payment_status" AS ENUM ('PENDING', 'PAID', 'FAILED');

-- AlterTable
ALTER TABLE "agencies" ADD COLUMN     "phoneNumber" VARCHAR(50);

-- CreateTable
CREATE TABLE "payments" (
    "id" SERIAL NOT NULL,
    "envoiId" INTEGER NOT NULL,
    "method" "payment_method" NOT NULL,
    "status" "payment_status" NOT NULL DEFAULT 'PENDING',
    "amount" DOUBLE PRECISION NOT NULL,
    "transactionId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "payments_envoiId_key" ON "payments"("envoiId");

-- CreateIndex
CREATE UNIQUE INDEX "payments_transactionId_key" ON "payments"("transactionId");

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_envoiId_fkey" FOREIGN KEY ("envoiId") REFERENCES "envois"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
