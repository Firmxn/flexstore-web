import { z } from "zod";
import { isControlCharFree } from "@/lib/utils/validation";

export const shippingCalculateSchema = z.object({
  // Opsional: kalau API ongkir belum dikonfigurasi, tujuan tidak dibutuhkan
  // karena tarif flat yang dipakai.
  destinationId: z
    .string({ invalid_type_error: "Tujuan tidak valid" })
    .trim()
    .regex(/^\d{1,10}$/, "Tujuan tidak valid")
    .optional(),
  // Item terpilih di keranjang (checkbox). Kalau kosong, seluruh keranjang
  // dihitung. Kuantitas tetap diambil dari keranjang, bukan dari body.
  variantIds: z
    .array(z.string().uuid("Varian tidak valid"), {
      invalid_type_error: "Pilihan produk tidak valid",
    })
    .max(50, "Terlalu banyak produk dipilih")
    .optional(),
});

export const citySearchSchema = z.object({
  search: z
    .string({ required_error: "Kata kunci wajib diisi" })
    .trim()
    .min(3, "Ketik minimal 3 karakter")
    .max(100, "Kata kunci terlalu panjang")
    .regex(/[A-Za-z0-9]/, "Kata kunci harus mengandung huruf atau angka")
    .refine(isControlCharFree, "Kata kunci memuat karakter yang tidak diizinkan"),
});

export type ShippingCalculateInput = z.infer<typeof shippingCalculateSchema>;
export type CitySearchInput = z.infer<typeof citySearchSchema>;
