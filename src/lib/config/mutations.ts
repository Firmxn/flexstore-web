import { prisma } from "@/lib/db/prisma";
import { STORE_SETTINGS_ID, type StoreSettings } from "./queries";
import type { CancellationReasonInput, StoreSettingsInput } from "./validation";

// CONFIG-01 (PH-06). `upsert` dipakai supaya baris pengaturan tunggal selalu
// ada; tidak ada `update` polos yang bisa melempar P2025.

function toSettingsData(input: StoreSettingsInput) {
  return {
    storeEmail: input.storeEmail ?? null,
    storePhone: input.storePhone ?? null,
    storeAddress: input.storeAddress ?? null,
    aboutUs: input.aboutUs ?? null,
    returnPolicy: input.returnPolicy ?? null,
    warrantyPolicy: input.warrantyPolicy ?? null,
    pickupEnabled: input.pickupEnabled,
    pickupInfo: input.pickupInfo ?? null,
    socialInstagram: input.socialInstagram ?? null,
    socialFacebook: input.socialFacebook ?? null,
    socialWhatsapp: input.socialWhatsapp ?? null,
  };
}

export async function updateStoreSettings(
  input: StoreSettingsInput,
): Promise<StoreSettings> {
  const row = await prisma.storeSetting.upsert({
    where: { id: STORE_SETTINGS_ID },
    update: toSettingsData(input),
    create: { id: STORE_SETTINGS_ID, ...toSettingsData(input) },
  });

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

export async function createCancellationReason(input: CancellationReasonInput) {
  return prisma.cancellationReason.create({
    data: {
      text: input.text,
      isActive: input.isActive,
      sortOrder: input.sortOrder,
    },
  });
}

export async function updateCancellationReason(
  id: string,
  input: CancellationReasonInput,
): Promise<boolean> {
  const result = await prisma.cancellationReason.updateMany({
    where: { id },
    data: {
      text: input.text,
      isActive: input.isActive,
      sortOrder: input.sortOrder,
    },
  });
  return result.count > 0;
}

export async function deleteCancellationReason(id: string): Promise<boolean> {
  const result = await prisma.cancellationReason.deleteMany({ where: { id } });
  return result.count > 0;
}
