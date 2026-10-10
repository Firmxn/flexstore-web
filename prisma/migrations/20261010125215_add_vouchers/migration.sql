-- CreateEnum
CREATE TYPE "VoucherType" AS ENUM ('PERCENTAGE', 'NOMINAL', 'SHIPPING');

-- CreateTable
CREATE TABLE "vouchers" (
    "id" UUID NOT NULL,
    "code" TEXT NOT NULL,
    "type" "VoucherType" NOT NULL,
    "discountPercentage" DECIMAL(5,2),
    "discountAmount" DECIMAL(12,2),
    "maxDiscount" DECIMAL(12,2),
    "minTransaction" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "usageLimit" INTEGER,
    "usageCount" INTEGER NOT NULL DEFAULT 0,
    "usageLimitPerPhone" INTEGER,
    "validFrom" TIMESTAMP(3) NOT NULL,
    "validUntil" TIMESTAMP(3) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "vouchers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "voucher_compatibilities" (
    "id" UUID NOT NULL,
    "voucherAId" UUID NOT NULL,
    "voucherBId" UUID NOT NULL,
    "isAllowed" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "voucher_compatibilities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "voucher_usages" (
    "id" UUID NOT NULL,
    "voucherId" UUID NOT NULL,
    "orderId" UUID NOT NULL,
    "phone" TEXT,
    "amount" DECIMAL(12,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "voucher_usages_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "vouchers_code_key" ON "vouchers"("code");

-- CreateIndex
CREATE INDEX "vouchers_isActive_validFrom_validUntil_idx" ON "vouchers"("isActive", "validFrom", "validUntil");

-- CreateIndex
CREATE INDEX "voucher_compatibilities_voucherBId_idx" ON "voucher_compatibilities"("voucherBId");

-- CreateIndex
CREATE UNIQUE INDEX "voucher_compatibilities_voucherAId_voucherBId_key" ON "voucher_compatibilities"("voucherAId", "voucherBId");

-- CreateIndex
CREATE INDEX "voucher_usages_voucherId_idx" ON "voucher_usages"("voucherId");

-- CreateIndex
CREATE INDEX "voucher_usages_phone_idx" ON "voucher_usages"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "voucher_usages_voucherId_orderId_key" ON "voucher_usages"("voucherId", "orderId");

-- AddForeignKey
ALTER TABLE "voucher_compatibilities" ADD CONSTRAINT "voucher_compatibilities_voucherAId_fkey" FOREIGN KEY ("voucherAId") REFERENCES "vouchers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "voucher_compatibilities" ADD CONSTRAINT "voucher_compatibilities_voucherBId_fkey" FOREIGN KEY ("voucherBId") REFERENCES "vouchers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "voucher_usages" ADD CONSTRAINT "voucher_usages_voucherId_fkey" FOREIGN KEY ("voucherId") REFERENCES "vouchers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "voucher_usages" ADD CONSTRAINT "voucher_usages_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;
