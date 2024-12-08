/*
  Warnings:

  - The values [ADMIN] on the enum `roles` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "roles_new" AS ENUM ('CLIENT', 'SUPER_ADMIN', 'DESTINATAIRE', 'AGENCY_ADMIN');
ALTER TABLE "users"
    ALTER COLUMN "roles" DROP DEFAULT;
ALTER TABLE "users"
    ALTER COLUMN "roles" TYPE "roles_new"[] USING ("roles"::text::"roles_new"[]);
ALTER TYPE "roles" RENAME TO "roles_old";
ALTER TYPE "roles_new" RENAME TO "roles";
DROP TYPE "roles_old";
ALTER TABLE "users"
    ALTER COLUMN "roles" SET DEFAULT ARRAY ['CLIENT']::"roles"[];
COMMIT;
