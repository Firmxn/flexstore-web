import { z } from "zod";

// Pesan error selalu berbahasa Indonesia, termasuk saat field tidak dikirim
// (Zod default-nya "Required" / "Expected string, received ...").
const requiredString = (message: string) =>
  z.string({ required_error: message, invalid_type_error: message });

export const slugSchema = requiredString("Slug wajib diisi")
  .trim()
  .toLowerCase()
  .min(1, "Slug wajib diisi")
  .max(200, "Slug maksimal 200 karakter")
  .regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    "Slug hanya boleh huruf kecil, angka, dan tanda hubung",
  );

export const categorySchema = z.object({
  name: requiredString("Nama kategori wajib diisi")
    .trim()
    .min(1, "Nama kategori wajib diisi")
    .max(100, "Nama maksimal 100 karakter"),
  slug: slugSchema,
});

export const categoryUpdateSchema = categorySchema.partial();

export type CategoryInput = z.infer<typeof categorySchema>;
