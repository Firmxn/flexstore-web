-- CreateEnum
CREATE TYPE "VoucherProductKind" AS ENUM ('ELIGIBLE', 'EXCLUDED');

-- AlterTable
ALTER TABLE "voucher_products" ADD COLUMN     "kind" "VoucherProductKind" NOT NULL DEFAULT 'ELIGIBLE';
