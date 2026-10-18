// SITE-05 (PH-09): data palet warna yang dipakai bersama server dan client.
// Modul ini sengaja bebas Prisma/Next agar aman diimpor Client Component.

export type BrandPalette = {
  primaryColor: string | null;
  primaryFg: string | null;
  secondaryColor: string | null;
  secondaryFg: string | null;
  accentColor: string | null;
  accentFg: string | null;
  backgroundColor: string | null;
  foregroundColor: string | null;
  mutedColor: string | null;
  mutedFg: string | null;
  borderColor: string | null;
  destructiveColor: string | null;
  destructiveFg: string | null;
  successColor: string | null;
  successFg: string | null;
  warningColor: string | null;
  warningFg: string | null;
  infoColor: string | null;
  infoFg: string | null;
};

export type PaletteKey = keyof BrandPalette;

// Pemetaan slot palet ke variabel CSS di globals.css. Token sekunder (card,
// popover, input, ring) sengaja tidak termasuk.
export const PALETTE_FIELDS: {
  key: PaletteKey;
  label: string;
  cssVar: string;
}[] = [
  { key: "primaryColor", label: "Primary", cssVar: "--primary" },
  { key: "primaryFg", label: "Primary (teks)", cssVar: "--primary-foreground" },
  { key: "secondaryColor", label: "Secondary", cssVar: "--secondary" },
  {
    key: "secondaryFg",
    label: "Secondary (teks)",
    cssVar: "--secondary-foreground",
  },
  { key: "accentColor", label: "Accent", cssVar: "--accent" },
  { key: "accentFg", label: "Accent (teks)", cssVar: "--accent-foreground" },
  { key: "backgroundColor", label: "Background", cssVar: "--background" },
  { key: "foregroundColor", label: "Foreground", cssVar: "--foreground" },
  { key: "mutedColor", label: "Muted", cssVar: "--muted" },
  { key: "mutedFg", label: "Muted (teks)", cssVar: "--muted-foreground" },
  { key: "borderColor", label: "Border", cssVar: "--border" },
  { key: "destructiveColor", label: "Destructive", cssVar: "--destructive" },
  {
    key: "destructiveFg",
    label: "Destructive (teks)",
    cssVar: "--destructive-foreground",
  },
  { key: "successColor", label: "Success", cssVar: "--success" },
  { key: "successFg", label: "Success (teks)", cssVar: "--success-foreground" },
  // SITE-07 (PW, keputusan pengguna 2026-10-18: "kalo untuk warna success atau
  // danger biasanya bisa dikustom maka dua itu harusnya bisa juga"; dilanjutkan
  // "success dan destructive punya warna untuk text, harusnya warning dan info
  // juga"): warning/info diangkat dari token CSS mandiri menjadi slot palet
  // (19 slot) lengkap dengan pasangan foreground-nya, mengikuti pola
  // destructive/success.
  { key: "warningColor", label: "Warning", cssVar: "--warning" },
  { key: "warningFg", label: "Warning (teks)", cssVar: "--warning-foreground" },
  { key: "infoColor", label: "Info", cssVar: "--info" },
  { key: "infoFg", label: "Info (teks)", cssVar: "--info-foreground" },
];

// SITE-07 (PW, keputusan pengguna 2026-10-18): penjelasan per-slot untuk
// popover petunjuk di form kustomisasi brand (BrandSettingsForm), mengikuti
// pola popover "Ketentuan SKU" di ProductForm. Bahasa modelnya awam (revisi
// 2026-10-18: "status pada popover juga pakai bahasa user awam, jangan
// penulisan untuk developer") - tidak menyebut kode status/kolom database.
export const PALETTE_INFO: Record<PaletteKey, string> = {
  primaryColor:
    "Warna utama toko: tombol utama (misal tombol Beli), tautan yang bisa diklik, dan aksen di bagian atas halaman.",
  primaryFg: "Warna tulisan dan ikon di atas warna utama.",
  secondaryColor:
    "Warna kedua: tombol pendamping dan latar kotak info biasa, misal tanda stok masih ada.",
  secondaryFg: "Warna tulisan di atas warna kedua.",
  accentColor:
    "Warna aksen: menu yang tersentuh kursor dan penanda baris yang sedang dipilih.",
  accentFg: "Warna tulisan di atas warna aksen.",
  backgroundColor: "Warna latar belakang seluruh halaman.",
  foregroundColor: "Warna tulisan utama di seluruh halaman.",
  mutedColor:
    "Latar abu lembut: kepala tabel, kotak info, dan bagian sekunder halaman.",
  mutedFg:
    "Tulisan redup: keterangan kecil di bawah judul, harga, atau kotak isian.",
  borderColor: "Garis pembatas kartu, kotak isian, dan pemisah antar bagian.",
  destructiveColor:
    "Warna merah untuk tombol Hapus, Batalkan Pesanan yang ditolak, status pesanan batal, dan ikon hati produk favorit.",
  destructiveFg: "Warna tulisan di atas warna merah.",
  successColor:
    "Warna hijau untuk status pesanan selesai dan tanda bahwa aksi berhasil.",
  successFg: "Warna tulisan di atas warna hijau.",
  warningColor:
    "Kuning untuk pesanan yang masih menunggu, misal belum dibayar atau sedang diminta dibatalkan, juga untuk pengumuman toko sedang diperbaiki dan pengingat form tanpa akun.",
  warningFg: "Warna tulisan di atas warna kuning.",
  infoColor:
    "Biru untuk pesanan yang sedang diproses atau sedang dikirim, dan tombol Lacak Pesanan.",
  infoFg: "Warna tulisan di atas warna biru.",
};

export const EMPTY_PALETTE: BrandPalette = {
  primaryColor: null,
  primaryFg: null,
  secondaryColor: null,
  secondaryFg: null,
  accentColor: null,
  accentFg: null,
  backgroundColor: null,
  foregroundColor: null,
  mutedColor: null,
  mutedFg: null,
  borderColor: null,
  destructiveColor: null,
  destructiveFg: null,
  successColor: null,
  successFg: null,
  warningColor: null,
  warningFg: null,
  infoColor: null,
  infoFg: null,
};

// SITE-07 (PH-11, TASK-123): nilai bawaan setiap slot palet, ditampilkan di
// form kustomisasi brand ketika slot belum diatur (DB tetap menyimpan null =
// pakai bawaan; konstanta ini tidak pernah disimpan ke DB). Sumber nilai:
// netral ber-tone hijau dari `DASHBOARD_GREEN_DEFAULTS`
// (src/lib/admin/dashboard-tokens.ts) untuk slot yang tersedia di sana, dan
// konversi OKLCH -> sRGB hex dari token bawaan globals.css untuk slot sisanya
// (secondary, destructive, success). Nilai `#E7000B` setara red-600 Tailwind
// v4 dan `#009966` konversi hex dari oklch success bawaan. Semua slot WAJIB
// terisi (type Record, bukan BrandPalette yang nullable) supaya pemakainya
// tidak perlu menangani null.
export const DEFAULT_PALETTE: Record<PaletteKey, string> = {
  primaryColor: "#36745B",
  primaryFg: "#FFFFFF",
  secondaryColor: "#F5F5F5",
  secondaryFg: "#171717",
  accentColor: "#EDF4EF",
  accentFg: "#202725",
  backgroundColor: "#FCFCFD",
  foregroundColor: "#202725",
  mutedColor: "#F3F4F4",
  mutedFg: "#77807B",
  borderColor: "#E7EAE8",
  destructiveColor: "#E7000B",
  destructiveFg: "#FFFFFF",
  successColor: "#009966",
  successFg: "#FFFFFF",
  // Kuning terang pilihan pengguna 2026-10-18 (kandidat G: "#FACC15 - kuning
  // paling terang" dari halaman perbandingan visual yang ditunjukkan ke
  // pengguna) setelah dua penolakan warna sebelumnya (amber-700 "coklat",
  // yellow-700 "masih coklat"). Kontras FACC15 sebagai teks hanya 1.49:1,
  // sehingga teks badge/banner memakai varian gelap otomatis `--warning-strong`
  // (color-mix dari token ini, lihat globals.css). Info tetap blue-700.
  warningColor: "#FACC15",
  // Latar kuning ini sangat terang, jadi teks di atas versi solid-nya gelap
  // (kontras tinggi), berbeda dari pola fg putih destructive/success yang
  // warna dasarnya gelap. Belum ada pemakai solid saat ini.
  warningFg: "#202725",
  infoColor: "#1447E6",
  infoFg: "#FFFFFF",
};

// Variabel CSS yang menimpa `:root` di globals.css. Slot terisi memakai
// kustomisasi admin; slot kosong memakai `DEFAULT_PALETTE` sehingga warna yang
// tampil di form = warna yang benar-benar dirender aplikasi (SITE-07; sebelum
// itu slot kosong jatuh ke oklch gelap `:root`, yang membuat "bawaan" form
// tidak sama dengan render). Konsekuensi: `<html>` selalu memuat inline style
// seluruh slot — kelak SITE-06 (mode gelap) harus membaca ulang interplay
// ini karena inline style menimpa aturan `.dark`.
export function brandCssVariables(
  palette: BrandPalette,
): Record<string, string> {
  const variables: Record<string, string> = {};
  for (const field of PALETTE_FIELDS) {
    const custom = palette[field.key]?.trim();
    variables[field.cssVar] = custom || DEFAULT_PALETTE[field.key];
  }
  return variables;
}
