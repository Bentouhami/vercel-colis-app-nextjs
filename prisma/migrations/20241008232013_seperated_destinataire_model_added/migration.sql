-- AlterTable
ALTER TABLE "envois" ADD COLUMN     "comment" TEXT,
ADD COLUMN     "destinataireId" INTEGER;

-- CreateTable
CREATE TABLE "destinataires" (
    "id" SERIAL NOT NULL,
    "nom" TEXT NOT NULL,
    "prenom" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telephone" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "destinataires_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "destinataires_email_key" ON "destinataires"("email");

-- AddForeignKey
ALTER TABLE "envois" ADD CONSTRAINT "envois_destinataireId_fkey" FOREIGN KEY ("destinataireId") REFERENCES "destinataires"("id") ON DELETE SET NULL ON UPDATE CASCADE;
