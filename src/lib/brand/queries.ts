import { cacheTag } from "next/cache";
import type { BrandSetting } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";
import { siteDescription } from "@/lib/site";
import { EMPTY_PALETTE, type BrandPalette } from "./palette";

// SITE-05 (PH-09): identitas brand per deployment. Disimpan sebagai satu baris
// tetap `id = "default"` (pola StoreSetting/PlatformSetting).
//
// Pembacaan memakai `use cache` + tag `brand-settings`: nilai boleh diprerender
// (shell PPR tetap statis), tetapi simpan dari /site-admin/brand memanggil
// `revalidateTag` sehingga tampilan seluruh rute ikut berubah tanpa rebuild.
// `use cache` juga menggantikan dedupe React `cache()` (satu query per
// permintaan walau dipanggil Header, Footer, layout, dan email sekaligus).

export const BRAND_SETTINGS_ID = "default";
export const BRAND_CACHE_TAG = "brand-settings";

export type BrandBanner = {
  enabled: boolean;
  imageUrl: string | null;
  title: string | null;
  text: string | null;
  buttonLabel: string | null;
  buttonHref: string | null;
};

export type Brand = {
  brandName: string;
  // `null` berarti belum diatur; tampilan memakai `brandTagline()`.
  tagline: string | null;
  logoUrl: string | null;
  faviconUrl: string | null;
  footerText: string | null;
  palette: BrandPalette;
  banner: BrandBanner;
};

// Bawaan hero homepage (dipakai saat banner mati atau kolomnya kosong).
export const DEFAULT_BANNER_TEXT =
  "Belanja produk pilihan dengan pengiriman ke seluruh Indonesia.";
export const DEFAULT_BANNER_BUTTON_LABEL = "Lihat Semua Produk";
export const DEFAULT_BANNER_BUTTON_HREF = "/products";

export function defaultBannerTitle(brandName: string): string {
  return `Selamat datang di ${brandName}`;
}

// Tagline tampilan: nilai Site Admin bila ada, jika tidak deskripsi bawaan.
export function brandTagline(brand: Brand): string {
  return brand.tagline ?? siteDescription;
}

export const DEFAULT_BRAND: Brand = {
  brandName: "FlexStore",
  tagline: null,
  logoUrl: null,
  faviconUrl: null,
  footerText: null,
  palette: EMPTY_PALETTE,
  banner: {
    enabled: false,
    imageUrl: null,
    title: null,
    text: null,
    buttonLabel: null,
    buttonHref: null,
  },
};

function toBrand(row: BrandSetting): Brand {
  return {
    brandName: row.brandName,
    tagline: row.tagline,
    logoUrl: row.logoUrl,
    faviconUrl: row.faviconUrl,
    footerText: row.footerText,
    palette: {
      primaryColor: row.primaryColor,
      primaryFg: row.primaryFg,
      secondaryColor: row.secondaryColor,
      secondaryFg: row.secondaryFg,
      accentColor: row.accentColor,
      accentFg: row.accentFg,
      backgroundColor: row.backgroundColor,
      foregroundColor: row.foregroundColor,
      mutedColor: row.mutedColor,
      mutedFg: row.mutedFg,
      borderColor: row.borderColor,
      destructiveColor: row.destructiveColor,
      destructiveFg: row.destructiveFg,
      successColor: row.successColor,
      successFg: row.successFg,
    },
    banner: {
      enabled: row.bannerEnabled,
      imageUrl: row.bannerImageUrl,
      title: row.bannerTitle,
      text: row.bannerText,
      buttonLabel: row.bannerButtonLabel,
      buttonHref: row.bannerButtonHref,
    },
  };
}

// Pembacaan tanpa cache, dipakai penulisan supaya respons PATCH memakai nilai
// yang baru saja ditulis (bukan nilai dari `use cache`).
export async function readBrandSetting(): Promise<Brand> {
  try {
    const row = await prisma.brandSetting.findUnique({
      where: { id: BRAND_SETTINGS_ID },
    });
    return row ? toBrand(row) : DEFAULT_BRAND;
  } catch (error) {
    // Database tidak terjangkau tidak boleh mematikan storefront (SDD 9:
    // degrade gracefully). Diperlakukan seperti baris belum ada.
    console.error("[brand] gagal membaca identitas brand", error);
    return DEFAULT_BRAND;
  }
}

export async function getBrandSetting(): Promise<Brand> {
  "use cache";
  // Tag dipakai `updateBrandSettings` untuk membatalkan cache setelah simpan.
  cacheTag(BRAND_CACHE_TAG);
  return readBrandSetting();
}
