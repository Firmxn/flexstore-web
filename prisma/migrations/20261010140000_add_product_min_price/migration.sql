-- Harga varian termurah per produk (denormalisasi dari ProductVariant) supaya
-- katalog bisa mengurutkan berdasarkan harga. Prisma tidak mendukung orderBy
-- terhadap agregat relasi, jadi nilainya disimpan di kolom sendiri dan
-- disinkronkan oleh aplikasi (pola sama seperti "totalStock").

ALTER TABLE "products" ADD COLUMN "minPrice" DECIMAL(12,2) NOT NULL DEFAULT 0;

UPDATE "products" p
SET "minPrice" = COALESCE(
  (SELECT MIN(v."price") FROM "product_variants" v WHERE v."productId" = p."id"),
  0
);

CREATE INDEX "products_status_minPrice_idx" ON "products"("status", "minPrice");
