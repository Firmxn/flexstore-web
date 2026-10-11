import { z } from "zod";
import { CATEGORY_NAME_REGEX, isControlCharFree } from "@/lib/utils/validation";

// SITE-05 (PH-09). Semua input divalidasi di server sebelum menyentuh Prisma
// (OWASP A03). Kode warna dibatasi hex `#RRGGBB` supaya nilai yang disuntikkan
// sebagai variabel CSS tidak bisa berisi gaya sembarang; URL gambar dibatasi
// host Uploadthing supaya tidak ada `javascript:`/domain liar.

const HEX_MESSAGE = "Warna harus berupa kode heksadesimal #RRGGBB";
const UPLOADTHING_MESSAGE = "Gambar harus berupa URL Uploadthing yang valid";

const optionalText = (max: number, label: string) =>
  z
    .string({ invalid_type_error: `${label} tidak valid` })
    .trim()
    .max(max, `${label} maksimal ${max} karakter`)
    .refine(isControlCharFree, `${label} memuat karakter yang tidak diizinkan`)
    .optional()
    .transform((value) => (value ? value : undefined));

const optionalHex = z
  .union([
    z.literal(""),
    z
      .string({ invalid_type_error: HEX_MESSAGE })
      .regex(/^#[0-9A-Fa-f]{6}$/, HEX_MESSAGE),
  ])
  .optional()
  .transform((value) => (value ? value.toUpperCase() : undefined));

const optionalUploadthingUrl = z
  .union([
    z.literal(""),
    z
      .string({ invalid_type_error: UPLOADTHING_MESSAGE })
      .regex(
        /^https:\/\/(?:utfs\.io|[a-z0-9-]+\.ufs\.sh)\/\S*$/i,
        UPLOADTHING_MESSAGE,
      ),
  ])
  .optional()
  .transform((value) => (value ? value : undefined));

// Tautan tombol: path internal (diawali satu `/`, bukan `//`) atau URL https.
const optionalHref = z
  .union([
    z.literal(""),
    z
      .string({ invalid_type_error: "Tautan tombol tidak valid" })
      .regex(
        /^\/(?!\/)\S*$/,
        "Tautan tombol harus path internal (diawali /) atau URL https",
      ),
    z
      .string()
      .regex(
        /^https:\/\/\S+$/i,
        "Tautan tombol harus path internal (diawali /) atau URL https",
      ),
  ])
  .optional()
  .transform((value) => (value ? value : undefined));

export const brandSettingsSchema = z.object({
  brandName: z
    .string({
      required_error: "Nama brand wajib diisi",
      invalid_type_error: "Nama brand tidak valid",
    })
    .trim()
    .min(1, "Nama brand wajib diisi")
    .max(50, "Nama brand maksimal 50 karakter")
    .regex(CATEGORY_NAME_REGEX, "Nama brand memuat karakter yang tidak diizinkan")
    .regex(/[A-Za-z]/, "Nama brand harus mengandung huruf"),
  tagline: optionalText(160, "Tagline"),
  logoUrl: optionalUploadthingUrl,
  faviconUrl: optionalUploadthingUrl,
  footerText: optionalText(300, "Teks footer"),

  // Palet warna (9 grup inti / 15 slot).
  primaryColor: optionalHex,
  primaryFg: optionalHex,
  secondaryColor: optionalHex,
  secondaryFg: optionalHex,
  accentColor: optionalHex,
  accentFg: optionalHex,
  backgroundColor: optionalHex,
  foregroundColor: optionalHex,
  mutedColor: optionalHex,
  mutedFg: optionalHex,
  borderColor: optionalHex,
  destructiveColor: optionalHex,
  destructiveFg: optionalHex,
  successColor: optionalHex,
  successFg: optionalHex,

  // Banner homepage.
  bannerEnabled: z.boolean({
    invalid_type_error: "Status banner tidak valid",
  }),
  bannerImageUrl: optionalUploadthingUrl,
  bannerTitle: optionalText(80, "Judul banner"),
  bannerText: optionalText(200, "Teks banner"),
  bannerButtonLabel: optionalText(40, "Label tombol"),
  bannerButtonHref: optionalHref,
});

export type BrandSettingsInput = z.infer<typeof brandSettingsSchema>;
