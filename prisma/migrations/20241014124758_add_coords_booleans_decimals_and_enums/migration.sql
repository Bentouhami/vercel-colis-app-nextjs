/*
  Warnings:

  - You are about to alter the column `street` on the `addresses` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.
  - You are about to alter the column `number` on the `addresses` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.
  - You are about to alter the column `city` on the `addresses` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.
  - You are about to alter the column `zipCode` on the `addresses` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.
  - You are about to alter the column `country` on the `addresses` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.
  - You are about to alter the column `name` on the `agencies` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.
  - You are about to alter the column `location` on the `agencies` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(250)`.
  - The `status` column on the `appointments` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to alter the column `couponCode` on the `coupons` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.
  - You are about to alter the column `discountAmount` on the `coupons` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(10,2)`.
  - You are about to alter the column `discountPercentage` on the `coupons` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(5,2)`.
  - You are about to alter the column `termsAndConditions` on the `coupons` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `trackingNumber` on the `envois` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.
  - You are about to alter the column `totalWeight` on the `envois` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(5,2)`.
  - You are about to alter the column `totalVolume` on the `envois` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(5,2)`.
  - You are about to alter the column `totalPrice` on the `envois` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(5,2)`.
  - You are about to alter the column `qrCodeUrl` on the `envois` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `message` on the `notifications` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `height` on the `parcels` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(5,2)`.
  - You are about to alter the column `volume` on the `parcels` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(5,2)`.
  - You are about to alter the column `weight` on the `parcels` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(5,2)`.
  - You are about to alter the column `width` on the `parcels` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(5,2)`.
  - You are about to alter the column `length` on the `parcels` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(5,2)`.
  - You are about to alter the column `weightRate` on the `tarifs` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(5,2)`.
  - You are about to alter the column `volumeRate` on the `tarifs` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(5,2)`.
  - You are about to alter the column `baseRate` on the `tarifs` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(5,2)`.
  - You are about to alter the column `fixedRate` on the `tarifs` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(5,2)`.
  - You are about to alter the column `number` on the `transports` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(10)`.
  - You are about to alter the column `baseVolume` on the `transports` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(5,2)`.
  - You are about to alter the column `baseWeight` on the `transports` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(5,2)`.
  - You are about to alter the column `currentVolume` on the `transports` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(5,2)`.
  - You are about to alter the column `currentWeight` on the `transports` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(5,2)`.
  - You are about to alter the column `firstName` on the `users` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.
  - You are about to alter the column `lastName` on the `users` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.
  - You are about to alter the column `gender` on the `users` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.
  - You are about to alter the column `phoneNumber` on the `users` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.
  - You are about to alter the column `email` on the `users` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(150)`.
  - You are about to alter the column `password` on the `users` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `imageUrl` on the `users` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.

*/
-- CreateEnum
CREATE TYPE "AppointmentStatus" AS ENUM ('PENDING', 'CONFIRMED', 'CANCELLED', 'RESCHEDULED', 'COMPLETED', 'MISSED', 'IN_PROGRESS');

-- AlterTable
ALTER TABLE "addresses" ADD COLUMN     "latitude" DOUBLE PRECISION,
ADD COLUMN     "longitude" DOUBLE PRECISION,
ALTER COLUMN "street" SET DATA TYPE VARCHAR(50),
ALTER COLUMN "number" SET DATA TYPE VARCHAR(50),
ALTER COLUMN "city" SET DATA TYPE VARCHAR(50),
ALTER COLUMN "zipCode" SET DATA TYPE VARCHAR(50),
ALTER COLUMN "country" SET DATA TYPE VARCHAR(50);

-- AlterTable
ALTER TABLE "agencies" ALTER COLUMN "name" SET DATA TYPE VARCHAR(50),
ALTER COLUMN "location" SET DATA TYPE VARCHAR(250);

-- AlterTable
ALTER TABLE "appointments" DROP COLUMN "status",
ADD COLUMN     "status" "AppointmentStatus" NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "coupons" ALTER COLUMN "couponCode" SET DATA TYPE VARCHAR(50),
ALTER COLUMN "discountAmount" SET DATA TYPE DECIMAL(10,2),
ALTER COLUMN "discountPercentage" SET DATA TYPE DECIMAL(5,2),
ALTER COLUMN "termsAndConditions" SET DATA TYPE VARCHAR(255);

-- AlterTable
ALTER TABLE "envois" ALTER COLUMN "trackingNumber" SET DATA TYPE VARCHAR(50),
ALTER COLUMN "totalWeight" SET DATA TYPE DECIMAL(5,2),
ALTER COLUMN "totalVolume" SET DATA TYPE DECIMAL(5,2),
ALTER COLUMN "totalPrice" SET DATA TYPE DECIMAL(5,2),
ALTER COLUMN "qrCodeUrl" SET DATA TYPE VARCHAR(255);

-- AlterTable
ALTER TABLE "notifications" ALTER COLUMN "message" SET DATA TYPE VARCHAR(255);

-- AlterTable
ALTER TABLE "parcels" ALTER COLUMN "height" SET DATA TYPE DECIMAL(5,2),
ALTER COLUMN "volume" SET DATA TYPE DECIMAL(5,2),
ALTER COLUMN "weight" SET DATA TYPE DECIMAL(5,2),
ALTER COLUMN "width" SET DATA TYPE DECIMAL(5,2),
ALTER COLUMN "length" SET DATA TYPE DECIMAL(5,2);

-- AlterTable
ALTER TABLE "tarifs" ALTER COLUMN "weightRate" SET DATA TYPE DECIMAL(5,2),
ALTER COLUMN "volumeRate" SET DATA TYPE DECIMAL(5,2),
ALTER COLUMN "baseRate" SET DATA TYPE DECIMAL(5,2),
ALTER COLUMN "fixedRate" SET DATA TYPE DECIMAL(5,2);

-- AlterTable
ALTER TABLE "transport_schedules" ALTER COLUMN "isHoliday" SET DEFAULT false;

-- AlterTable
ALTER TABLE "transports" ALTER COLUMN "number" SET DATA TYPE VARCHAR(10),
ALTER COLUMN "baseVolume" SET DATA TYPE DECIMAL(5,2),
ALTER COLUMN "baseWeight" SET DATA TYPE DECIMAL(5,2),
ALTER COLUMN "currentVolume" SET DATA TYPE DECIMAL(5,2),
ALTER COLUMN "currentWeight" SET DATA TYPE DECIMAL(5,2),
ALTER COLUMN "isAvailable" SET DEFAULT true;

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "firstName" SET DATA TYPE VARCHAR(50),
ALTER COLUMN "lastName" SET DATA TYPE VARCHAR(50),
ALTER COLUMN "gender" SET DATA TYPE VARCHAR(50),
ALTER COLUMN "phoneNumber" SET DATA TYPE VARCHAR(50),
ALTER COLUMN "email" SET DATA TYPE VARCHAR(150),
ALTER COLUMN "password" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "imageUrl" SET DATA TYPE VARCHAR(255);
