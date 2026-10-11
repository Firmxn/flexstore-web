import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";
import {
  sendCancellationEmail,
  sendOrderShippedEmail,
  sendRefundCompletedEmail,
} from "@/lib/notifications";
import type { AdminOrderListQuery } from "./admin-validation";
import { isUuid } from "./queries";
import { cancelRequestedOrderAndReleaseStock, releaseExpiredReservations } from "./reservations";

// Manajemen pesanan admin (ORDER-07) + pembatalan (ORDER-05) + refund
// (ORDER-06), PH-06. Semua transisi status memakai `updateMany` bersyarat
// sehingga dua permintaan berbarengan tidak menghasilkan transisi ganda.

export type OrderMutationResult =
  | { ok: true }
  | { ok: false; code: string; message: string };

const invalidStatus = (message: string): OrderMutationResult => ({
  ok: false,
  code: "INVALID_STATUS",
  message,
});

export async function listAdminOrders(query: AdminOrderListQuery) {
  const where: Prisma.OrderWhereInput = {};
  if (query.status) where.status = query.status;
  if (query.search) {
    where.OR = [
      { orderNumber: { contains: query.search, mode: "insensitive" } },
      { guestPhone: { contains: query.search } },
      { user: { email: { contains: query.search, mode: "insensitive" } } },
      { user: { name: { contains: query.search, mode: "insensitive" } } },
    ];
  }

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (query.page - 1) * query.limit,
      take: query.limit,
      include: {
        items: { select: { quantity: true } },
        payment: { select: { status: true } },
        user: { select: { name: true, email: true } },
      },
    }),
    prisma.order.count({ where }),
  ]);

  return { orders, total, page: query.page, limit: query.limit };
}

export async function getAdminOrderDetail(orderId: string) {
  if (!isUuid(orderId)) return null;
  await releaseExpiredReservations();
  return prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: true,
      payment: true,
      refunds: { orderBy: { createdAt: "desc" } },
      user: { select: { id: true, name: true, email: true, phone: true } },
    },
  });
}

export async function countOrdersByStatus() {
  const rows = await prisma.order.groupBy({
    by: ["status"],
    _count: { _all: true },
  });
  return rows.reduce<Record<string, number>>((acc, row) => {
    acc[row.status] = row._count._all;
    return acc;
  }, {});
}

// ORDER-07: tandai pesanan dikirim + simpan nomor resi, lalu kirim email.
export async function markOrderShipped(
  orderId: string,
  trackingNumber: string,
): Promise<OrderMutationResult> {
  const result = await prisma.order.updateMany({
    where: { id: orderId, status: "PROCESSING" },
    data: { status: "SHIPPED", trackingNumber, shippedAt: new Date() },
  });
  if (result.count === 0) {
    return invalidStatus("Hanya pesanan berstatus Diproses yang bisa dikirim");
  }

  await sendOrderShippedEmail(orderId);
  return { ok: true };
}

export async function markOrderCompleted(
  orderId: string,
): Promise<OrderMutationResult> {
  const result = await prisma.order.updateMany({
    where: { id: orderId, status: "SHIPPED" },
    data: { status: "COMPLETED", completedAt: new Date() },
  });
  if (result.count === 0) {
    return invalidStatus("Hanya pesanan berstatus Dikirim yang bisa diselesaikan");
  }
  return { ok: true };
}

// ORDER-05: pembeli/guest mengajukan pembatalan (PRD 5.5 butir 2: hanya selama
// pesanan belum diproses/dikirim). Otorisasi kepemilikan dilakukan pemanggil.
export async function requestOrderCancellation(
  orderId: string,
  reason: string,
): Promise<OrderMutationResult> {
  const result = await prisma.order.updateMany({
    where: { id: orderId, status: { in: ["WAITING_PAYMENT", "PROCESSING"] } },
    data: {
      status: "CANCEL_REQUESTED",
      cancelRequestedAt: new Date(),
      cancelReason: reason,
      cancelRejectionReason: null,
    },
  });
  if (result.count === 0) {
    return invalidStatus("Pesanan tidak bisa dibatalkan pada status ini");
  }
  return { ok: true };
}

// ORDER-05: admin menyetujui pembatalan. Stok dikembalikan; bila sudah dibayar,
// baris refund dibuat dengan status PENDING supaya admin mengunggah bukti
// (PRD 5.6 butir 2).
export async function approveCancellation(
  orderId: string,
): Promise<OrderMutationResult> {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    select: { total: true, payment: { select: { status: true } } },
  });
  if (!order) {
    return { ok: false, code: "NOT_FOUND", message: "Pesanan tidak ditemukan" };
  }

  const released = await cancelRequestedOrderAndReleaseStock(orderId);
  if (!released) {
    return invalidStatus("Tidak ada pengajuan pembatalan yang menunggu tinjauan");
  }

  if (order.payment?.status === "PAID") {
    const existing = await prisma.refund.findFirst({
      where: { orderId },
      select: { id: true },
    });
    if (!existing) {
      await prisma.refund.create({
        data: {
          orderId,
          amount: order.total,
          method: "MANUAL",
          status: "PENDING",
        },
      });
    }
  }

  await sendCancellationEmail(orderId, "approved");
  return { ok: true };
}

// ORDER-05: admin menolak pembatalan; alasan wajib (template atau manual).
export async function rejectCancellation(
  orderId: string,
  rejectionReason: string,
): Promise<OrderMutationResult> {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    select: { payment: { select: { status: true } } },
  });
  if (!order) {
    return { ok: false, code: "NOT_FOUND", message: "Pesanan tidak ditemukan" };
  }

  const nextStatus =
    order.payment?.status === "PAID" ? "PROCESSING" : "WAITING_PAYMENT";

  const result = await prisma.order.updateMany({
    where: { id: orderId, status: "CANCEL_REQUESTED" },
    data: { status: nextStatus, cancelRejectionReason: rejectionReason },
  });
  if (result.count === 0) {
    return invalidStatus("Tidak ada pengajuan pembatalan yang menunggu tinjauan");
  }

  await sendCancellationEmail(orderId, "rejected");
  return { ok: true };
}

// ORDER-06: admin menandai refund manual selesai dengan bukti (PRD 5.6).
export async function completeRefund(
  refundId: string,
  proofUrl: string,
  note?: string,
): Promise<OrderMutationResult> {
  if (!isUuid(refundId)) {
    return { ok: false, code: "NOT_FOUND", message: "Refund tidak ditemukan" };
  }

  const result = await prisma.refund.updateMany({
    where: { id: refundId, status: "PENDING" },
    data: {
      status: "COMPLETED",
      proofUrl,
      note: note ?? null,
      processedAt: new Date(),
    },
  });
  if (result.count === 0) {
    return invalidStatus("Refund sudah diproses atau tidak ditemukan");
  }

  const refund = await prisma.refund.findUnique({
    where: { id: refundId },
    select: { orderId: true },
  });
  if (refund) await sendRefundCompletedEmail(refund.orderId);
  return { ok: true };
}

// ORDER-08: pesanan customer yang masih dalam perjalanan (tanpa input data).
export async function getInTransitOrdersForUser(userId: string) {
  await releaseExpiredReservations();
  return prisma.order.findMany({
    where: { userId, status: { in: ["PROCESSING", "SHIPPED"] } },
    orderBy: { createdAt: "desc" },
    include: {
      items: {
        include: {
          variant: {
            include: {
              product: {
                select: {
                  images: {
                    orderBy: { sortOrder: "asc" as const },
                    take: 1,
                    select: { url: true },
                  },
                },
              },
            },
          },
        },
      },
    },
  });
}

// ORDER-08: detail tracking per pesanan, session-scoped (pola `/orders/[id]`).
export async function getTrackingOrderForUser(userId: string, orderId: string) {
  if (!isUuid(orderId)) return null;
  await releaseExpiredReservations();
  return prisma.order.findFirst({
    where: { id: orderId, userId },
    include: { items: true, payment: true },
  });
}
