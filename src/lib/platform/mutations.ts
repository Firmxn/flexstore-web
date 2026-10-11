import type { PlatformPaymentMode } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";
import { PLATFORM_SETTINGS_ID, getPlatformSettings, type PlatformSettings } from "./queries";
import type {
  PaymentSettingsInput,
  PlatformSettingsInput,
  ShippingSettingsInput,
} from "./validation";

// SITE-01..SITE-03 (PH-08): penulisan konfigurasi platform. Satu baris tetap,
// dibuat saat pertama kali disimpan (upsert), sama seperti StoreSetting.

type PlatformSettingsPatch = {
  maintenanceMode?: boolean;
  maintenanceMessage?: string | null;
  registrationEnabled?: boolean;
  paymentEnabled?: boolean;
  paymentMode?: PlatformPaymentMode;
  invoiceDurationSeconds?: number;
  shippingEnabled?: boolean;
  shippingOriginDistrictId?: string | null;
  shippingCouriers?: string;
  shippingWeightPerItemGram?: number;
  shippingFlatRateIdr?: number;
};

async function upsertPlatformSettings(
  data: PlatformSettingsPatch,
): Promise<PlatformSettings> {
  await prisma.platformSetting.upsert({
    where: { id: PLATFORM_SETTINGS_ID },
    create: { id: PLATFORM_SETTINGS_ID, ...data },
    update: data,
  });
  return getPlatformSettings();
}

export function updatePlatformSettings(input: PlatformSettingsInput) {
  return upsertPlatformSettings({
    maintenanceMode: input.maintenanceMode,
    maintenanceMessage: input.maintenanceMessage ?? null,
    registrationEnabled: input.registrationEnabled,
  });
}

export function updatePaymentSettings(input: PaymentSettingsInput) {
  return upsertPlatformSettings({
    paymentEnabled: input.paymentEnabled,
    paymentMode: input.paymentMode,
    invoiceDurationSeconds: input.invoiceDurationSeconds,
  });
}

export function updateShippingSettings(input: ShippingSettingsInput) {
  return upsertPlatformSettings({
    shippingEnabled: input.shippingEnabled,
    shippingOriginDistrictId: input.originDistrictId ?? null,
    shippingCouriers: input.couriers,
    shippingWeightPerItemGram: input.weightPerItemGram,
    shippingFlatRateIdr: input.flatRateIdr,
  });
}
