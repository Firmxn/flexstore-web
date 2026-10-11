import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";

// Reservasi stok dilepas secara malas (lazy), bukan lewat penjadwal. Alasan
// dicatat di docs/04 bagian 6.2: Vercel Cron paket Hobby hanya berjalan harian
// sehingga tidak cocok untuk batas menit. Fungsi ini dipanggil saat pesanan
// dibuat dan saat pesanan dibaca (riwayat, detail, lacak). Webhook Xendit
// (EXPIRED) membatalkan lewat `cancelOrderAndReleaseStock`.
const RELEASE_BATCH = 20;

type Tx = Prisma.TransactionClient;

// Kembalikan stok seluruh baris pesanan dan sinkronkan totalStock produk.
async function restoreStock(tx: Tx, orderId: string): Promise<void> {
  const items = await tx.orderItem.findMany({
    where: { orderId },
    select: { variantId: true, quantity: true },
  });

  for (const item of items) {
    await tx.productVariant.update({
      where: { id: item.variantId },
      data: { stock: { increment: item.quantity } },
    });
  }

  const variants = await tx.productVariant.findMany({
    where: { id: { in: items.map((item) => item.variantId) } },
    select: { productId: true },
  });
  const productIds = [...new Set(variants.map((variant) => variant.productId))];
  for (const productId of productIds) {
    const rows = await tx.productVariant.findMany({
      where: { productId },
      select: { stock: true },
    });
    await tx.product.update({
      where: { id: productId },
      data: { totalStock: rows.reduce((sum, row) => sum + row.stock, 0) },
    });
  }
}

// Klaim baris dengan `updateMany` bersyarat supaya dua permintaan yang
// berbarengan tidak melepas stok dua kali (idempoten).
async function releaseReservation(orderId: string, now: Date): Promise<boolean> {
  return prisma.$transaction(async (tx) => {
    const claimed = await tx.order.updateMany({
      where: {
        id: orderId,
        status: "WAITING_PAYMENT",
        stockReservedUntil: { lt: now },
      },
      data: { status: "CANCELED" },
    });
    if (claimed.count === 0) return false;

    await restoreStock(tx, orderId);
    return true;
  });
}

// Dipakai webhook Xendit (EXPIRED): batalkan segera tanpa menunggu waktu.
// Hanya berlaku untuk pesanan yang masih WAITING_PAYMENT, jadi pesanan yang
// sudah PAID tidak ikut dibatalkan.
export async function cancelOrderAndReleaseStock(
  orderId: string,
): Promise<boolean> {
  return prisma.$transaction(async (tx) => {
    const claimed = await tx.order.updateMany({
      where: { id: orderId, status: "WAITING_PAYMENT" },
      data: { status: "CANCELED" },
    });
    if (claimed.count === 0) return false;

    await restoreStock(tx, orderId);
    return true;
  });
}

// Dipakai admin saat menyetujui pembatalan (ORDER-05): pesanan berstatus
// CANCEL_REQUESTED dipindah ke CANCELED dan stoknya dikembalikan. Klaim baris
// bersyarat membuat operasi ini idempoten.
export async function cancelRequestedOrderAndReleaseStock(
  orderId: string,
): Promise<boolean> {
  return prisma.$transaction(async (tx) => {
    const claimed = await tx.order.updateMany({
      where: { id: orderId, status: "CANCEL_REQUESTED" },
      data: { status: "CANCELED", canceledAt: new Date() },
    });
    if (claimed.count === 0) return false;

    await restoreStock(tx, orderId);
    return true;
  });
}

export async function releaseExpiredReservations(): Promise<number> {
  const now = new Date();
  const expired = await prisma.order.findMany({
    where: { status: "WAITING_PAYMENT", stockReservedUntil: { lt: now } },
    select: { id: true },
    orderBy: { stockReservedUntil: "asc" },
    take: RELEASE_BATCH,
  });

  let released = 0;
  for (const row of expired) {
    const didRelease = await releaseReservation(row.id, now);
    if (didRelease) released += 1;
  }
  return released;
}
