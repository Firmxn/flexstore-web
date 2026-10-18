import { revalidatePath, revalidateTag } from "next/cache";
import { prisma } from "@/lib/db/prisma";
import {
  BRAND_CACHE_TAG,
  BRAND_SETTINGS_ID,
  readBrandSetting,
  type Brand,
} from "./queries";
import type { BrandSettingsInput } from "./validation";

// SITE-05 (PH-09): penulisan identitas brand. Satu baris tetap, dibuat saat
// pertama kali disimpan (upsert), sama seperti StoreSetting/PlatformSetting.
// Setelah simpan, tag `brand-settings` dibatalkan supaya seluruh rute memakai
// nilai baru tanpa rebuild; respons memakai pembacaan tanpa cache.

function toData(input: BrandSettingsInput) {
  return {
    brandName: input.brandName,
    tagline: input.tagline ?? null,
    logoUrl: input.logoUrl ?? null,
    faviconUrl: input.faviconUrl ?? null,
    footerText: input.footerText ?? null,
    primaryColor: input.primaryColor ?? null,
    primaryFg: input.primaryFg ?? null,
    secondaryColor: input.secondaryColor ?? null,
    secondaryFg: input.secondaryFg ?? null,
    accentColor: input.accentColor ?? null,
    accentFg: input.accentFg ?? null,
    backgroundColor: input.backgroundColor ?? null,
    foregroundColor: input.foregroundColor ?? null,
    mutedColor: input.mutedColor ?? null,
    mutedFg: input.mutedFg ?? null,
    borderColor: input.borderColor ?? null,
    destructiveColor: input.destructiveColor ?? null,
    destructiveFg: input.destructiveFg ?? null,
    successColor: input.successColor ?? null,
    successFg: input.successFg ?? null,
    warningColor: input.warningColor ?? null,
    warningFg: input.warningFg ?? null,
    infoColor: input.infoColor ?? null,
    infoFg: input.infoFg ?? null,
    bannerEnabled: input.bannerEnabled,
    bannerImageUrl: input.bannerImageUrl ?? null,
    bannerTitle: input.bannerTitle ?? null,
    bannerText: input.bannerText ?? null,
    bannerButtonLabel: input.bannerButtonLabel ?? null,
    bannerButtonHref: input.bannerButtonHref ?? null,
  };
}

export async function updateBrandSettings(
  input: BrandSettingsInput,
): Promise<Brand> {
  const data = toData(input);
  await prisma.brandSetting.upsert({
    where: { id: BRAND_SETTINGS_ID },
    create: { id: BRAND_SETTINGS_ID, ...data },
    update: data,
  });

  // Tampilan brand dipakai di root layout, Header, Footer, dan email. Dua
  // pembatalan dipakai bersama:
  // - tag: membatalkan entri `use cache` (termasuk HTML yang sudah diprerender);
  // - path layout: memaksa rute di bawah `/` dirender ulang, sehingga permintaan
  //   pertama setelah simpan sudah memakai identitas baru (bukan
  //   stale-while-revalidate satu permintaan).
  revalidateTag(BRAND_CACHE_TAG, "max");
  revalidatePath("/", "layout");

  return readBrandSetting();
}
