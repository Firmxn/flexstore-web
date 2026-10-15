import { z } from "zod";
import { slugSchema } from "@/lib/categories/validation";
import {
  PRODUCT_NAME_REGEX,
  SKU_REGEX,
  isControlCharFree,
} from "@/lib/utils/validation";

export const PRODUCT_STATUSES = [
  "ACTIVE",
  "INACTIVE",
  "DRAFT",
  "OUT_OF_STOCK",
  "DISCONTINUED",
] as const;

export const MAX_PRODUCT_IMAGES = 4;

// PROD-07: batas seksi editorial.
export const MAX_STORY_TEXT = 2000;
export const MAX_STORY_IMAGES = 1;
export const MAX_LOOKBOOK_IMAGES = 4;

export const productImageSchema = z.object({
  url: z
    .string({
      required_error: "URL gambar wajib diisi",
      invalid_type_error: "URL gambar tidak valid",
    })
    .trim()
    .url("URL gambar tidak valid"),
  sortOrder: z.number().int().min(0).optional(),
});

export const productVariantSchema = z.object({
  sku: z
    .string({ required_error: "SKU wajib diisi", invalid_type_error: "SKU wajib diisi" })
    .trim()
    .min(1, "SKU wajib diisi")
    .max(64, "SKU maksimal 64 karakter")
    .regex(SKU_REGEX, "SKU hanya boleh huruf, angka, titik, minus, dan garis bawah"),
  name: z
    .string({
      required_error: "Nama variant wajib diisi",
      invalid_type_error: "Nama variant wajib diisi",
    })
    .trim()
    .min(1, "Nama variant wajib diisi")
    .max(200, "Nama variant maksimal 200 karakter")
    .regex(PRODUCT_NAME_REGEX, "Nama variant memuat karakter yang tidak diizinkan")
    .regex(/[A-Za-z0-9]/, "Nama variant harus mengandung huruf atau angka"),
  price: z
    .number({ invalid_type_error: "Harga harus berupa angka" })
    .positive("Harga harus lebih dari 0")
    .max(99999999.99, "Harga terlalu besar"),
  stock: z
    .number({ invalid_type_error: "Stok harus berupa angka" })
    .int("Stok harus bilangan bulat")
    .min(0, "Stok tidak boleh negatif"),
  // Berat aktual varian (gram). Dipakai server untuk ongkir; tidak pernah
  // diambil dari input customer.
  weightGram: z
    .number({ invalid_type_error: "Berat harus berupa angka" })
    .int("Berat harus bilangan bulat")
    .min(1, "Berat minimal 1 gram")
    .max(1000000, "Berat maksimal 1.000.000 gram"),
  imageUrl: z.string().trim().url("URL gambar tidak valid").optional().nullable(),
});

export const productSchema = z.object({
  name: z
    .string({
      required_error: "Nama produk wajib diisi",
      invalid_type_error: "Nama produk wajib diisi",
    })
    .trim()
    .min(1, "Nama produk wajib diisi")
    .max(200, "Nama maksimal 200 karakter")
    .regex(PRODUCT_NAME_REGEX, "Nama produk memuat karakter yang tidak diizinkan")
    .regex(/[A-Za-z0-9]/, "Nama produk harus mengandung huruf atau angka"),
  slug: slugSchema,
  description: z
    .string()
    .trim()
    .max(5000, "Deskripsi maksimal 5000 karakter")
    .refine(isControlCharFree, "Deskripsi memuat karakter yang tidak diizinkan")
    .optional()
    .or(z.literal("")),
  categoryId: z
    .string({
      required_error: "Kategori tidak valid",
      invalid_type_error: "Kategori tidak valid",
    })
    .uuid("Kategori tidak valid"),
  brandId: z
    .string()
    .uuid("Brand tidak valid")
    .optional()
    .nullable()
    .or(z.literal("")),
  status: z.enum(PRODUCT_STATUSES, {
    errorMap: () => ({ message: "Status tidak valid" }),
  }),
  images: z
    .array(productImageSchema, { required_error: "Minimal 1 gambar" })
    .min(1, "Minimal 1 gambar")
    .max(MAX_PRODUCT_IMAGES, `Maksimal ${MAX_PRODUCT_IMAGES} gambar`),
  // Bagan ukuran (PRD 3.1.A/7.4): satu gambar opsional dengan peran khusus.
  sizeChartUrl: z
    .union([
      z.string().trim().url("URL bagan ukuran tidak valid").max(500),
      z.literal(""),
    ])
    .optional()
    .transform((value) => (value ? value : undefined)),
  // PROD-07 — tiga isian editorial opsional; semuanya tidak pernah memblok simpan.
  videoHeroUrl: z
    .union([
      z.string().trim().url("URL video tidak valid").max(500),
      z.literal(""),
    ])
    .optional()
    .transform((value) => (value ? value : undefined)),
  videoHeroAutoplay: z.boolean().optional().default(true),
  storyText: z
    .string()
    .trim()
    .max(MAX_STORY_TEXT, "Narasi maksimal 2000 karakter")
    .refine(isControlCharFree, "Narasi memuat karakter yang tidak diizinkan")
    .optional()
    .or(z.literal("")),
  storyImageUrl: z
    .union([
      z.string().trim().url("URL gambar narasi tidak valid").max(500),
      z.literal(""),
    ])
    .optional()
    .transform((value) => (value ? value : undefined)),
  lookbookUrls: z
    .array(
      z
        .string({ invalid_type_error: "URL foto lookbook tidak valid" })
        .trim()
        .url("URL foto lookbook tidak valid")
        .max(500),
      { invalid_type_error: "Foto lookbook tidak valid" },
    )
    .max(MAX_LOOKBOOK_IMAGES, `Maksimal ${MAX_LOOKBOOK_IMAGES} foto lookbook`)
    .optional(),
  variants: z
    .array(productVariantSchema, { required_error: "Minimal 1 variant" })
    .min(1, "Minimal 1 variant"),
});

export const productListQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  status: z.enum(PRODUCT_STATUSES).optional(),
  search: z
    .string()
    .trim()
    .max(200)
    .refine(isControlCharFree, "Kata kunci tidak valid")
    .optional(),
});

// Urutan katalog storefront (PRD 3.1.A: filter by name, category, price range, sort).
// `newest` adalah default; nilai lain dipakai untuk mengurutkan daftar produk.
export const PRODUCT_SORT_OPTIONS = [
  "newest",
  "price-asc",
  "price-desc",
  "name-asc",
] as const;

export type ProductSort = (typeof PRODUCT_SORT_OPTIONS)[number];

// Batas atas filter harga, selaras dengan batas harga varian (productVariantSchema).
export const MAX_PRICE_FILTER = 100_000_000;

// Filter katalog dibaca dari query string, jadi setiap field dibuat toleran:
// nilai rusak jatuh ke default, bukan menggagalkan seluruh permintaan.
export const catalogFilterSchema = z.object({
  search: z
    .string()
    .trim()
    .max(200)
    .refine(isControlCharFree, "Kata kunci tidak valid")
    .optional()
    .catch(undefined),
  category: z.string().trim().max(200).optional().catch(undefined),
  minPrice: z.coerce
    .number()
    .int()
    .min(0)
    .max(MAX_PRICE_FILTER)
    .optional()
    .catch(undefined),
  maxPrice: z.coerce
    .number()
    .int()
    .min(0)
    .max(MAX_PRICE_FILTER)
    .optional()
    .catch(undefined),
  sort: z.enum(PRODUCT_SORT_OPTIONS).catch("newest"),
});

export type ProductInput = z.infer<typeof productSchema>;
export type ProductListQuery = z.infer<typeof productListQuerySchema>;
export type CatalogFilter = z.infer<typeof catalogFilterSchema>;
