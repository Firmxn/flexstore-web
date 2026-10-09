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
  brandSlug: string;
  imageSeeds: string[];
  variants: { sku: string; name: string; price: number; stock: number }[];
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
      { sku: "KP-30S-M", name: "Size M - Hitam", price: 79000, stock: 25 },
      { sku: "KP-30S-L", name: "Size L - Hitam", price: 79000, stock: 30 },
      { sku: "KP-30S-XL", name: "Size XL - Putih", price: 84000, stock: 12 },
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
      { sku: "KF-LP-M", name: "Size M - Merah", price: 185000, stock: 10 },
      { sku: "KF-LP-L", name: "Size L - Merah", price: 185000, stock: 8 },
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
      { sku: "BL-KT-S", name: "Size S - Navy", price: 149000, stock: 15 },
      { sku: "BL-KT-M", name: "Size M - Navy", price: 149000, stock: 18 },
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
      { sku: "SN-CV-40", name: "Size 40 - Putih", price: 329000, stock: 7 },
      { sku: "SN-CV-41", name: "Size 41 - Putih", price: 329000, stock: 9 },
      { sku: "SN-CV-42", name: "Size 42 - Hitam", price: 339000, stock: 5 },
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
      { sku: "TB-BSC-BLK", name: "Hitam", price: 89000, stock: 40 },
      { sku: "TB-BSC-NVY", name: "Navy", price: 89000, stock: 22 },
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
      { sku: "TS-KNV-STD", name: "Standard - Khaki", price: 129000, stock: 0 },
    ],
  },
];

function imageUrl(seed: string, index: number) {
  return `https://picsum.photos/seed/${seed}-${index}/800/800`;
}

async function seedAdmin() {
  const email = process.env.SEED_ADMIN_EMAIL ?? "admin@flexstore.local";
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
    const brandId = brandBySlug.get(product.brandSlug);

    if (!categoryId || !brandId) {
      throw new Error(`Kategori/brand untuk ${product.slug} tidak ditemukan`);
    }

    const totalStock = product.variants.reduce((sum, v) => sum + v.stock, 0);
    const images = {
      create: product.imageSeeds.map((seed, index) => ({
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
      // Ganti gambar & variant supaya seed bersifat idempotent.
      await prisma.product.update({
        where: { id: existing.id },
        data: {
          name: product.name,
          description: product.description,
          status: product.status,
          totalStock,
          categoryId,
          brandId,
          images: { deleteMany: {}, ...images },
          variants: { deleteMany: {}, ...variants },
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
        categoryId,
        brandId,
        images,
        variants,
      },
    });
    console.log(`Produk dibuat: ${product.slug}`);
  }
}

async function main() {
  await seedAdmin();
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
