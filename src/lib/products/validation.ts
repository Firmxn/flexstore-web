import { z } from "zod";
import { slugSchema } from "@/lib/categories/validation";

export const PRODUCT_STATUSES = [
  "ACTIVE",
  "INACTIVE",
  "DRAFT",
  "OUT_OF_STOCK",
  "DISCONTINUED",
] as const;

export const MAX_PRODUCT_IMAGES = 4;

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
    .max(64, "SKU maksimal 64 karakter"),
  name: z
    .string({
      required_error: "Nama variant wajib diisi",
      invalid_type_error: "Nama variant wajib diisi",
    })
    .trim()
    .min(1, "Nama variant wajib diisi")
    .max(200, "Nama variant maksimal 200 karakter"),
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
    .max(200, "Nama maksimal 200 karakter"),
  slug: slugSchema,
  description: z
    .string()
    .trim()
    .max(5000, "Deskripsi maksimal 5000 karakter")
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
  variants: z
    .array(productVariantSchema, { required_error: "Minimal 1 variant" })
    .min(1, "Minimal 1 variant"),
});

export const productListQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  status: z.enum(PRODUCT_STATUSES).optional(),
  search: z.string().trim().max(200).optional(),
});

export type ProductInput = z.infer<typeof productSchema>;
export type ProductListQuery = z.infer<typeof productListQuerySchema>;
