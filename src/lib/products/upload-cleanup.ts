import { UTApi } from "uploadthing/server";
import { prisma } from "@/lib/db/prisma";

// TASK-118 (docs/03 PROD-01, PH-12): admin menghapus gambar/video dari produk,
// tetapi URL lama yang sudah lepas dari produk tetap tersimpan di Uploadthing
// dan menjadi berkas yatim (orphan). Modul ini mengumpulkan seluruh URL berkas
// milik satu produk, lalu setelah transaksi simpan berhasil:
//   1. cek silang satu putaran — URL yang masih dirujuk mana pun tidak dihapus;
//   2. sisanya dihapus dari Uploadthing lewat `UTApi.deleteFiles`.
// Kegagalan langkah 2 tidak boleh memengaruhi hasil simpan produk (log saja).

// Baris minimum untuk mengumpulkan seluruh referensi berkas milik satu produk:
// semua peran ProductImage (galeri, informasi tambahan, cerita, lookbook),
// gambar varian, banner gambar, dan video hero.
export type ProductUploadSource = {
  images: { url: string }[];
  variants: { imageUrl: string | null }[];
  videoHeroUrl: string | null;
  heroImageUrl: string | null;
};

// URL berkas yang tersimpan selalu dalam bentuk ungsuhan (`file.ufsUrl`, mis.
// `https://<app>.ufs.sh/f/<fileKey>`). `UTApi.deleteFiles` versi uploadthing 7
// hanya menerima fileKey/customId — bukan URL — jadi key diambil dari segmen
// terakhir jalannya URL.
function fileKeyFromUrl(url: string): string | null {
  try {
    const segments = new URL(url).pathname.split("/").filter(Boolean);
    return segments.at(-1) ?? null;
  } catch {
    return null;
  }
}

// Seluruh URL berkas yang dirujuk satu produk — unik, kosong tidak ikut.
export function collectProductUploadUrls(product: ProductUploadSource): string[] {
  const urls = [
    ...product.images.map((image) => image.url),
    ...product.variants.map((variant) => variant.imageUrl),
    product.videoHeroUrl,
    product.heroImageUrl,
  ].filter((url): url is string => Boolean(url));
  return [...new Set(urls)];
}

let utapi: UTApi | null = null;
function utapiInstance() {
  utapi ??= new UTApi();
  return utapi;
}

// Lapis 2: dari daftar URL yang baru saja lepas dari sebuah produk, hapus dari
// penyimpanan hanya yang sudah tidak dirujuk entitas mana pun. Pemanggil wajib
// menjalankan ini SETELAH transaksi simpan terlanjur tersimpan, supaya baris
// baru benar-benar terbaca oleh pemeriksaan di bawah;
export async function cleanupRemovedProductUploads(
  urls: string[],
  context: string,
): Promise<void> {
  const unique = [...new Set(urls)].filter(Boolean);
  if (unique.length === 0) return;

  try {
    // Cek silang satu putaran (docs/03 PROD-01): ProductImage mana pun
    // (termasuk role informasi tambahan), gambar varian mana pun, dan kolom
    // langsung Product (banner/video hero) supaya URL yang dipakai produk
    // sendiri lewat slot lain ikut terlindungi.
    const [imageRows, variantRows, productRows] = await Promise.all([
      prisma.productImage.findMany({
        where: { url: { in: unique } },
        select: { url: true },
      }),
      prisma.productVariant.findMany({
        where: { imageUrl: { in: unique } },
        select: { imageUrl: true },
      }),
      prisma.product.findMany({
        where: {
          OR: [
            { videoHeroUrl: { in: unique } },
            { heroImageUrl: { in: unique } },
          ],
        },
        select: { videoHeroUrl: true, heroImageUrl: true },
      }),
    ]);

    const referenced = new Set<string>(
      [
        ...imageRows.map((row) => row.url),
        ...variantRows.map((row) => row.imageUrl),
        ...productRows.flatMap((row) => [row.videoHeroUrl, row.heroImageUrl]),
      ].filter((url): url is string => Boolean(url)),
    );

    const orphans = unique.filter((url) => !referenced.has(url));

    if (referenced.size > 0) {
      console.info(
        `[upload-cleanup] ${context}: ${referenced.size} URL masih dirujuk, tidak dihapus`,
      );
    }
    if (orphans.length === 0) {
      return;
    }

    const keys = orphans
      .map((url) => fileKeyFromUrl(url))
      .filter((key): key is string => Boolean(key));
    if (keys.length === 0) {
      console.warn(
        `[upload-cleanup] ${context}: ${orphans.length} URL tidak bisa dibaca kuncinya, dilewati`,
      );
      return;
    }

    const result = await utapiInstance().deleteFiles(keys);
    console.info(
      `[upload-cleanup] ${context}: menghapus ${result.deletedCount}/${keys.length} berkas dari Uploadthing`,
    );
  } catch (error) {
    // Lapis kegagalan (docs/03 PROD-01): berkas tersisa sebagai orphan, simpan
    // produk tetap sukses — hanya log.
    console.error(`[upload-cleanup] ${context}: gagal membersihkan berkas`, error);
  }
}
