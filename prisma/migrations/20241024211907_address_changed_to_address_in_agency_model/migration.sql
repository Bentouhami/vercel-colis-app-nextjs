-- AlterTable
ALTER TABLE "simulations" ADD COLUMN     "arrivalDate" TIMESTAMP(3),
ADD COLUMN     "departureDate" TIMESTAMP(3),
ADD COLUMN     "totalVolume" DECIMAL(10,2),
ADD COLUMN     "totalWeight" DECIMAL(10,2);
