import { prisma } from "@/lib/db/prisma";
import { redis } from "@/lib/redis/client";
import { formatDateTime } from "@/lib/utils/format";

// NOTIF-02 (PH-10): pusat notifikasi in-app. Daftar diturunkan dari data pesanan
// milik pemanggil — tanpa tabel Notification baru (docs/03 NOTIF-02 bagian 12).
// Lima jenis kejadian; waktu memakai kolom yang sudah ada.

export type AccountNotificationKind =
  | "WAITING_PAYMENT"
  | "SHIPPED"
  | "COMPLETED"
  | "CANCELED"
  | "REFUND_COMPLETED";

export type AccountNotification = {
  id: string;
  kind: AccountNotificationKind;
  title: string;
  description: string;
  href: string;
  /** Waktu kejadian (ISO) untuk pengurutan dan penanda belum dibaca. */
  at: string;
};

export type NotificationFeed = {
  notifications: AccountNotification[];
  unreadCount: number;
};

// Ditampilkan maksimal 20 entri terbaru; entri lebih lama tidak ditampilkan
// (bukan dihapus). Sumber dibatasi agar query tetap ringan.
export const MAX_NOTIFICATIONS = 20;
const NOTIFICATION_ORDER_LIMIT = 50;

const lastSeenKey = (userId: string) => `notif:last-seen:${userId}`;

export async function getNotificationLastSeen(
  userId: string,
): Promise<Date | null> {
  const raw = await redis.get<string>(lastSeenKey(userId));
  if (typeof raw !== "string" || !raw) return null;

  const date = new Date(raw);
  return Number.isNaN(date.getTime()) ? null : date;
}

// Dipanggil saat dialog notifikasi dibuka; "belum dibaca" bersifat
// semua-atau-tidak (satu penanda waktu, tanpa tabel per entri).
export async function markNotificationsSeen(
  userId: string,
  at: Date = new Date(),
): Promise<void> {
  await redis.set(lastSeenKey(userId), at.toISOString());
}

async function collectNotifications(
  userId: string,
): Promise<AccountNotification[]> {
  const orders = await prisma.order.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: NOTIFICATION_ORDER_LIMIT,
    select: {
      id: true,
      orderNumber: true,
      status: true,
      createdAt: true,
      shippedAt: true,
      completedAt: true,
      canceledAt: true,
      trackingNumber: true,
      stockReservedUntil: true,
      payment: { select: { status: true, paidAt: true, expiresAt: true } },
      refunds: {
        where: { status: "COMPLETED" },
        orderBy: { processedAt: "desc" },
        take: 1,
        select: { processedAt: true, updatedAt: true },
      },
    },
  });

  const events: AccountNotification[] = [];

  for (const order of orders) {
    const number = order.orderNumber;
    const paid =
      Boolean(order.payment?.paidAt) || order.payment?.status === "PAID";

    if (order.status === "WAITING_PAYMENT") {
      const deadline = order.payment?.expiresAt ?? order.stockReservedUntil;
      events.push({
        id: `${order.id}:waiting-payment`,
        kind: "WAITING_PAYMENT",
        title: "Menunggu Pembayaran",
        description: deadline
          ? `Selesaikan pembayaran pesanan ${number} sebelum ${formatDateTime(deadline)}.`
          : `Selesaikan pembayaran pesanan ${number}.`,
        href: `/orders/${order.id}`,
        at: order.createdAt.toISOString(),
      });
    }

    if (order.shippedAt) {
      events.push({
        id: `${order.id}:shipped`,
        kind: "SHIPPED",
        title: "Pesanan Dikirim",
        description: order.trackingNumber
          ? `Pesanan ${number} sedang dalam perjalanan. Nomor resi ${order.trackingNumber}.`
          : `Pesanan ${number} sedang dalam perjalanan.`,
        href: `/orders/${order.id}/tracking`,
        at: order.shippedAt.toISOString(),
      });
    }

    if (order.completedAt) {
      events.push({
        id: `${order.id}:completed`,
        kind: "COMPLETED",
        title: "Pesanan Tiba",
        description: `Pesanan ${number} sudah sampai. Terima kasih sudah berbelanja.`,
        href: `/orders/${order.id}/tracking`,
        at: order.completedAt.toISOString(),
      });
    }

    if (order.status === "CANCELED" && !paid) {
      const at = order.canceledAt ?? order.createdAt;
      events.push({
        id: `${order.id}:canceled`,
        kind: "CANCELED",
        title: "Pesanan Dibatalkan",
        description: `Pesanan ${number} dibatalkan sebelum dibayar.`,
        href: `/orders/${order.id}`,
        at: at.toISOString(),
      });
    }

    const refund = order.refunds[0];
    if (refund) {
      const at = refund.processedAt ?? refund.updatedAt;
      events.push({
        id: `${order.id}:refund`,
        kind: "REFUND_COMPLETED",
        title: "Refund Selesai",
        description: `Dana refund pesanan ${number} sudah diproses.`,
        href: `/orders/${order.id}`,
        at: at.toISOString(),
      });
    }
  }

  events.sort((a, b) => (a.at < b.at ? 1 : a.at > b.at ? -1 : 0));
  return events;
}

export async function getNotificationFeed(
  userId: string,
): Promise<NotificationFeed> {
  const [events, lastSeen] = await Promise.all([
    collectNotifications(userId),
    getNotificationLastSeen(userId),
  ]);

  const unreadCount = lastSeen
    ? events.filter((event) => new Date(event.at) > lastSeen).length
    : events.length;

  return { notifications: events.slice(0, MAX_NOTIFICATIONS), unreadCount };
}

// Untuk badge navbar: hanya butuh jumlahnya, daftar diambil saat dialog dibuka.
export async function countUnreadNotifications(
  userId: string,
): Promise<number> {
  const [events, lastSeen] = await Promise.all([
    collectNotifications(userId),
    getNotificationLastSeen(userId),
  ]);

  if (!lastSeen) return events.length;
  return events.filter((event) => new Date(event.at) > lastSeen).length;
}
