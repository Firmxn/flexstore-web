import { prisma } from "@/lib/db/prisma";

// Reservasi stok dilepas secara malas (lazy), bukan lewat penjadwal. Alasan
// dicatat di docs/04 bagian 6.2: Vercel Cron paket Hobby hanya berjalan harian
// sehingga tidak cocok untuk batas 10 menit. Fungsi ini dipanggil saat pesanan
// dibuat dan saat pesanan dibaca (riwayat, detail, lacak).
const RELEASE_BATCH = 20;

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

    // totalStock produk diturunkan lagi agar katalog tetap konsisten.
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
