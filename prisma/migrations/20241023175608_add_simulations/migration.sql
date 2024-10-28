-- CreateEnum
CREATE TYPE "SimulationStatus" AS ENUM ('DRAFT', 'CONFIRMED', 'COMPLETED', 'CANCELLED');

-- CreateTable
CREATE TABLE "Simulation" (
    "id" SERIAL NOT NULL,
    "departureAgencyId" INTEGER NOT NULL,
    "destinationAgencyId" INTEGER NOT NULL,
    "userId" INTEGER,
    "destinataireId" INTEGER,
    "status" "SimulationStatus" NOT NULL DEFAULT 'DRAFT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Simulation_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Simulation" ADD CONSTRAINT "Simulation_departureAgencyId_fkey" FOREIGN KEY ("departureAgencyId") REFERENCES "agencies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Simulation" ADD CONSTRAINT "Simulation_destinationAgencyId_fkey" FOREIGN KEY ("destinationAgencyId") REFERENCES "agencies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Simulation" ADD CONSTRAINT "Simulation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Simulation" ADD CONSTRAINT "Simulation_destinataireId_fkey" FOREIGN KEY ("destinataireId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
