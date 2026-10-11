-- CreateEnum
CREATE TYPE "PlatformPaymentMode" AS ENUM ('SANDBOX', 'PRODUCTION');

-- AlterEnum
ALTER TYPE "Role" ADD VALUE 'SITE_ADMIN';

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "deactivatedAt" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "platform_settings" (
    "id" TEXT NOT NULL DEFAULT 'default',
    "maintenanceMode" BOOLEAN NOT NULL DEFAULT false,
    "maintenanceMessage" TEXT,
    "registrationEnabled" BOOLEAN NOT NULL DEFAULT true,
    "paymentEnabled" BOOLEAN NOT NULL DEFAULT true,
    "paymentMode" "PlatformPaymentMode" NOT NULL DEFAULT 'SANDBOX',
    "invoiceDurationSeconds" INTEGER NOT NULL DEFAULT 900,
    "shippingEnabled" BOOLEAN NOT NULL DEFAULT true,
    "shippingOriginDistrictId" TEXT,
    "shippingCouriers" TEXT NOT NULL DEFAULT 'jne:sicepat:jnt',
    "shippingWeightPerItemGram" INTEGER NOT NULL DEFAULT 1000,
    "shippingFlatRateIdr" INTEGER NOT NULL DEFAULT 10000,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "platform_settings_pkey" PRIMARY KEY ("id")
);
