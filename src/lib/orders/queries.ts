import { prisma } from "@/lib/db/prisma";
import { releaseExpiredReservations } from "./reservations";

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function isUuid(value: string): boolean {
  return UUID_PATTERN.test(value);
}

// Pelepasan malas dijalankan sebelum membaca, supaya pesanan yang reservasinya
// sudah lewat langsung tampil CANCELED dan stoknya sudah kembali.
export async function getOrdersForUser(userId: string) {
  await releaseExpiredReservations();
  return prisma.order.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: { items: true },
  });
}

// Dipakai halaman detail customer. `findFirst` dengan userId memastikan
// pesanan milik pengguna lain menghasilkan null (404), bukan 403, supaya
// keberadaan pesanan tidak bocor (AC-ORDER-02-04).
export async function getOrderDetail(userId: string, orderId: string) {
  if (!isUuid(orderId)) return null;
  await releaseExpiredReservations();
  return prisma.order.findFirst({
    where: { id: orderId, userId },
    include: { items: true },
  });
}

// Lacak publik: nomor pesanan harus cocok DAN nomor HP harus cocok, baik lewat
// `guestPhone` (pesanan guest) maupun nomor akun (pesanan customer).
export async function findOrderForTracking(orderNumber: string, phone: string) {
  await releaseExpiredReservations();
  return prisma.order.findFirst({
    where: {
      orderNumber,
      OR: [{ guestPhone: phone }, { user: { phone } }],
    },
    include: { items: true },
  });
}
