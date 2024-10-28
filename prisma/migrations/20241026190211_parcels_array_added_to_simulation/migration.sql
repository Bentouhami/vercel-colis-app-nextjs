-- AlterTable
ALTER TABLE "parcels" ADD COLUMN     "simulationId" INTEGER;

-- AddForeignKey
ALTER TABLE "parcels" ADD CONSTRAINT "parcels_simulationId_fkey" FOREIGN KEY ("simulationId") REFERENCES "simulations"("id") ON DELETE SET NULL ON UPDATE CASCADE;
