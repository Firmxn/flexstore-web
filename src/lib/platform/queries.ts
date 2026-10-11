import type { PlatformSetting, PlatformPaymentMode } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";

// SITE-01..SITE-03 (PH-08). Konfigurasi level platform disimpan sebagai satu
// baris tetap `id = "default"`, pola sama seperti StoreSetting (PH-06).
// Pembacaan tidak boleh menimbulkan efek samping.

export const PLATFORM_SETTINGS_ID = "default";

export type PlatformSettings = {
  maintenanceMode: boolean;
  maintenanceMessage: string | null;
  registrationEnabled: boolean;
  paymentEnabled: boolean;
  paymentMode: PlatformPaymentMode;
  invoiceDurationSeconds: number;
  shippingEnabled: boolean;
  shippingOriginDistrictId: string | null;
  shippingCouriers: string;
  shippingWeightPerItemGram: number;
  shippingFlatRateIdr: number;
};

export const DEFAULT_PLATFORM_SETTINGS: PlatformSettings = {
  maintenanceMode: false,
  maintenanceMessage: null,
  registrationEnabled: true,
  paymentEnabled: true,
  paymentMode: "SANDBOX",
  invoiceDurationSeconds: 900,
  shippingEnabled: true,
  shippingOriginDistrictId: null,
  shippingCouriers: "jne:sicepat:jnt",
  shippingWeightPerItemGram: 1000,
  shippingFlatRateIdr: 10_000,
};

function toSettings(row: PlatformSetting): PlatformSettings {
  return {
    maintenanceMode: row.maintenanceMode,
    maintenanceMessage: row.maintenanceMessage,
    registrationEnabled: row.registrationEnabled,
    paymentEnabled: row.paymentEnabled,
    paymentMode: row.paymentMode,
    invoiceDurationSeconds: row.invoiceDurationSeconds,
    shippingEnabled: row.shippingEnabled,
    shippingOriginDistrictId: row.shippingOriginDistrictId,
    shippingCouriers: row.shippingCouriers,
    shippingWeightPerItemGram: row.shippingWeightPerItemGram,
    shippingFlatRateIdr: row.shippingFlatRateIdr,
  };
}

// `null` berarti baris belum pernah disimpan, sehingga pemanggil bisa memakai
// nilai env sebagai cadangan (durasi invoice, asal ongkir, kurir, berat, tarif
// flat) tanpa kehilangan nilai env yang sudah diatur sejak PH-02/PH-04.
export async function getPlatformSettingsRow(): Promise<PlatformSettings | null> {
  try {
    const row = await prisma.platformSetting.findUnique({
      where: { id: PLATFORM_SETTINGS_ID },
    });
    return row ? toSettings(row) : null;
  } catch (error) {
    // Database tidak terjangkau tidak boleh mematikan storefront (SDD 9:
    // degrade gracefully). Diperlakukan seperti baris belum ada.
    console.error("[platform] gagal membaca pengaturan platform", error);
    return null;
  }
}

export async function getPlatformSettings(): Promise<PlatformSettings> {
  return (await getPlatformSettingsRow()) ?? DEFAULT_PLATFORM_SETTINGS;
}

// Ringkasan yang boleh diketahui publik: dipakai banner pemeliharaan di
// storefront dan pemberitahuan di halaman registrasi.
export async function getPublicPlatformStatus() {
  const settings = await getPlatformSettings();
  return {
    maintenanceMode: settings.maintenanceMode,
    maintenanceMessage: settings.maintenanceMessage,
    registrationEnabled: settings.registrationEnabled,
  };
}
