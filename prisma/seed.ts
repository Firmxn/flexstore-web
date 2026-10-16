import { randomBytes } from "node:crypto";
import { PrismaClient, type ProductStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const BCRYPT_ROUNDS = 10;

const CATEGORIES = [
  { name: "Pakaian Pria", slug: "pakaian-pria" },
  { name: "Pakaian Wanita", slug: "pakaian-wanita" },
  { name: "Sepatu", slug: "sepatu" },
  { name: "Aksesoris", slug: "aksesoris" },
];

const BRANDS = [
  { name: "Flexstore Basics", slug: "flexstore-basics" },
  { name: "Nusantara Wear", slug: "nusantara-wear" },
  { name: "Urban Step", slug: "urban-step" },
];

type SeedProduct = {
  name: string;
  slug: string;
  description: string;
  status: ProductStatus;
  categorySlug: string;
  // Opsional: produk bisa lahir tanpa brand (`Product.brandId` nullable).
  brandSlug?: string;
  // Opsional: kosong = produk tanpa gambar placeholder. Pada produk yang
  // sudah ada, diabaikan oleh seed supaya gambar yang diunggah manual lewat
  // form admin tidak terhapus saat seed dijalankan ulang.
  imageSeeds?: string[];
  variants: {
    sku: string;
    name: string;
    price: number;
    stock: number;
    weightGram: number;
  }[];
};

const PRODUCTS: SeedProduct[] = [
  {
    name: "Kaos Polos Katun Combed 30s",
    slug: "kaos-polos-katun-combed-30s",
    description:
      "Kaos polos berbahan katun combed 30s, adem dan menyerap keringat. Cocok untuk pemakaian harian.",
    status: "ACTIVE",
    categorySlug: "pakaian-pria",
    brandSlug: "flexstore-basics",
    imageSeeds: ["kaos-polos-1", "kaos-polos-2"],
    variants: [
      { sku: "KP-30S-M", name: "Size M - Hitam", price: 79000, stock: 25, weightGram: 200 },
      { sku: "KP-30S-L", name: "Size L - Hitam", price: 79000, stock: 30, weightGram: 200 },
      { sku: "KP-30S-XL", name: "Size XL - Putih", price: 84000, stock: 12, weightGram: 220 },
    ],
  },
  {
    name: "Kemeja Flanel Lengan Panjang",
    slug: "kemeja-flanel-lengan-panjang",
    description:
      "Kemeja flanel motif kotak dengan bahan tebal yang nyaman, cocok untuk cuaca dingin.",
    status: "ACTIVE",
    categorySlug: "pakaian-pria",
    brandSlug: "nusantara-wear",
    imageSeeds: ["kemeja-flanel-1"],
    variants: [
      { sku: "KF-LP-M", name: "Size M - Merah", price: 185000, stock: 10, weightGram: 350 },
      { sku: "KF-LP-L", name: "Size L - Merah", price: 185000, stock: 8, weightGram: 370 },
    ],
  },
  {
    name: "Blouse Katun Lengan Panjang",
    slug: "blouse-katun-lengan-panjang",
    description:
      "Blouse katun dengan potongan longgar, nyaman dipakai sepanjang hari.",
    status: "ACTIVE",
    categorySlug: "pakaian-wanita",
    brandSlug: "nusantara-wear",
    imageSeeds: ["blouse-1"],
    variants: [
      { sku: "BL-KT-S", name: "Size S - Navy", price: 149000, stock: 15, weightGram: 180 },
      { sku: "BL-KT-M", name: "Size M - Navy", price: 149000, stock: 18, weightGram: 200 },
    ],
  },
  {
    name: "Sneakers Urban Canvas",
    slug: "sneakers-urban-canvas",
    description:
      "Sneakers kanvas dengan sol karet anti-slip. Ringan dan cocok untuk aktivitas harian.",
    status: "ACTIVE",
    categorySlug: "sepatu",
    brandSlug: "urban-step",
    imageSeeds: ["sneakers-canvas-1", "sneakers-canvas-2"],
    variants: [
      { sku: "SN-CV-40", name: "Size 40 - Putih", price: 329000, stock: 7, weightGram: 800 },
      { sku: "SN-CV-41", name: "Size 41 - Putih", price: 329000, stock: 9, weightGram: 820 },
      { sku: "SN-CV-42", name: "Size 42 - Hitam", price: 339000, stock: 5, weightGram: 850 },
    ],
  },
  {
    name: "Topi Baseball Basic",
    slug: "topi-baseball-basic",
    description: "Topi baseball dengan bahan twill, adjustable strap di bagian belakang.",
    status: "ACTIVE",
    categorySlug: "aksesoris",
    brandSlug: "flexstore-basics",
    imageSeeds: ["topi-basic-1"],
    variants: [
      { sku: "TB-BSC-BLK", name: "Hitam", price: 89000, stock: 40, weightGram: 150 },
      { sku: "TB-BSC-NVY", name: "Navy", price: 89000, stock: 22, weightGram: 150 },
    ],
  },
  {
    name: "Tas Selempang Kanvas",
    slug: "tas-selempang-kanvas",
    description: "Tas selempang kanvas dengan dua kompartemen dan tali adjustable.",
    status: "DRAFT",
    categorySlug: "aksesoris",
    brandSlug: "flexstore-basics",
    imageSeeds: ["tas-selempang-1"],
    variants: [
      { sku: "TS-KNV-STD", name: "Standard - Khaki", price: 129000, stock: 0, weightGram: 500 },
    ],
  },
  // --- Produk tanpa brand & tanpa gambar placeholder ---------------------
  // Gambar diisi manual oleh admin lewat form produk; `imageSeeds` sengaja
  // tidak diisi supaya seed ulang tidak menghapus unggahan manual.
  {
    name: "Hoodie Zip Fleece",
    slug: "hoodie-zip-fleece",
    description:
      "Hoodie zipper berbahan fleece tebal dengan saku depan dan tali hoodie adjustable. Hangat untuk cuaca dingin.",
    status: "ACTIVE",
    categorySlug: "pakaian-pria",
    variants: [
      { sku: "HZ-FL-M", name: "Size M - Abu-abu", price: 249000, stock: 14, weightGram: 450 },
      { sku: "HZ-FL-L", name: "Size L - Abu-abu", price: 249000, stock: 11, weightGram: 470 },
      { sku: "HZ-FL-XL", name: "Size XL - Hitam", price: 259000, stock: 6, weightGram: 490 },
    ],
  },
  {
    name: "Dress Casual Lengan Pendek",
    slug: "dress-casual-lengan-pendek",
    description:
      "Dress casual dengan bahan rayon adem dan potongan flowy, cocok untuk acara santai maupun formal kasual.",
    status: "ACTIVE",
    categorySlug: "pakaian-wanita",
    variants: [
      { sku: "DC-RY-S", name: "Size S - Floral", price: 179000, stock: 9, weightGram: 220 },
      { sku: "DC-RY-M", name: "Size M - Floral", price: 179000, stock: 12, weightGram: 240 },
    ],
  },
  {
    name: "Sandal Gunung Strap",
    slug: "sandal-gunung-strap",
    description:
      "Sandal gunung dengan sol karet tebal anti-slip dan tali strap yang bisa disesuaikan. Cocok untuk outdoor maupun harian.",
    status: "ACTIVE",
    categorySlug: "sepatu",
    variants: [
      // 6 size x 2 warna: satu baris per kombinasi (pola seed lainnya).
      { sku: "SG-STR-39-BLK", name: "Size 39 - Hitam", price: 139000, stock: 9, weightGram: 550 },
      { sku: "SG-STR-39-GRN", name: "Size 39 - Hijau", price: 139000, stock: 9, weightGram: 550 },
      { sku: "SG-STR-40-BLK", name: "Size 40 - Hitam", price: 139000, stock: 10, weightGram: 570 },
      { sku: "SG-STR-40-GRN", name: "Size 40 - Hijau", price: 139000, stock: 10, weightGram: 570 },
      { sku: "SG-STR-41-BLK", name: "Size 41 - Hitam", price: 139000, stock: 8, weightGram: 590 },
      { sku: "SG-STR-41-GRN", name: "Size 41 - Hijau", price: 139000, stock: 7, weightGram: 590 },
      { sku: "SG-STR-42-BLK", name: "Size 42 - Hitam", price: 139000, stock: 8, weightGram: 610 },
      { sku: "SG-STR-42-GRN", name: "Size 42 - Hijau", price: 139000, stock: 7, weightGram: 610 },
      { sku: "SG-STR-43-BLK", name: "Size 43 - Hitam", price: 139000, stock: 6, weightGram: 630 },
      { sku: "SG-STR-43-GRN", name: "Size 43 - Hijau", price: 139000, stock: 6, weightGram: 630 },
      { sku: "SG-STR-44-BLK", name: "Size 44 - Hitam", price: 139000, stock: 6, weightGram: 650 },
      { sku: "SG-STR-44-GRN", name: "Size 44 - Hijau", price: 139000, stock: 6, weightGram: 650 },
    ],
  },
  {
    name: "Dompet Kulit Minimalis",
    slug: "dompet-kulit-minimalis",
    description:
      "Dompet kulit sintetis desain minimalis dengan banyak slot kartu dan resleting koin.",
    status: "ACTIVE",
    categorySlug: "aksesoris",
    variants: [
      { sku: "DK-MIN-BRN", name: "Cokelat", price: 99000, stock: 26, weightGram: 120 },
      { sku: "DK-MIN-BLK", name: "Hitam", price: 99000, stock: 31, weightGram: 120 },
    ],
  },
  {
    name: "Kaos Oversize Graphic",
    slug: "kaos-oversize-graphic",
    description:
      "Kaos oversize bahan katun combed dengan sablon graphic di bagian depan. Nyaman dan kekinian.",
    status: "DRAFT",
    categorySlug: "pakaian-pria",
    variants: [
      { sku: "KO-GC-M", name: "Size M - Putih", price: 99000, stock: 20, weightGram: 210 },
      { sku: "KO-GC-L", name: "Size L - Hitam", price: 99000, stock: 20, weightGram: 230 },
    ],
  },
];

function imageUrl(seed: string, index: number) {
  return `https://picsum.photos/seed/${seed}-${index}/800/800`;
}

async function seedAdmin() {
  const email = process.env.SEED_ADMIN_EMAIL ?? "storeadmin@flexstore.local";
  const existing = await prisma.user.findUnique({ where: { email } });

  if (existing) {
    console.log(`Admin sudah ada: ${email}`);
    return;
  }

  // Password diambil dari environment. Kalau tidak diisi, dibuat acak dan
  // dicetak sekali di sini supaya tidak ada kredensial yang ter-hardcode.
  //
  // Pakai `||`, bukan `??`: di `.env.local` variabel yang dikosongkan bernilai
  // string kosong (""), bukan undefined. Dengan `??` string kosong dianggap
  // nilai sah, sehingga admin sempat dibuat dengan password kosong.
  const configured = process.env.SEED_ADMIN_PASSWORD?.trim();
  const plainPassword = configured || randomBytes(9).toString("base64url");
  const generated = !configured;

  // Jaring pengaman: jangan pernah membuat akun admin tanpa password.
  if (!plainPassword) {
    throw new Error("Password admin kosong; seed dibatalkan.");
  }

  await prisma.user.create({
    data: {
      email,
      name: process.env.SEED_ADMIN_NAME ?? "Store Admin",
      password: await bcrypt.hash(plainPassword, BCRYPT_ROUNDS),
      role: "STORE_ADMIN",
    },
  });

  console.log(`Admin dibuat: ${email}`);
  if (generated) {
    console.log(`Password admin (acak, simpan sekarang): ${plainPassword}`);
  }
}

// SITE-00 (PH-08): akun Site Admin pertama, pola sama seperti Store Admin.
// Password dari env; kalau kosong dibuat acak dan dicetak sekali.
async function seedSiteAdmin() {
  const email = process.env.SEED_SITE_ADMIN_EMAIL ?? "siteadmin@flexstore.local";
  const existing = await prisma.user.findUnique({ where: { email } });

  if (existing) {
    console.log(`Site Admin sudah ada: ${email}`);
    return;
  }

  const configured = process.env.SEED_SITE_ADMIN_PASSWORD?.trim();
  const plainPassword = configured || randomBytes(9).toString("base64url");
  const generated = !configured;

  if (!plainPassword) {
    throw new Error("Password Site Admin kosong; seed dibatalkan.");
  }

  await prisma.user.create({
    data: {
      email,
      name: process.env.SEED_SITE_ADMIN_NAME ?? "Site Admin",
      password: await bcrypt.hash(plainPassword, BCRYPT_ROUNDS),
      role: "SITE_ADMIN",
    },
  });

  console.log(`Site Admin dibuat: ${email}`);
  if (generated) {
    console.log(`Password Site Admin (acak, simpan sekarang): ${plainPassword}`);
  }
}

async function seedCatalog() {
  for (const category of CATEGORIES) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: { name: category.name },
      create: category,
    });
  }

  for (const brand of BRANDS) {
    await prisma.brand.upsert({
      where: { slug: brand.slug },
      update: { name: brand.name },
      create: brand,
    });
  }

  const categories = await prisma.category.findMany();
  const brands = await prisma.brand.findMany();
  const categoryBySlug = new Map(categories.map((c) => [c.slug, c.id]));
  const brandBySlug = new Map(brands.map((b) => [b.slug, b.id]));

  for (const product of PRODUCTS) {
    const categoryId = categoryBySlug.get(product.categorySlug);
    const brandId = product.brandSlug
      ? brandBySlug.get(product.brandSlug)
      : undefined;

    if (!categoryId || (product.brandSlug && !brandId)) {
      throw new Error(`Kategori/brand untuk ${product.slug} tidak ditemukan`);
    }

    const totalStock = product.variants.reduce((sum, v) => sum + v.stock, 0);
    const minPrice = Math.min(...product.variants.map((v) => v.price));
    const imageSeeds = product.imageSeeds ?? [];
    const images = {
      create: imageSeeds.map((seed, index) => ({
        url: imageUrl(seed, index),
        sortOrder: index,
      })),
    };
    const variants = {
      create: product.variants.map((variant) => ({
        ...variant,
        price: variant.price,
      })),
    };

    const existing = await prisma.product.findUnique({
      where: { slug: product.slug },
    });

    if (existing) {
      // Idempoten TANPA menghapus varian: `OrderItem.variantId` di-Restrict,
      // jadi deleteMany gagal (P2003) begitu ada pesanan yang menyentuh
      // varian — dan menghapusnya memang tidak diinginkan karena merusak
      // riwayat pesanan. Varian di-upsert per SKU (update bila ada, create
      // bila baru); varian lama yang tidak lagi ada di seed dibiarkan.
      // Gambar hanya di-reset kalau seed memang menyiapkan `imageSeeds` —
      // produk tanpa imageSeeds mempertahankan unggahan manual form admin.
      await prisma.product.update({
        where: { id: existing.id },
        data: {
          name: product.name,
          description: product.description,
          status: product.status,
          totalStock,
          minPrice,
          categoryId,
          brandId,
          images: product.imageSeeds?.length
            ? { deleteMany: {}, ...images }
            : undefined,
          variants: {
            upsert: product.variants.map((variant) => ({
              where: { sku: variant.sku },
              update: {
                name: variant.name,
                price: variant.price,
                stock: variant.stock,
                weightGram: variant.weightGram,
              },
              create: variant,
            })),
          },
        },
      });
      console.log(`Produk diperbarui: ${product.slug}`);
      continue;
    }

    await prisma.product.create({
      data: {
        name: product.name,
        slug: product.slug,
        description: product.description,
        status: product.status,
        totalStock,
        minPrice,
        categoryId,
        brandId,
        images: imageSeeds.length ? images : undefined,
        variants,
      },
    });
    console.log(`Produk dibuat: ${product.slug}`);
  }
}

async function main() {
  await seedAdmin();
  await seedSiteAdmin();
  await seedCatalog();
  console.log("Seed selesai.");
}

main()
  .catch((error) => {
    console.error("Seed gagal:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
