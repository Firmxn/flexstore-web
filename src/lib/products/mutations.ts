import { prisma } from "@/lib/db/prisma";
import type { ProductInput } from "./validation";
import {
  cleanupRemovedProductUploads,
  collectProductUploadUrls,
  type ProductUploadSource,
} from "./upload-cleanup";

function calculateTotalStock(variants: { stock: number }[]) {
  return variants.reduce((sum, variant) => sum + variant.stock, 0);
}

// Harga varian termurah disimpan di Product supaya katalog bisa diurutkan
// berdasarkan harga (Prisma tidak mendukung orderBy agregat relasi).
function calculateMinPrice(variants: { price: number }[]) {
  if (variants.length === 0) return 0;
  return Math.min(...variants.map((variant) => variant.price));
}

// Baris gambar (galeri + informasi tambahan + seksi Media & Konten PROD-07)
// untuk nested create ProductImage.
function imageRows(input: ProductInput) {
  const galleryImages = input.images.map((image, index) => ({
    url: image.url,
    role: "GALLERY" as const,
    sortOrder: image.sortOrder ?? index,
  }));
  // Informasi tambahan disimpan sebagai baris gambar dengan peran INFO
  // (PROD-08, dulu SIZE_CHART), terpisah dari galeri.
  const info = input.infoUrl
    ? [{ url: input.infoUrl, role: "INFO" as const, sortOrder: 0 }]
    : [];
  // Seksi Media & Konten: STORY maks 1, LOOKBOOK maks 4 (batas di Zod).
  const story = input.storyImageUrl
    ? [{ url: input.storyImageUrl, role: "STORY" as const, sortOrder: 0 }]
    : [];
  const lookbook = (input.lookbookUrls ?? []).map((url, index) => ({
    url,
    role: "LOOKBOOK" as const,
    sortOrder: index,
  }));

  return [...galleryImages, ...info, ...story, ...lookbook];
}

// Field scalar Product (tanpa nested write) — dipakai create dan update.
function productScalars(input: ProductInput) {
  return {
    name: input.name,
    slug: input.slug,
    description: input.description || null,
    videoHeroUrl: input.videoHeroUrl || null,
    videoHeroAutoplay: input.videoHeroAutoplay ?? true,
    heroImageUrl: input.heroImageUrl || null,
    storyText: input.storyText || null,
    // PROD-08: label judul slot informasi tambahan (null = judul default).
    infoLabel: input.infoLabel || null,
    status: input.status,
    categoryId: input.categoryId,
    brandId: input.brandId || null,
    totalStock: calculateTotalStock(input.variants),
    minPrice: calculateMinPrice(input.variants),
  };
}

function normalizeInput(input: ProductInput) {
  return {
    ...productScalars(input),
    images: {
      create: imageRows(input),
    },
    variants: {
      create: input.variants.map((variant) => ({
        sku: variant.sku,
        name: variant.name,
        price: variant.price,
        stock: variant.stock,
        weightGram: variant.weightGram,
        imageUrl: variant.imageUrl || null,
      })),
    },
  };
}

export function createProduct(input: ProductInput) {
  return prisma.product.create({
    data: normalizeInput(input),
    include: { images: true, variants: true },
  });
}

// Galeri & informasi tambahan tetap diganti seluruhnya (tidak ada FK data lain yang
// menunjuk ProductImage). Varian DIUPSERT PER SKU supaya ID varian yang tetap
// sama tidak berubah: OrderItem (Restrict) dan CartItem (Cascade) menunjuk
// ProductVariant.id, jadi pola lama hapus-buat-ulang membuat ubah status produk
// gagal "Data terkait tidak ditemukan" untuk produk yang pernah dipesan dan
// menghapus item keranjang senyap (bug 2026-10-15, docs/03 PROD-01 bagian 8).
// SKU bersifat global unik sehingga jadi kunci identitas varian.

// Varian yang diminta dibuang masih dipakai riwayat pesanan (FK Restrict).
export class VariantInOrderError extends Error {
  constructor(public readonly skus: string[]) {
    super(`Varian dipakai riwayat pesanan: ${skus.join(", ")}`);
    this.name = "VariantInOrderError";
  }
}

// Varian yang diminta dibuang masih tersimpan di keranjang pembeli (FK
// Cascade akan menghapus CartItem senyap).
export class VariantInCartError extends Error {
  constructor(public readonly cartItemCount: number) {
    super(`Varian masih di keranjang ${cartItemCount} pembeli`);
    this.name = "VariantInCartError";
  }
}

export async function updateProduct(id: string, input: ProductInput) {
  const fields = productScalars(input);

  // TASK-118: snapshot referensi berkas LAMA diisi di dalam transaksi (baris
  // harus dibaca sebelum dihapus); cleanup jalan setelah transaksi tersimpan.
  let previous: ProductUploadSource | null = null;

  // Query berjalan berurutan lewat koneksi jauh (Supabase); transaksi default
  // 5 detik hangus saat menyimpan produk dengan banyak varian/gambar.
  const product = await prisma.$transaction(async (tx) => {
    const existingVariants = await tx.productVariant.findMany({
      where: { productId: id },
    });
    const bySku = new Map(existingVariants.map((variant) => [variant.sku, variant]));
    const keptSkus = new Set(input.variants.map((variant) => variant.sku));
    const removed = existingVariants.filter((variant) => !keptSkus.has(variant.sku));

    if (removed.length > 0) {
      const removedIds = removed.map((variant) => variant.id);

      // Guard penghapusan varian: riwayat pesanan menolak lebih dulu dengan
      // daftar SKU spesifik, baru keranjang (docs/03 PROD-01 bagian 8).
      const ordered = await tx.orderItem.findMany({
        where: { variantId: { in: removedIds } },
        distinct: ["variantId"],
        select: { variantId: true },
      });
      if (ordered.length > 0) {
        const orderedIds = new Set(ordered.map((item) => item.variantId));
        throw new VariantInOrderError(
          removed
            .filter((variant) => orderedIds.has(variant.id))
            .map((variant) => variant.sku),
        );
      }

      const cartItemCount = await tx.cartItem.count({
        where: { variantId: { in: removedIds } },
      });
      if (cartItemCount > 0) throw new VariantInCartError(cartItemCount);

      await tx.productVariant.deleteMany({ where: { id: { in: removedIds } } });
    }

    // Varian yang tetap ada di-upsert pada barisnya sendiri (ID tidak berubah);
    // SKU baru dibuat sebagai varian baru.
    for (const variant of input.variants) {
      const data = {
        sku: variant.sku,
        name: variant.name,
        price: variant.price,
        stock: variant.stock,
        weightGram: variant.weightGram,
        imageUrl: variant.imageUrl || null,
      };
      const match = bySku.get(variant.sku);
      if (match) {
        await tx.productVariant.update({ where: { id: match.id }, data });
      } else {
        await tx.productVariant.create({ data: { ...data, productId: id } });
      }
    }

    // TASK-118: snapshot referensi berkas LAMA sebelum barisnya dihapus —
    // jadi basis hitung URL yang lepas setelah transaksi tersimpan. Gambar
    // varian lama ikut: barisnya bisa hilang (SKU dibuang) atau ganti URL.
    const beforeProduct = await tx.product.findUnique({
      where: { id },
      select: {
        videoHeroUrl: true,
        heroImageUrl: true,
        images: { select: { url: true } },
      },
    });
    if (beforeProduct) {
      previous = {
        videoHeroUrl: beforeProduct.videoHeroUrl,
        heroImageUrl: beforeProduct.heroImageUrl,
        images: beforeProduct.images,
        variants: existingVariants.map((variant) => ({
          imageUrl: variant.imageUrl,
        })),
      };
    }

    await tx.productImage.deleteMany({ where: { productId: id } });

    return tx.product.update({
      where: { id },
      data: {
        ...fields,
        images: { create: imageRows(input) },
      },
      include: { images: true, variants: true },
    });
  }, { timeout: 15_000, maxWait: 10_000 });

  // Task-118 Lapis 2: hapus berkas URL lama dari Uploadthing — dilakukan
  // SETELAH transaksi tersimpan supaya baris baru sudah terbaca saat cek
  // silang; kegagalan Uploadthing hanya log, simpan produk tidak ikut gagal.
  if (previous) {
    const stillUsed = new Set(collectProductUploadUrls(product));
    const removed = collectProductUploadUrls(previous).filter(
      (url) => !stillUsed.has(url),
    );
    await cleanupRemovedProductUploads(removed, "updateProduct");
  }
  return product;
}

export async function deleteProduct(id: string) {
  // TASK-118: kaskade FK menghapus ProductImage & ProductVariant, jadi URL
  // berkasnya harus disnapshot SEBELUM penghapusan.
  const before = await prisma.product.findUnique({
    where: { id },
    select: {
      videoHeroUrl: true,
      heroImageUrl: true,
      images: { select: { url: true } },
      variants: { select: { imageUrl: true } },
    },
  });

  // ProductImage & ProductVariant ikut terhapus (onDelete: Cascade).
  await prisma.product.delete({ where: { id } });

  if (before) {
    await cleanupRemovedProductUploads(
      collectProductUploadUrls(before),
      "deleteProduct",
    );
  }
}

export function countCartItemsForProduct(productId: string) {
  // Jumlah CartItem (keranjang Customer) yang menunjuk varian produk ini.
  // Dipakai delete route untuk menolak penghapusan yang akan menghapus
  // item keranjang pembeli secara diam-diam lewat kaskade FK.
  return prisma.cartItem.count({ where: { variant: { productId } } });
}
