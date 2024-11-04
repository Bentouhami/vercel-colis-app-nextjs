/*
  Warnings:

  - The `status` column on the `simulations` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[tokenTemporaire]` on the table `simulations` will be added. If there are existing duplicate values, this will fail.
  - The required column `tokenTemporaire` was added to the `simulations` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE "simulations" ADD COLUMN     "tokenTemporaire" VARCHAR(255) NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" "simulation_status" NOT NULL DEFAULT 'DRAFT';

-- CreateIndex
CREATE UNIQUE INDEX "simulations_tokenTemporaire_key" ON "simulations"("tokenTemporaire");
