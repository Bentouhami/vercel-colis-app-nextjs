-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('USER', 'CLIENT', 'DESTINATAIRE', 'ADMIN');

-- CreateTable
CREATE TABLE "Address" (
    "id" SERIAL NOT NULL,
    "city" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "number" TEXT NOT NULL,
    "street" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "zipCode" TEXT NOT NULL,

    CONSTRAINT "Address_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Agency" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "location" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "addressId" INTEGER NOT NULL,

    CONSTRAINT "Agency_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dateOfBirth" TIMESTAMP(3),
    "email" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "gender" BOOLEAN NOT NULL DEFAULT false,
    "phoneNumber" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "addressId" INTEGER NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'USER',

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Coupon" (
    "id" SERIAL NOT NULL,
    "couponCode" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "discountAmount" DOUBLE PRECISION NOT NULL,
    "discountPercentage" DOUBLE PRECISION NOT NULL,
    "expirationDate" TIMESTAMP(3) NOT NULL,
    "numberOfUses" INTEGER NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "termsAndConditions" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Coupon_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserCoupon" (
    "userId" INTEGER NOT NULL,
    "couponId" INTEGER NOT NULL,

    CONSTRAINT "UserCoupon_pkey" PRIMARY KEY ("userId","couponId")
);

-- CreateTable
CREATE TABLE "Transport" (
    "id" SERIAL NOT NULL,
    "baseVolume" DOUBLE PRECISION NOT NULL,
    "baseWeight" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "currentVolume" DOUBLE PRECISION NOT NULL,
    "currentWeight" DOUBLE PRECISION NOT NULL,
    "isAvailable" BOOLEAN NOT NULL,
    "number" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Transport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Envoi" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dateDelivered" TIMESTAMP(3) NOT NULL,
    "dateSent" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL,
    "totalPrice" DOUBLE PRECISION NOT NULL,
    "totalVolume" DOUBLE PRECISION NOT NULL,
    "totalWeight" DOUBLE PRECISION NOT NULL,
    "trackingNumber" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "arrivalAgencyId" INTEGER NOT NULL,
    "clientId" INTEGER NOT NULL,
    "departureAgencyId" INTEGER NOT NULL,
    "destinationId" INTEGER NOT NULL,
    "transportId" INTEGER NOT NULL,

    CONSTRAINT "Envoi_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EnvoiCoupon" (
    "envoiId" INTEGER NOT NULL,
    "couponId" INTEGER NOT NULL,

    CONSTRAINT "EnvoiCoupon_pkey" PRIMARY KEY ("envoiId","couponId")
);

-- CreateTable
CREATE TABLE "Parcel" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "height" DOUBLE PRECISION NOT NULL,
    "length" DOUBLE PRECISION NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "volume" DOUBLE PRECISION NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL,
    "width" DOUBLE PRECISION NOT NULL,
    "envoiId" INTEGER NOT NULL,

    CONSTRAINT "Parcel_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Agency_addressId_key" ON "Agency"("addressId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Agency" ADD CONSTRAINT "Agency_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "Address"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "Address"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserCoupon" ADD CONSTRAINT "UserCoupon_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserCoupon" ADD CONSTRAINT "UserCoupon_couponId_fkey" FOREIGN KEY ("couponId") REFERENCES "Coupon"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Envoi" ADD CONSTRAINT "Envoi_arrivalAgencyId_fkey" FOREIGN KEY ("arrivalAgencyId") REFERENCES "Agency"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Envoi" ADD CONSTRAINT "Envoi_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Envoi" ADD CONSTRAINT "Envoi_departureAgencyId_fkey" FOREIGN KEY ("departureAgencyId") REFERENCES "Agency"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Envoi" ADD CONSTRAINT "Envoi_destinationId_fkey" FOREIGN KEY ("destinationId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Envoi" ADD CONSTRAINT "Envoi_transportId_fkey" FOREIGN KEY ("transportId") REFERENCES "Transport"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EnvoiCoupon" ADD CONSTRAINT "EnvoiCoupon_envoiId_fkey" FOREIGN KEY ("envoiId") REFERENCES "Envoi"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EnvoiCoupon" ADD CONSTRAINT "EnvoiCoupon_couponId_fkey" FOREIGN KEY ("couponId") REFERENCES "Coupon"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Parcel" ADD CONSTRAINT "Parcel_envoiId_fkey" FOREIGN KEY ("envoiId") REFERENCES "Envoi"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
