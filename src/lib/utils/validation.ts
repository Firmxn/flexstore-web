import { z } from "zod";

// Aturan karakter bersama untuk semua input aplikasi (OWASP A03: validasi
// server-side sebelum menyentuh Prisma). Prinsipnya: karakter yang tidak wajar
// untuk jenis field-nya DITOLAK dengan pesan jelas, bukan diam-diam dibuang
// (perilaku lama nomor HP yang membuang abjad lalu tetap lolos). Pembersihan
// hanya dilakukan untuk pemisah yang memang lazim (spasi, strip, titik,
// kurung, plus di awal nomor).

// ---------------------------------------------------------------------------
// Nomor HP
// ---------------------------------------------------------------------------

// Karakter yang boleh diketik: angka + pemisah lazim. Abjad dan simbol lain
// ditolak sebelum normalisasi, jadi "0812abc345" tidak lagi lolos sebagai
// "+62812345".
export const PHONE_CHARS_REGEX = /^[\d+()\-. ]+$/;

// Normalisasi ke format +62 (pasar utama Indonesia). Pemisah dibuang, tanda
// "+" hanya dipertahankan kalau memang di awal nomor.
export function normalizePhone(input: string): string {
  const cleaned = input.trim().replace(/[\s().\-]/g, "");
  const hasPlus = cleaned.startsWith("+");
  const digits = cleaned.replace(/[^\d]/g, "");

  if (hasPlus) return `+${digits}`;
  if (digits.startsWith("62")) return `+${digits}`;
  if (digits.startsWith("0")) return `+62${digits.slice(1)}`;

  return `+62${digits}`;
}

// Nomor HP Indonesia: +62 diikuti 8-11 angka (total 10-13 angka). Rencana
// internasional (E.164) dicatat di PRD 7.8; saat dibuka, cukup longgarkan
// refine terakhir dan izinkan "+" apa adanya.
export const phoneSchema = z
  .string({
    required_error: "Nomor HP wajib diisi",
    invalid_type_error: "Nomor HP tidak valid",
  })
  .trim()
  .min(1, "Nomor HP wajib diisi")
  .max(20, "Nomor HP maksimal 20 karakter")
  .regex(PHONE_CHARS_REGEX, "Nomor HP hanya boleh berisi angka")
  .transform(normalizePhone)
  .refine((value) => /^\+62\d{8,11}$/.test(value), {
    message: "Nomor HP tidak valid",
  });

// Filter untuk input di sisi klien: karakter yang tidak diizinkan dibuang saat
// mengetik, jadi abjad tidak pernah masuk ke state form. Server tetap menolak
// (regex di atas) sebagai pertahanan utama (OWASP A03).
export const PHONE_INPUT_FILTER = /[^\d+()\-. ]/g;
export const POSTAL_CODE_INPUT_FILTER = /[^\d]/g;
export const OTP_CODE_INPUT_FILTER = /[^\d]/g;

// ---------------------------------------------------------------------------
// Nama orang
// ---------------------------------------------------------------------------

// Dipakai registrasi (AUTH-02), ubah profil (CUST-03), nama penerima alamat
// (CUST-01), dan alamat pengiriman checkout (ORDER-01). Angka tidak wajar untuk
// nama orang ("12345", "0812xxxx") — ditolak, bukan di-minim-kan.
export const PERSON_NAME_REGEX = /^[A-Za-z\u00C0-\u024F' .-]+$/;

export const personNameSchema = z
  .string({
    required_error: "Nama wajib diisi",
    invalid_type_error: "Nama wajib diisi",
  })
  .trim()
  .min(1, "Nama wajib diisi")
  .max(100, "Nama maksimal 100 karakter")
  .regex(PERSON_NAME_REGEX, "Nama hanya boleh berisi huruf")
  .regex(/[A-Za-z\u00C0-\u024F]/, "Nama harus mengandung huruf");

// ---------------------------------------------------------------------------
// Wilayah (provinsi/kota/kecamatan/kelurahan) — dari RajaOngkir, tapi tetap
// divalidasi karena klien bisa mengirim apa saja.
// ---------------------------------------------------------------------------

export const REGION_NAME_REGEX = /^[A-Za-z\u00C0-\u024F' .()/,-]+$/;

// Factory karena label field berbeda (Provinsi/Kota/Kecamatan/Kelurahan) dan
// pesan error harus menyebut nama field yang diketik pengguna.
export function regionNameSchema(label: string) {
  return z
    .string({
      required_error: `${label} wajib diisi`,
      invalid_type_error: `${label} tidak valid`,
    })
    .trim()
    .min(1, `${label} wajib diisi`)
    .max(100, `${label} maksimal 100 karakter`)
    .regex(REGION_NAME_REGEX, `${label} hanya boleh berisi huruf`)
    .regex(/[A-Za-z\u00C0-\u024F]/, `${label} harus mengandung huruf`);
}

export function optionalRegionNameSchema(label: string) {
  return z
    .union([z.literal(""), regionNameSchema(label)])
    .optional()
    .transform((value) => (value ? value : undefined));
}

// Kode pos Indonesia selalu 5 angka.
export const POSTAL_CODE_REGEX = /^\d{5}$/;

export function postalCodeSchema(label = "Kode pos") {
  return z
    .union([
      z.literal(""),
      z
        .string({ invalid_type_error: `${label} tidak valid` })
        .trim()
        .regex(POSTAL_CODE_REGEX, `${label} harus 5 angka`),
    ])
    .optional()
    .transform((value) => (value ? value : undefined));
}

// ---------------------------------------------------------------------------
// Alamat
// ---------------------------------------------------------------------------

// Label alamat ("Rumah", "Kantor 2"): huruf/angka + pemisah lazim.
export const ADDRESS_LABEL_REGEX = /^[A-Za-z0-9\u00C0-\u024F' ./,-]+$/;

// Alamat lengkap: huruf/angka + pemisah lazim (koma, titik, garis miring,
// kurung, pagar, strip) + baris baru untuk alamat multi-baris.
export const STREET_REGEX = /^[A-Za-z0-9\u00C0-\u024F' ./,\n()#&:-]+$/;

// ---------------------------------------------------------------------------
// Kode
// ---------------------------------------------------------------------------

// SKU varian: huruf/angka + titik, strip, garis bawah.
export const SKU_REGEX = /^[A-Za-z0-9._-]+$/;

// Kode kurir RajaOngkir ("jne", "sicepat", "jnt").
export const COURIER_CODE_REGEX = /^[A-Za-z0-9._-]+$/;

// Nama layanan kurir dari RajaOngkir ("REG", "OK", "JTR>250"). Beberapa layanan
// memakai tanda < > +, jadi karakter itu ikut diizinkan.
export const COURIER_SERVICE_REGEX = /^[A-Za-z0-9 ._\-<>+=()]+$/;

// Kode voucher: sama dengan aturan pembuatan voucher (VOUCHER-01).
export const VOUCHER_CODE_REGEX = /^[A-Za-z0-9_-]+$/;

// ---------------------------------------------------------------------------
// Nama barang/kategori/brand
// ---------------------------------------------------------------------------

// Nama produk dan varian boleh memuat angka ("Kaos Polos 30s", "100% Cotton"),
// jadi yang diperketat adalah tanda baca liar dan karakter kontrol.
export const PRODUCT_NAME_REGEX = /^[A-Za-z0-9\u00C0-\u024F&.,'()+\-/%:! ]+$/;

// Nama kategori/brand: huruf/angka + tanda baca umum, tanpa tanda persen/seru.
export const CATEGORY_NAME_REGEX = /^[A-Za-z0-9\u00C0-\u024F&.,'()\- ]+$/;

// ---------------------------------------------------------------------------
// Teks lain
// ---------------------------------------------------------------------------

// Telepon toko bisa nomor rumah/kantor ("021-1234567") maupun HP, jadi dipakai
// aturan yang lebih longgar dari phoneSchema: angka + pemisah, minimal 7 angka.
export const CONTACT_PHONE_REGEX = /^[\d+()\-. ]+$/;

// Akun media sosial: handle ("@flexstore.id") atau URL.
export const SOCIAL_HANDLE_REGEX = /^[@A-Za-z0-9._\-/:]+$/;

// Karakter kontrol tidak pernah berguna di input teks dan hanya menambah noise
// (termasuk pada data yang nanti dikirim ke provider pembayaran/pengiriman).
export const CONTROL_CHARS_REGEX = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/;

// Teks bebas (catatan, deskripsi, tagline, kebijakan): selain karakter kontrol,
// isinya dibebaskan karena memang kalimat manusia.
export function isControlCharFree(value: string): boolean {
  return !CONTROL_CHARS_REGEX.test(value);
}
