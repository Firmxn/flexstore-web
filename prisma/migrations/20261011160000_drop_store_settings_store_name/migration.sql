-- Hapus kolom storeName pada store_settings.
-- Alasan: 1 deployment = 1 brand = 1 store (PRD revisi 1.2) — identitas toko
-- memakai BrandSetting.brandName (SITE-05). Field "nama toko" menjadi duplikat
-- konsep; label pickup di checkout dialihkan ke brandName.
ALTER TABLE "store_settings" DROP COLUMN "storeName";
