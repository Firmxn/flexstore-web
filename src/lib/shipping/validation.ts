import { z } from "zod";

export const shippingCalculateSchema = z.object({
  // Opsional: kalau API ongkir belum dikonfigurasi, tujuan tidak dibutuhkan
  // karena tarif flat yang dipakai.
  destinationId: z
    .string({ invalid_type_error: "Tujuan tidak valid" })
    .trim()
    .regex(/^\d{1,10}$/, "Tujuan tidak valid")
    .optional(),
});

export const citySearchSchema = z.object({
  search: z
    .string({ required_error: "Kata kunci wajib diisi" })
    .trim()
    .min(3, "Ketik minimal 3 karakter")
    .max(100, "Kata kunci terlalu panjang"),
});

export type ShippingCalculateInput = z.infer<typeof shippingCalculateSchema>;
export type CitySearchInput = z.infer<typeof citySearchSchema>;
