import { prisma } from "@/lib/db/prisma";

// CUST-01/CUST-02 (PH-07): baca alamat dan preferensi notifikasi milik sendiri.
// Semua query mensyaratkan `userId`, jadi alamat customer lain tidak pernah
// terbaca (OWASP A01).

export type NotificationKind =
  | "orderConfirmation"
  | "paymentConfirmation"
  | "shippingUpdate"
  | "cancellationUpdate"
  | "refundUpdate";

export function getAddresses(userId: string) {
  return prisma.address.findMany({
    where: { userId },
    orderBy: [{ isPrimary: "desc" }, { createdAt: "asc" }],
  });
}

export function getAddressById(userId: string, addressId: string) {
  return prisma.address.findFirst({ where: { id: addressId, userId } });
}

export function countAddresses(userId: string) {
  return prisma.address.count({ where: { userId } });
}

export type NotificationPreferences = Record<NotificationKind, boolean>;

// Nilai bawaan semua aktif; pembacaan tidak menulis baris (sama seperti
// StoreSetting). Baris baru dibuat saat customer menyimpan preferensi.
export async function getNotificationPreferences(
  userId: string,
): Promise<NotificationPreferences> {
  const row = await prisma.notificationPreference.findUnique({
    where: { userId },
  });

  return {
    orderConfirmation: row?.orderConfirmation ?? true,
    paymentConfirmation: row?.paymentConfirmation ?? true,
    shippingUpdate: row?.shippingUpdate ?? true,
    cancellationUpdate: row?.cancellationUpdate ?? true,
    refundUpdate: row?.refundUpdate ?? true,
  };
}

// Penegakan preferensi saat kirim (CUST-02). Guest tidak punya preferensi, jadi
// selalu dikirimi; kegagalan baca tidak boleh memblokir email transaksional.
export async function shouldSendNotification(
  userId: string | null,
  kind: NotificationKind,
): Promise<boolean> {
  if (!userId) return true;

  try {
    const preferences = await getNotificationPreferences(userId);
    return preferences[kind];
  } catch (error) {
    console.error("[customers] gagal membaca preferensi notifikasi", error);
    return true;
  }
}
