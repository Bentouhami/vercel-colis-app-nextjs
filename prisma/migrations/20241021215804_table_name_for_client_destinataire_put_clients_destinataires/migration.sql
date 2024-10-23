/*
  Warnings:

  - You are about to drop the `ClientDestinataire` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ClientDestinataire" DROP CONSTRAINT "ClientDestinataire_clientId_fkey";

-- DropForeignKey
ALTER TABLE "ClientDestinataire" DROP CONSTRAINT "ClientDestinataire_destinataireId_fkey";

-- DropTable
DROP TABLE "ClientDestinataire";

-- CreateTable
CREATE TABLE "clients_destinataires" (
    "id" SERIAL NOT NULL,
    "clientId" INTEGER NOT NULL,
    "destinataireId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "clients_destinataires_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "clients_destinataires_clientId_destinataireId_key" ON "clients_destinataires"("clientId", "destinataireId");

-- AddForeignKey
ALTER TABLE "clients_destinataires" ADD CONSTRAINT "clients_destinataires_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clients_destinataires" ADD CONSTRAINT "clients_destinataires_destinataireId_fkey" FOREIGN KEY ("destinataireId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
