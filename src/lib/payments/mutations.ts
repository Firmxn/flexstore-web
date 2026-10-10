import { prisma } from "@/lib/db/prisma";
import { isUuid } from "@/lib/orders/queries";
import { cancelOrderAndReleaseStock } from "@/lib/orders/reservations";
import { createInvoice, getInvoice } from "./client";
import { getInvoiceDurationSeconds, isXenditConfigured } from "./config";

export type CreatePaymentErrorCode =
  | "ORDER_NOT_FOUND"
  | "FORBIDDEN"
  | "ORDER_NOT_PAYABLE"
  | "PAYMENT_PROVIDER_ERROR";

export type CreatePaymentResult =
  | {
      ok: true;
      payment: { invoiceUrl: string; status: string; expiresAt: string | null };
    }
  | { ok: false; code: CreatePaymentErrorCode; message: string };

// Identitas pemanggil: customer lewat sesi, guest lewat nomor HP pesanan.
export type PaymentAccess = {
  userId?: string | null;
  phone?: string | null;
};

export async function createPaymentForOrder(
  orderId: string,
  access: PaymentAccess,
): Promise<CreatePaymentResult> {
  if (!isUuid(orderId)) {
    return { ok: false, code: "ORDER_NOT_FOUND", message: "Pesanan tidak ditemukan" };
  }

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { payment: true },
  });
  if (!order) {
    return { ok: false, code: "ORDER_NOT_FOUND", message: "Pesanan tidak ditemukan" };
  }

  // Otorisasi: pesanan customer hanya untuk pemiliknya; pesanan guest hanya
  // untuk nomor HP yang tertera (sama seperti lacak pesanan).
  if (order.userId) {
    if (!access.userId || access.userId !== order.userId) {
      return { ok: false, code: "FORBIDDEN", message: "Anda tidak memiliki akses" };
    }
  } else if (!access.phone || access.phone !== order.guestPhone) {
    return { ok: false, code: "FORBIDDEN", message: "Anda tidak memiliki akses" };
  }

  if (order.status !== "WAITING_PAYMENT") {
    return {
      ok: false,
      code: "ORDER_NOT_PAYABLE",
      message: "Pesanan sudah tidak menunggu pembayaran",
    };
  }

  // Idempoten: pembayaran yang sudah ada dikembalikan apa adanya.
  if (order.payment?.invoiceUrl) {
    return {
      ok: true,
      payment: {
        invoiceUrl: order.payment.invoiceUrl,
        status: order.payment.status,
        expiresAt: order.payment.expiresAt?.toISOString() ?? null,
      },
    };
  }

  const durationSeconds = getInvoiceDurationSeconds();
  const appUrl = process.env.NEXT_PUBLIC_APP_URL?.trim() || null;
  // Guest dan customer kembali ke halaman pesanan yang sama setelah membayar.
  const redirectUrl = appUrl ? `${appUrl}/orders/${order.id}` : null;

  let invoice;
  try {
    invoice = await createInvoice({
      externalId: order.orderNumber,
      amount: Number(order.total),
      description: `Pesanan ${order.orderNumber}`,
      durationSeconds,
      payerEmail: order.guestEmail,
      successRedirectUrl: redirectUrl,
      failureRedirectUrl: redirectUrl,
    });
  } catch {
    return {
      ok: false,
      code: "PAYMENT_PROVIDER_ERROR",
      message: "Gagal membuat pembayaran, coba lagi",
    };
  }

  const expiresAt = invoice.expiryDate
    ? new Date(invoice.expiryDate)
    : new Date(Date.now() + durationSeconds * 1000);

  const payment = await prisma.payment.upsert({
    where: { orderId: order.id },
    create: {
      orderId: order.id,
      externalId: order.orderNumber,
      invoiceId: invoice.id,
      invoiceUrl: invoice.invoiceUrl,
      amount: order.total,
      status: "PENDING",
      expiresAt,
    },
    update: {
      invoiceId: invoice.id,
      invoiceUrl: invoice.invoiceUrl,
      expiresAt,
    },
  });

  // Selaraskan reservasi stok dengan masa berlaku invoice Xendit supaya stok
  // tidak dilepas saat pembeli masih bisa membayar.
  await prisma.order.updateMany({
    where: { id: order.id, status: "WAITING_PAYMENT" },
    data: { stockReservedUntil: expiresAt },
  });

  return {
    ok: true,
    payment: {
      invoiceUrl: invoice.invoiceUrl,
      status: payment.status,
      expiresAt: expiresAt.toISOString(),
    },
  };
}

export type ReconcilePaymentResult =
  | { ok: true; status: string; changed: boolean }
  | { ok: false; reason: "NO_PAYMENT" | "NOT_CONFIGURED" | "PROVIDER_ERROR" };

// Rekonsiliasi status pembayaran langsung ke Xendit. Webhook tetap jalur utama
// di produksi; fungsi ini jaring pengaman supaya status tetap benar kalau
// webhook telat/tidak sampai (mis. dev lokal tanpa URL publik). Idempoten
// karena perubahannya memakai `applyPaidPayment`/`applyExpiredPayment`.
export async function reconcilePaymentForOrder(
  orderId: string,
): Promise<ReconcilePaymentResult> {
  if (!isUuid(orderId)) return { ok: false, reason: "NO_PAYMENT" };

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    select: {
      payment: { select: { invoiceId: true, externalId: true, status: true } },
    },
  });
  const payment = order?.payment;
  if (!payment?.invoiceId) return { ok: false, reason: "NO_PAYMENT" };

  // Sudah final (PAID/EXPIRED/FAILED): tidak perlu tanya Xendit lagi.
  if (payment.status !== "PENDING") {
    return { ok: true, status: payment.status, changed: false };
  }

  if (!isXenditConfigured()) return { ok: false, reason: "NOT_CONFIGURED" };

  let invoice;
  try {
    invoice = await getInvoice(payment.invoiceId);
  } catch {
    return { ok: false, reason: "PROVIDER_ERROR" };
  }

  if (invoice.status === "PAID" || invoice.status === "SETTLED") {
    await applyPaidPayment(
      payment.externalId,
      invoice.paidAt ? new Date(invoice.paidAt) : new Date(),
    );
    return { ok: true, status: "PAID", changed: true };
  }

  if (invoice.status === "EXPIRED") {
    await applyExpiredPayment(payment.externalId);
    return { ok: true, status: "EXPIRED", changed: true };
  }

  return { ok: true, status: invoice.status, changed: false };
}

export type ApplyWebhookResult = "APPLIED" | "ALREADY_PROCESSED" | "NOT_FOUND";

// Webhook PAID: hanya mengubah status. Stok TIDAK dikurangi lagi karena sudah
// dipotong saat pesanan dibuat (PH-03). Klaim baris lewat `updateMany` bersyarat
// supaya pengiriman ulang webhook tidak diproses dua kali (idempoten).
export async function applyPaidPayment(
  externalId: string,
  paidAt: Date,
): Promise<ApplyWebhookResult> {
  return prisma.$transaction(async (tx) => {
    const claimed = await tx.payment.updateMany({
      where: { externalId, status: "PENDING" },
      data: { status: "PAID", paidAt },
    });
    if (claimed.count === 0) {
      const existing = await tx.payment.findUnique({
        where: { externalId },
        select: { status: true },
      });
      return existing ? "ALREADY_PROCESSED" : "NOT_FOUND";
    }

    const payment = await tx.payment.findUnique({
      where: { externalId },
      select: { orderId: true },
    });
    if (payment) {
      await tx.order.updateMany({
        where: { id: payment.orderId, status: "WAITING_PAYMENT" },
        data: { status: "PROCESSING" },
      });
    }
    return "APPLIED";
  });
}

// Webhook EXPIRED: batalkan pesanan dan kembalikan stok segera.
export async function applyExpiredPayment(
  externalId: string,
): Promise<ApplyWebhookResult> {
  const payment = await prisma.payment.findUnique({
    where: { externalId },
    select: { id: true, orderId: true, status: true },
  });
  if (!payment) return "NOT_FOUND";
  if (payment.status === "PAID") return "ALREADY_PROCESSED";

  const updated = await prisma.payment.updateMany({
    where: { id: payment.id, status: "PENDING" },
    data: { status: "EXPIRED" },
  });
  await cancelOrderAndReleaseStock(payment.orderId);

  return updated.count > 0 ? "APPLIED" : "ALREADY_PROCESSED";
}
