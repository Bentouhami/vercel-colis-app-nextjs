-- CreateEnum
CREATE TYPE "roles" AS ENUM ('CLIENT', 'ADMIN', 'DESTINATAIRE', 'AGENCY_ADMIN');

-- CreateEnum
CREATE TYPE "simulation_status" AS ENUM ('DRAFT', 'CONFIRMED', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "envoi_status" AS ENUM ('PENDING', 'SENT', 'DELIVERED', 'CANCELLED', 'RETURNED');

-- CreateEnum
CREATE TYPE "appointment_status" AS ENUM ('PENDING', 'CONFIRMED', 'CANCELLED', 'RESCHEDULED', 'COMPLETED', 'MISSED', 'IN_PROGRESS');

-- CreateTable
CREATE TABLE "users"
(
    "id"                       SERIAL       NOT NULL,
    "firstName"                VARCHAR(50),
    "lastName"                 VARCHAR(50),
    "name"                     TEXT,
    "birthDate"                TIMESTAMP(3),
    "email"                    VARCHAR(150) NOT NULL,
    "phoneNumber"              VARCHAR(50),
    "password"                 VARCHAR(255)          DEFAULT '',
    "image"                    VARCHAR(255)          DEFAULT '',
    "roles"                    "roles"[]             DEFAULT ARRAY ['CLIENT']::"roles"[],
    "agencyId"                 INTEGER,
    "isVerified"               BOOLEAN               DEFAULT false,
    "emailVerified"            TIMESTAMP(3),
    "verificationToken"        VARCHAR(255),
    "verificationTokenExpires" TIMESTAMP(3),
    "addressId"                INTEGER,
    "createdAt"                TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"                TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accounts"
(
    "userId"            INTEGER      NOT NULL,
    "type"              TEXT         NOT NULL,
    "provider"          TEXT         NOT NULL,
    "providerAccountId" TEXT         NOT NULL,
    "refresh_token"     TEXT,
    "access_token"      TEXT,
    "expires_at"        INTEGER,
    "token_type"        TEXT,
    "scope"             TEXT,
    "id_token"          TEXT,
    "session_state"     TEXT,
    "createdAt"         TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"         TIMESTAMP(3) NOT NULL,

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("provider", "providerAccountId")
);

-- CreateTable
CREATE TABLE "verification_tokens"
(
    "identifier" TEXT         NOT NULL,
    "token"      TEXT         NOT NULL,
    "expires"    TIMESTAMP(3) NOT NULL,

    CONSTRAINT "verification_tokens_pkey" PRIMARY KEY ("identifier", "token")
);

-- CreateTable
CREATE TABLE "sessions"
(
    "sessionToken" TEXT         NOT NULL,
    "userId"       INTEGER      NOT NULL,
    "expires"      TIMESTAMP(3) NOT NULL,
    "createdAt"    TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"    TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "authenticators"
(
    "credentialID"         TEXT    NOT NULL,
    "userId"               INTEGER NOT NULL,
    "providerAccountId"    TEXT    NOT NULL,
    "credentialPublicKey"  TEXT    NOT NULL,
    "counter"              INTEGER NOT NULL,
    "credentialDeviceType" TEXT    NOT NULL,
    "credentialBackedUp"   BOOLEAN NOT NULL,
    "transports"           TEXT,

    CONSTRAINT "authenticators_pkey" PRIMARY KEY ("userId", "credentialID")
);

-- CreateTable
CREATE TABLE "notifications"
(
    "id"             SERIAL       NOT NULL,
    "message"        VARCHAR(255) NOT NULL,
    "envoisId"       INTEGER      NOT NULL,
    "agencyId"       INTEGER      NOT NULL,
    "userId"         INTEGER      NOT NULL,
    "destinataireId" INTEGER      NOT NULL,
    "envoiId"        INTEGER      NOT NULL,
    "isRead"         BOOLEAN      NOT NULL DEFAULT false,
    "createdAt"      TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"      TIMESTAMP(3) NOT NULL,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "addresses"
(
    "id"        SERIAL       NOT NULL,
    "street"    VARCHAR(50)  NOT NULL,
    "number"    VARCHAR(50),
    "city"      VARCHAR(50)  NOT NULL,
    "zipCode"   VARCHAR(50)  NOT NULL,
    "country"   VARCHAR(50)  NOT NULL,
    "latitude"  DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "addresses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "agencies"
(
    "id"             SERIAL       NOT NULL,
    "name"           VARCHAR(50)  NOT NULL,
    "location"       VARCHAR(250),
    "addressId"      INTEGER      NOT NULL,
    "capacity"       INTEGER      NOT NULL,
    "availableSlots" INTEGER      NOT NULL,
    "updatedAt"      TIMESTAMP(3) NOT NULL,
    "createdAt"      TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "agencies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "clients_destinataires"
(
    "id"             SERIAL       NOT NULL,
    "clientId"       INTEGER      NOT NULL,
    "destinataireId" INTEGER      NOT NULL,
    "createdAt"      TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "clients_destinataires_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "coupons"
(
    "id"                 SERIAL         NOT NULL,
    "couponCode"         VARCHAR(50)    NOT NULL,
    "discountAmount"     DECIMAL(10, 2) NOT NULL,
    "discountPercentage" DECIMAL(5, 2)  NOT NULL,
    "numberOfUses"       INTEGER        NOT NULL,
    "startDate"          TIMESTAMP(3)   NOT NULL,
    "expirationDate"     TIMESTAMP(3),
    "termsAndConditions" VARCHAR(255),
    "createdAt"          TIMESTAMP(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"          TIMESTAMP(3)   NOT NULL,

    CONSTRAINT "coupons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_coupons"
(
    "userId"   INTEGER NOT NULL,
    "couponId" INTEGER NOT NULL,

    CONSTRAINT "user_coupons_pkey" PRIMARY KEY ("userId", "couponId")
);

-- CreateTable
CREATE TABLE "transports"
(
    "id"            SERIAL         NOT NULL,
    "number"        VARCHAR(15)    NOT NULL,
    "baseVolume"    DECIMAL(12, 2) NOT NULL,
    "baseWeight"    DECIMAL(10, 2) NOT NULL,
    "currentVolume" DECIMAL(12, 2) NOT NULL,
    "currentWeight" DECIMAL(10, 2) NOT NULL,
    "isAvailable"   BOOLEAN        NOT NULL DEFAULT true,
    "createdAt"     TIMESTAMP(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"     TIMESTAMP(3)   NOT NULL,

    CONSTRAINT "transports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "envois"
(
    "id"                SERIAL              NOT NULL,
    "trackingNumber"    VARCHAR(50)                  DEFAULT '',
    "qrCodeUrl"         VARCHAR(255)                 DEFAULT '',
    "userId"            INTEGER,
    "destinataireId"    INTEGER,
    "transportId"       INTEGER,
    "departureAgencyId" INTEGER             NOT NULL,
    "arrivalAgencyId"   INTEGER             NOT NULL,
    "simulationStatus"  "simulation_status" NOT NULL DEFAULT 'DRAFT',
    "status"            "envoi_status"               DEFAULT 'PENDING',
    "totalWeight"       DOUBLE PRECISION    NOT NULL,
    "totalVolume"       DOUBLE PRECISION    NOT NULL,
    "totalPrice"        DOUBLE PRECISION    NOT NULL,
    "departureDate"     TIMESTAMP(3)        NOT NULL,
    "arrivalDate"       TIMESTAMP(3)        NOT NULL,
    "verificationToken" UUID                NOT NULL,
    "comment"           TEXT,
    "createdAt"         TIMESTAMP(3)        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"         TIMESTAMP(3)        NOT NULL,

    CONSTRAINT "envois_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "appointments"
(
    "id"        SERIAL               NOT NULL,
    "envoiId"   INTEGER              NOT NULL,
    "agencyId"  INTEGER              NOT NULL,
    "date"      TIMESTAMP(3)         NOT NULL,
    "status"    "appointment_status" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3)         NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3)         NOT NULL,

    CONSTRAINT "appointments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "envoi_coupons"
(
    "envoiId"  INTEGER NOT NULL,
    "couponId" INTEGER NOT NULL,

    CONSTRAINT "envoi_coupons_pkey" PRIMARY KEY ("envoiId", "couponId")
);

-- CreateTable
CREATE TABLE "parcels"
(
    "id"        SERIAL        NOT NULL,
    "height"    DECIMAL(5, 2) NOT NULL,
    "weight"    DECIMAL(5, 2) NOT NULL,
    "width"     DECIMAL(5, 2) NOT NULL,
    "length"    DECIMAL(5, 2) NOT NULL,
    "createdAt" TIMESTAMP(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3)  NOT NULL,
    "envoiId"   INTEGER       NOT NULL,

    CONSTRAINT "parcels_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tarifs"
(
    "id"         SERIAL        NOT NULL,
    "agencyId"   INTEGER,
    "weightRate" DECIMAL(5, 2) NOT NULL,
    "volumeRate" DECIMAL(5, 2) NOT NULL,
    "baseRate"   DECIMAL(5, 2) NOT NULL,
    "fixedRate"  DECIMAL(5, 2) NOT NULL,
    "createdAt"  TIMESTAMP(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"  TIMESTAMP(3)  NOT NULL,

    CONSTRAINT "tarifs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transport_schedules"
(
    "id"            SERIAL       NOT NULL,
    "transportId"   INTEGER      NOT NULL,
    "departureDate" TIMESTAMP(3) NOT NULL,
    "arrivalDate"   TIMESTAMP(3) NOT NULL,
    "isHoliday"     BOOLEAN      NOT NULL DEFAULT false,
    "createdAt"     TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"     TIMESTAMP(3) NOT NULL,

    CONSTRAINT "transport_schedules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_AgencyAdmins"
(
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_AgencyClients"
(
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users" ("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_phoneNumber_key" ON "users" ("phoneNumber");

-- CreateIndex
CREATE UNIQUE INDEX "users_verificationToken_key" ON "users" ("verificationToken");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_sessionToken_key" ON "sessions" ("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "authenticators_credentialID_key" ON "authenticators" ("credentialID");

-- CreateIndex
CREATE UNIQUE INDEX "agencies_addressId_key" ON "agencies" ("addressId");

-- CreateIndex
CREATE UNIQUE INDEX "clients_destinataires_clientId_destinataireId_key" ON "clients_destinataires" ("clientId", "destinataireId");

-- CreateIndex
CREATE UNIQUE INDEX "envois_trackingNumber_key" ON "envois" ("trackingNumber");

-- CreateIndex
CREATE UNIQUE INDEX "envois_verificationToken_key" ON "envois" ("verificationToken");

-- CreateIndex
CREATE UNIQUE INDEX "appointments_envoiId_key" ON "appointments" ("envoiId");

-- CreateIndex
CREATE UNIQUE INDEX "_AgencyAdmins_AB_unique" ON "_AgencyAdmins" ("A", "B");

-- CreateIndex
CREATE INDEX "_AgencyAdmins_B_index" ON "_AgencyAdmins" ("B");

-- CreateIndex
CREATE UNIQUE INDEX "_AgencyClients_AB_unique" ON "_AgencyClients" ("A", "B");

-- CreateIndex
CREATE INDEX "_AgencyClients_B_index" ON "_AgencyClients" ("B");

-- AddForeignKey
ALTER TABLE "users"
    ADD CONSTRAINT "users_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "addresses" ("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accounts"
    ADD CONSTRAINT "accounts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions"
    ADD CONSTRAINT "sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "authenticators"
    ADD CONSTRAINT "authenticators_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications"
    ADD CONSTRAINT "notifications_agencyId_fkey" FOREIGN KEY ("agencyId") REFERENCES "agencies" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications"
    ADD CONSTRAINT "notifications_envoiId_fkey" FOREIGN KEY ("envoiId") REFERENCES "envois" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications"
    ADD CONSTRAINT "notifications_destinataireId_fkey" FOREIGN KEY ("destinataireId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications"
    ADD CONSTRAINT "notifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "agencies"
    ADD CONSTRAINT "agencies_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "addresses" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clients_destinataires"
    ADD CONSTRAINT "clients_destinataires_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clients_destinataires"
    ADD CONSTRAINT "clients_destinataires_destinataireId_fkey" FOREIGN KEY ("destinataireId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_coupons"
    ADD CONSTRAINT "user_coupons_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_coupons"
    ADD CONSTRAINT "user_coupons_couponId_fkey" FOREIGN KEY ("couponId") REFERENCES "coupons" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "envois"
    ADD CONSTRAINT "envois_arrivalAgencyId_fkey" FOREIGN KEY ("arrivalAgencyId") REFERENCES "agencies" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "envois"
    ADD CONSTRAINT "envois_departureAgencyId_fkey" FOREIGN KEY ("departureAgencyId") REFERENCES "agencies" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "envois"
    ADD CONSTRAINT "envois_transportId_fkey" FOREIGN KEY ("transportId") REFERENCES "transports" ("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "envois"
    ADD CONSTRAINT "envois_destinataireId_fkey" FOREIGN KEY ("destinataireId") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "envois"
    ADD CONSTRAINT "envois_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appointments"
    ADD CONSTRAINT "appointments_envoiId_fkey" FOREIGN KEY ("envoiId") REFERENCES "envois" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appointments"
    ADD CONSTRAINT "appointments_agencyId_fkey" FOREIGN KEY ("agencyId") REFERENCES "agencies" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "envoi_coupons"
    ADD CONSTRAINT "envoi_coupons_envoiId_fkey" FOREIGN KEY ("envoiId") REFERENCES "envois" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "envoi_coupons"
    ADD CONSTRAINT "envoi_coupons_couponId_fkey" FOREIGN KEY ("couponId") REFERENCES "coupons" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "parcels"
    ADD CONSTRAINT "parcels_envoiId_fkey" FOREIGN KEY ("envoiId") REFERENCES "envois" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tarifs"
    ADD CONSTRAINT "tarifs_agencyId_fkey" FOREIGN KEY ("agencyId") REFERENCES "agencies" ("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transport_schedules"
    ADD CONSTRAINT "transport_schedules_transportId_fkey" FOREIGN KEY ("transportId") REFERENCES "transports" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AgencyAdmins"
    ADD CONSTRAINT "_AgencyAdmins_A_fkey" FOREIGN KEY ("A") REFERENCES "agencies" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AgencyAdmins"
    ADD CONSTRAINT "_AgencyAdmins_B_fkey" FOREIGN KEY ("B") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AgencyClients"
    ADD CONSTRAINT "_AgencyClients_A_fkey" FOREIGN KEY ("A") REFERENCES "agencies" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AgencyClients"
    ADD CONSTRAINT "_AgencyClients_B_fkey" FOREIGN KEY ("B") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE;
