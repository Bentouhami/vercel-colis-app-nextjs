-- CreateTable
CREATE TABLE "ClientDestinataire" (
    "id" SERIAL NOT NULL,
    "clientId" INTEGER NOT NULL,
    "destinataireId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ClientDestinataire_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ClientDestinataire_clientId_destinataireId_key" ON "ClientDestinataire"("clientId", "destinataireId");

-- AddForeignKey
ALTER TABLE "ClientDestinataire" ADD CONSTRAINT "ClientDestinataire_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClientDestinataire" ADD CONSTRAINT "ClientDestinataire_destinataireId_fkey" FOREIGN KEY ("destinataireId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
