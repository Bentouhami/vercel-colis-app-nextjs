-- CreateEnum
CREATE TYPE "payment_method" AS ENUM ('CARD', 'CASH');

-- CreateEnum
CREATE TYPE "payment_status" AS ENUM ('PENDING', 'PAID', 'FAILED');

-- CreateEnum
CREATE TYPE "roles" AS ENUM ('CLIENT', 'SUPER_ADMIN', 'DESTINATAIRE', 'AGENCY_ADMIN', 'ACCOUNTANT');

-- CreateEnum
CREATE TYPE "vat_types" AS ENUM ('REDUCED', 'STANDARD', 'EXEMPT');

-- CreateEnum
CREATE TYPE "address_types" AS ENUM ('HOME', 'OFFICE', 'BILLING', 'SHIPPING', 'OTHER');

-- CreateEnum
CREATE TYPE "simulation_status" AS ENUM ('DRAFT', 'CONFIRMED', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "envoi_status" AS ENUM ('PENDING', 'SENT', 'DELIVERED', 'CANCELLED', 'RETURNED');

-- CreateEnum
CREATE TYPE "appointment_status" AS ENUM ('PENDING', 'CONFIRMED', 'CANCELLED', 'RESCHEDULED', 'COMPLETED', 'MISSED', 'IN_PROGRESS');

-- CreateEnum
CREATE TYPE "TrackingEventStatus" AS ENUM ('CREATED', 'COLLECTED', 'IN_TRANSIT', 'ARRIVED_AT_AGENCY', 'OUT_FOR_DELIVERY', 'DELIVERED', 'FAILED');

-- CreateEnum
CREATE TYPE "activity_types" AS ENUM ('AGENCY_CREATED', 'AGENCY_UPDATED', 'AGENCY_DELETED', 'CLIENT_LINKED', 'CLIENT_UNLINKED', 'CLIENT_UPDATED', 'CLIENT_DELETED', 'CLIENT_CREATED', 'ENVOI_CREATED', 'ENVOI_UPDATED', 'ENVOI_DELETED', 'PAYMENT_CREATED', 'PAYMENT_UPDATED', 'PAYMENT_DELETED', 'TRACKING_EVENT_CREATED', 'TRACKING_EVENT_UPDATED', 'TRACKING_EVENT_DELETED', 'APPOINTMENT_CREATED', 'APPOINTMENT_UPDATED', 'APPOINTMENT_DELETED', 'NOTIFICATION_CREATED', 'NOTIFICATION_UPDATED', 'NOTIFICATION_DELETED', 'AGENCY_ADMIN_ADDED', 'AGENCY_ADMIN_REMOVED', 'ACCOUNTANT_ADDED', 'ACCOUNTANT_REMOVED', 'SUPER_ADMIN_ADDED', 'SUPER_ADMIN_REMOVED', 'TRANSPORT_CREATED', 'TRANSPORT_UPDATED', 'TRANSPORT_DELETED', 'TARIF_CREATED', 'TARIF_UPDATED', 'TARIF_DELETED', 'PDF_EXPORTED', 'CSV_EXPORTED');

-- CreateTable
CREATE TABLE "password_reset_tokens" (
    "id" SERIAL NOT NULL,
    "token" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "password_reset_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payments" (
    "id" SERIAL NOT NULL,
    "envoiId" INTEGER NOT NULL,
    "method" "payment_method" NOT NULL,
    "status" "payment_status" NOT NULL DEFAULT 'PENDING',
    "amount" DOUBLE PRECISION NOT NULL,
    "transactionId" TEXT,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "firstName" VARCHAR(50),
    "lastName" VARCHAR(50),
    "name" TEXT,
    "birthDate" TIMESTAMP(3),
    "email" VARCHAR(150) NOT NULL,
    "phoneNumber" VARCHAR(50),
    "password" VARCHAR(255) DEFAULT '',
    "image" VARCHAR(255) DEFAULT '',
    "role" "roles" NOT NULL DEFAULT 'CLIENT',
    "isVerified" BOOLEAN DEFAULT false,
    "emailVerified" TIMESTAMP(3),
    "verificationToken" VARCHAR(255),
    "verificationTokenExpires" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isEnterprise" BOOLEAN NOT NULL DEFAULT false,
    "lastLogin" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accounts" (
    "userId" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("provider","providerAccountId")
);

-- CreateTable
CREATE TABLE "sessions" (
    "sessionToken" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "agency_clients" (
    "clientId" INTEGER NOT NULL,
    "agencyId" INTEGER NOT NULL,

    CONSTRAINT "agency_clients_pkey" PRIMARY KEY ("clientId","agencyId")
);

-- CreateTable
CREATE TABLE "agency_staff" (
    "id" SERIAL NOT NULL,
    "staffId" INTEGER NOT NULL,
    "agencyId" INTEGER NOT NULL,
    "staffRole" "roles" NOT NULL,

    CONSTRAINT "agency_staff_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "activity_logs" (
    "id" SERIAL NOT NULL,
    "activityType" "activity_types" NOT NULL,
    "staffId" INTEGER,
    "agencyId" INTEGER,
    "details" TEXT,
    "staffRole" "roles" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "activity_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "authenticators" (
    "credentialID" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "credentialPublicKey" TEXT NOT NULL,
    "counter" INTEGER NOT NULL,
    "credentialDeviceType" TEXT NOT NULL,
    "credentialBackedUp" BOOLEAN NOT NULL,
    "transports" TEXT,

    CONSTRAINT "authenticators_pkey" PRIMARY KEY ("userId","credentialID")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" SERIAL NOT NULL,
    "message" VARCHAR(255) NOT NULL,
    "agencyId" INTEGER NOT NULL,
    "destinataireId" INTEGER,
    "clientId" INTEGER,
    "envoiId" INTEGER NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vat_rates" (
    "id" SERIAL NOT NULL,
    "countryId" INTEGER NOT NULL,
    "itemClassId" INTEGER NOT NULL,
    "vatPercent" DECIMAL(5,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "vatType" "vat_types" DEFAULT 'STANDARD',

    CONSTRAINT "vat_rates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cities" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "latitude" VARCHAR(20),
    "longitude" VARCHAR(20),
    "countryId" INTEGER NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "cities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "countries" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "iso2" VARCHAR(2) NOT NULL,
    "iso3" VARCHAR(3) NOT NULL,
    "phonecode" VARCHAR(10) NOT NULL,
    "capital" VARCHAR(50),
    "currency" VARCHAR(10),
    "latitude" VARCHAR(20),
    "longitude" VARCHAR(20),
    "emoji" VARCHAR(5),
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "countries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "timezones" (
    "id" SERIAL NOT NULL,
    "zoneName" VARCHAR(50) NOT NULL,
    "gmtOffset" INTEGER NOT NULL,
    "abbreviation" VARCHAR(10) NOT NULL,
    "countryId" INTEGER NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "timezones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_addresses" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "addressId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "addressType" "address_types" NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "user_addresses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "addresses" (
    "id" SERIAL NOT NULL,
    "street" VARCHAR(100) NOT NULL,
    "complement" VARCHAR(100),
    "streetNumber" VARCHAR(10),
    "boxNumber" VARCHAR(10),
    "cityId" INTEGER NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "addresses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "agencies" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "location" VARCHAR(250),
    "phoneNumber" VARCHAR(50),
    "email" VARCHAR(250),
    "vatNumber" VARCHAR(250),
    "addressId" INTEGER NOT NULL,
    "capacity" INTEGER,
    "availableSlots" INTEGER,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdById" INTEGER,

    CONSTRAINT "agencies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "clients_destinataires" (
    "id" SERIAL NOT NULL,
    "clientId" INTEGER NOT NULL,
    "destinataireId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "clients_destinataires_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "coupons" (
    "id" SERIAL NOT NULL,
    "couponCode" VARCHAR(50) NOT NULL,
    "discountAmount" DECIMAL(10,2) NOT NULL,
    "discountPercentage" DECIMAL(5,2) NOT NULL,
    "numberOfUses" INTEGER NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "expirationDate" TIMESTAMP(3),
    "termsAndConditions" VARCHAR(255),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "coupons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_coupons" (
    "userId" INTEGER NOT NULL,
    "couponId" INTEGER NOT NULL,

    CONSTRAINT "user_coupons_pkey" PRIMARY KEY ("userId","couponId")
);

-- CreateTable
CREATE TABLE "transports" (
    "id" SERIAL NOT NULL,
    "number" VARCHAR(15) NOT NULL,
    "baseVolume" DECIMAL(12,2) NOT NULL,
    "baseWeight" DECIMAL(10,2) NOT NULL,
    "currentVolume" DECIMAL(12,2) NOT NULL,
    "currentWeight" DECIMAL(10,2) NOT NULL,
    "isAvailable" BOOLEAN NOT NULL DEFAULT true,
    "agencyId" INTEGER,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "transports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "envois" (
    "id" SERIAL NOT NULL,
    "trackingNumber" VARCHAR(50),
    "qrCodeUrl" VARCHAR(255) DEFAULT '',
    "userId" INTEGER,
    "destinataireId" INTEGER,
    "transportId" INTEGER,
    "departureAgencyId" INTEGER NOT NULL,
    "arrivalAgencyId" INTEGER NOT NULL,
    "simulationStatus" "simulation_status" NOT NULL DEFAULT 'DRAFT',
    "envoiStatus" "envoi_status" NOT NULL DEFAULT 'PENDING',
    "totalWeight" DOUBLE PRECISION NOT NULL,
    "totalVolume" DOUBLE PRECISION NOT NULL,
    "totalPrice" DOUBLE PRECISION NOT NULL,
    "paid" BOOLEAN NOT NULL DEFAULT false,
    "departureDate" TIMESTAMP(3) NOT NULL,
    "arrivalDate" TIMESTAMP(3) NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "verificationToken" UUID NOT NULL,
    "comment" TEXT DEFAULT 'No comment provided yet!',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "envois_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tracking_events" (
    "id" SERIAL NOT NULL,
    "envoiId" INTEGER NOT NULL,
    "eventStatus" "TrackingEventStatus" NOT NULL,
    "location" TEXT,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tracking_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "appointments" (
    "id" SERIAL NOT NULL,
    "envoiId" INTEGER NOT NULL,
    "agencyId" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "status" "appointment_status" NOT NULL DEFAULT 'PENDING',
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "appointments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "envoi_coupons" (
    "envoiId" INTEGER NOT NULL,
    "couponId" INTEGER NOT NULL,

    CONSTRAINT "envoi_coupons_pkey" PRIMARY KEY ("envoiId","couponId")
);

-- CreateTable
CREATE TABLE "parcels" (
    "id" SERIAL NOT NULL,
    "envoiId" INTEGER NOT NULL,
    "height" DECIMAL(5,2) NOT NULL,
    "weight" DECIMAL(5,2) NOT NULL,
    "width" DECIMAL(5,2) NOT NULL,
    "length" DECIMAL(5,2) NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "parcels_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tarifs" (
    "id" SERIAL NOT NULL,
    "agencyId" INTEGER,
    "weightRate" DECIMAL(5,2) NOT NULL,
    "volumeRate" DECIMAL(5,2) NOT NULL,
    "baseRate" DECIMAL(5,2) NOT NULL,
    "fixedRate" DECIMAL(5,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "tarifs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transport_schedules" (
    "id" SERIAL NOT NULL,
    "transportId" INTEGER NOT NULL,
    "departureDate" TIMESTAMP(3) NOT NULL,
    "arrivalDate" TIMESTAMP(3) NOT NULL,
    "isHoliday" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "transport_schedules_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "password_reset_tokens_token_key" ON "password_reset_tokens"("token");

-- CreateIndex
CREATE UNIQUE INDEX "payments_envoiId_key" ON "payments"("envoiId");

-- CreateIndex
CREATE UNIQUE INDEX "payments_transactionId_key" ON "payments"("transactionId");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_phoneNumber_key" ON "users"("phoneNumber");

-- CreateIndex
CREATE UNIQUE INDEX "users_verificationToken_key" ON "users"("verificationToken");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_sessionToken_key" ON "sessions"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "agency_staff_staffId_agencyId_staffRole_key" ON "agency_staff"("staffId", "agencyId", "staffRole");

-- CreateIndex
CREATE UNIQUE INDEX "authenticators_credentialID_key" ON "authenticators"("credentialID");

-- CreateIndex
CREATE UNIQUE INDEX "vat_rates_countryId_key" ON "vat_rates"("countryId");

-- CreateIndex
CREATE UNIQUE INDEX "cities_name_countryId_key" ON "cities"("name", "countryId");

-- CreateIndex
CREATE UNIQUE INDEX "countries_iso2_key" ON "countries"("iso2");

-- CreateIndex
CREATE UNIQUE INDEX "countries_iso3_key" ON "countries"("iso3");

-- CreateIndex
CREATE UNIQUE INDEX "timezones_zoneName_countryId_key" ON "timezones"("zoneName", "countryId");

-- CreateIndex
CREATE UNIQUE INDEX "agencies_addressId_key" ON "agencies"("addressId");

-- CreateIndex
CREATE UNIQUE INDEX "agencies_name_addressId_key" ON "agencies"("name", "addressId");

-- CreateIndex
CREATE UNIQUE INDEX "clients_destinataires_clientId_destinataireId_key" ON "clients_destinataires"("clientId", "destinataireId");

-- CreateIndex
CREATE UNIQUE INDEX "envois_trackingNumber_key" ON "envois"("trackingNumber");

-- CreateIndex
CREATE UNIQUE INDEX "envois_verificationToken_key" ON "envois"("verificationToken");

-- CreateIndex
CREATE INDEX "tracking_events_envoiId_createdAt_idx" ON "tracking_events"("envoiId", "createdAt");

-- CreateIndex
CREATE INDEX "tracking_events_eventStatus_createdAt_idx" ON "tracking_events"("eventStatus", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "appointments_envoiId_key" ON "appointments"("envoiId");

-- AddForeignKey
ALTER TABLE "password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_envoiId_fkey" FOREIGN KEY ("envoiId") REFERENCES "envois"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "agency_clients" ADD CONSTRAINT "agency_clients_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "agency_clients" ADD CONSTRAINT "agency_clients_agencyId_fkey" FOREIGN KEY ("agencyId") REFERENCES "agencies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "agency_staff" ADD CONSTRAINT "agency_staff_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "agency_staff" ADD CONSTRAINT "agency_staff_agencyId_fkey" FOREIGN KEY ("agencyId") REFERENCES "agencies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activity_logs" ADD CONSTRAINT "activity_logs_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activity_logs" ADD CONSTRAINT "activity_logs_agencyId_fkey" FOREIGN KEY ("agencyId") REFERENCES "agencies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "authenticators" ADD CONSTRAINT "authenticators_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_agencyId_fkey" FOREIGN KEY ("agencyId") REFERENCES "agencies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_envoiId_fkey" FOREIGN KEY ("envoiId") REFERENCES "envois"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_destinataireId_fkey" FOREIGN KEY ("destinataireId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vat_rates" ADD CONSTRAINT "vat_rates_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "countries"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cities" ADD CONSTRAINT "cities_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "countries"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "timezones" ADD CONSTRAINT "timezones_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "countries"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_addresses" ADD CONSTRAINT "user_addresses_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "addresses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_addresses" ADD CONSTRAINT "user_addresses_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "addresses" ADD CONSTRAINT "addresses_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "cities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "agencies" ADD CONSTRAINT "agencies_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "agencies" ADD CONSTRAINT "agencies_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "addresses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clients_destinataires" ADD CONSTRAINT "clients_destinataires_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clients_destinataires" ADD CONSTRAINT "clients_destinataires_destinataireId_fkey" FOREIGN KEY ("destinataireId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_coupons" ADD CONSTRAINT "user_coupons_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_coupons" ADD CONSTRAINT "user_coupons_couponId_fkey" FOREIGN KEY ("couponId") REFERENCES "coupons"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transports" ADD CONSTRAINT "transports_agencyId_fkey" FOREIGN KEY ("agencyId") REFERENCES "agencies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "envois" ADD CONSTRAINT "envois_arrivalAgencyId_fkey" FOREIGN KEY ("arrivalAgencyId") REFERENCES "agencies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "envois" ADD CONSTRAINT "envois_departureAgencyId_fkey" FOREIGN KEY ("departureAgencyId") REFERENCES "agencies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "envois" ADD CONSTRAINT "envois_transportId_fkey" FOREIGN KEY ("transportId") REFERENCES "transports"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "envois" ADD CONSTRAINT "envois_destinataireId_fkey" FOREIGN KEY ("destinataireId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "envois" ADD CONSTRAINT "envois_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tracking_events" ADD CONSTRAINT "tracking_events_envoiId_fkey" FOREIGN KEY ("envoiId") REFERENCES "envois"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_envoiId_fkey" FOREIGN KEY ("envoiId") REFERENCES "envois"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_agencyId_fkey" FOREIGN KEY ("agencyId") REFERENCES "agencies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "envoi_coupons" ADD CONSTRAINT "envoi_coupons_envoiId_fkey" FOREIGN KEY ("envoiId") REFERENCES "envois"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "envoi_coupons" ADD CONSTRAINT "envoi_coupons_couponId_fkey" FOREIGN KEY ("couponId") REFERENCES "coupons"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "parcels" ADD CONSTRAINT "parcels_envoiId_fkey" FOREIGN KEY ("envoiId") REFERENCES "envois"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tarifs" ADD CONSTRAINT "tarifs_agencyId_fkey" FOREIGN KEY ("agencyId") REFERENCES "agencies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transport_schedules" ADD CONSTRAINT "transport_schedules_transportId_fkey" FOREIGN KEY ("transportId") REFERENCES "transports"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

