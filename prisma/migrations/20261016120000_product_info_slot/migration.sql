-- AlterEnum
-- PROD-08: nilai enum "SIZE_CHART" berganti nama jadi "INFO" (slot informasi
-- tambahan produk). RENAME VALUE mempertahankan baris gambar yang sudah ada.
ALTER TYPE "ImageRole" RENAME VALUE 'SIZE_CHART' TO 'INFO';

-- AlterTable
ALTER TABLE "products" ADD COLUMN     "infoLabel" TEXT;
