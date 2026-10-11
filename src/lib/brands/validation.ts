import { z } from "zod";
import { slugSchema } from "@/lib/categories/validation";
import { CATEGORY_NAME_REGEX } from "@/lib/utils/validation";

export const brandSchema = z.object({
  name: z
    .string({
      required_error: "Nama brand wajib diisi",
      invalid_type_error: "Nama brand wajib diisi",
    })
    .trim()
    .min(1, "Nama brand wajib diisi")
    .max(100, "Nama maksimal 100 karakter")
    .regex(CATEGORY_NAME_REGEX, "Nama brand memuat karakter yang tidak diizinkan")
    .regex(/[A-Za-z]/, "Nama brand harus mengandung huruf"),
  slug: slugSchema,
});

export const brandUpdateSchema = brandSchema.partial();

export type BrandInput = z.infer<typeof brandSchema>;
