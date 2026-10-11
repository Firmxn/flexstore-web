import { prisma } from "@/lib/db/prisma";

// CONFIG-01 (PH-06). Pengaturan toko disimpan sebagai satu baris tetap; bila
// baris belum ada, nilai bawaan dipakai tanpa menulis apa pun ke database
// (pembacaan tidak boleh menimbulkan efek samping).

export const STORE_SETTINGS_ID = "default";

export type StoreSettings = {
  storeEmail: string | null;
  storePhone: string | null;
  storeAddress: string | null;
  aboutUs: string | null;
  returnPolicy: string | null;
  warrantyPolicy: string | null;
  pickupEnabled: boolean;
  pickupInfo: string | null;
  socialInstagram: string | null;
  socialFacebook: string | null;
  socialWhatsapp: string | null;
};

export const DEFAULT_STORE_SETTINGS: StoreSettings = {
  storeEmail: null,
  storePhone: null,
  storeAddress: null,
  aboutUs: null,
  returnPolicy: null,
  warrantyPolicy: null,
  pickupEnabled: false,
  pickupInfo: null,
  socialInstagram: null,
  socialFacebook: null,
  socialWhatsapp: null,
};

export async function getStoreSettings(): Promise<StoreSettings> {
  const row = await prisma.storeSetting.findUnique({
    where: { id: STORE_SETTINGS_ID },
  });
  if (!row) return DEFAULT_STORE_SETTINGS;

  return {
    storeEmail: row.storeEmail,
    storePhone: row.storePhone,
    storeAddress: row.storeAddress,
    aboutUs: row.aboutUs,
    returnPolicy: row.returnPolicy,
    warrantyPolicy: row.warrantyPolicy,
    pickupEnabled: row.pickupEnabled,
    pickupInfo: row.pickupInfo,
    socialInstagram: row.socialInstagram,
    socialFacebook: row.socialFacebook,
    socialWhatsapp: row.socialWhatsapp,
  };
}

// Ringkasan yang dibutuhkan halaman checkout untuk opsi ambil di toko.
export async function getPickupSettings() {
  const settings = await getStoreSettings();
  return {
    enabled: settings.pickupEnabled,
    info: settings.pickupInfo,
    storeAddress: settings.storeAddress,
    storePhone: settings.storePhone,
  };
}

export async function listCancellationReasons(options?: { activeOnly?: boolean }) {
  return prisma.cancellationReason.findMany({
    where: options?.activeOnly ? { isActive: true } : undefined,
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
  });
}
