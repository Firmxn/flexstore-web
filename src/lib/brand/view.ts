import type { Brand } from "./queries";
import type { PaletteKey } from "./palette";

// SITE-05 (PH-09): bentuk nilai form. Semua slot string dengan `""` berarti
// belum diatur, supaya input terkendali dan status "pakai bawaan" tetap jelas.

export type BrandFormValues = Record<PaletteKey, string> & {
  brandName: string;
  tagline: string;
  logoUrl: string;
  faviconUrl: string;
  footerText: string;
  bannerEnabled: boolean;
  bannerImageUrl: string;
  bannerTitle: string;
  bannerText: string;
  bannerButtonLabel: string;
  bannerButtonHref: string;
};

export function toBrandFormValues(brand: Brand): BrandFormValues {
  return {
    brandName: brand.brandName,
    tagline: brand.tagline ?? "",
    logoUrl: brand.logoUrl ?? "",
    faviconUrl: brand.faviconUrl ?? "",
    footerText: brand.footerText ?? "",
    primaryColor: brand.palette.primaryColor ?? "",
    primaryFg: brand.palette.primaryFg ?? "",
    secondaryColor: brand.palette.secondaryColor ?? "",
    secondaryFg: brand.palette.secondaryFg ?? "",
    accentColor: brand.palette.accentColor ?? "",
    accentFg: brand.palette.accentFg ?? "",
    backgroundColor: brand.palette.backgroundColor ?? "",
    foregroundColor: brand.palette.foregroundColor ?? "",
    mutedColor: brand.palette.mutedColor ?? "",
    mutedFg: brand.palette.mutedFg ?? "",
    borderColor: brand.palette.borderColor ?? "",
    destructiveColor: brand.palette.destructiveColor ?? "",
    destructiveFg: brand.palette.destructiveFg ?? "",
    successColor: brand.palette.successColor ?? "",
    successFg: brand.palette.successFg ?? "",
    bannerEnabled: brand.banner.enabled,
    bannerImageUrl: brand.banner.imageUrl ?? "",
    bannerTitle: brand.banner.title ?? "",
    bannerText: brand.banner.text ?? "",
    bannerButtonLabel: brand.banner.buttonLabel ?? "",
    bannerButtonHref: brand.banner.buttonHref ?? "",
  };
}
