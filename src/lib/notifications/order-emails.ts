import { buildCancellationEmail } from "@/emails/cancellation";
import { buildOrderConfirmationEmail } from "@/emails/order-confirmation";
import { buildOrderShippedEmail } from "@/emails/order-shipped";
import { buildPaymentSuccessEmail } from "@/emails/payment-success";
import { buildRefundCompletedEmail } from "@/emails/refund-completed";
import { prisma } from "@/lib/db/prisma";
import { isEmailConfigured } from "./config";
import { sendEmail } from "./email";

// Email transaksional (MOD-NOTIF, PH-05). Semua fungsi tidak pernah melempar
// error: notifikasi bersifat non-blocking, kegagalan hanya dicatat di log
// supaya alur pesanan/pembayaran tetap berhasil (SDD 4.9).

function appUrl(): string {
  return process.env.NEXT_PUBLIC_APP_URL?.trim() || "http://localhost:3000";
}

function resolveRecipient(order: {
  guestEmail: string | null;
  user: { email: string | null } | null;
}): string | null {
  return order.guestEmail ?? order.user?.email ?? null;
}

export async function sendOrderConfirmationEmail(orderId: string): Promise<void> {
  try {
    if (!isEmailConfigured()) return;

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true, user: { select: { email: true } } },
    });
    if (!order) return;

    const to = resolveRecipient(order);
    if (!to) return;

    const { subject, html } = buildOrderConfirmationEmail(
      {
        orderNumber: order.orderNumber,
        status: order.status,
        subtotal: order.subtotal,
        shippingCost: order.shippingCost,
        discount: order.discount,
        total: order.total,
        shippingCourier: order.shippingCourier,
        shippingService: order.shippingService,
        stockReservedUntil: order.stockReservedUntil,
        items: order.items.map((item) => ({
          productName: item.productName,
          variantName: item.variantName,
          quantity: item.quantity,
          price: item.price,
        })),
      },
      `${appUrl()}/orders/${order.id}`,
    );

    const result = await sendEmail({ to, subject, html });
    if (!result.ok) {
      console.error(
        `[notifications] konfirmasi pesanan ${order.orderNumber} gagal: ${result.reason}`,
      );
    }
  } catch (error) {
    console.error("[notifications] gagal mengirim konfirmasi pesanan", error);
  }
}

export async function sendPaymentSuccessEmail(orderId: string): Promise<void> {
  try {
    if (!isEmailConfigured()) return;

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { user: { select: { email: true } }, payment: true },
    });
    if (!order) return;

    const to = resolveRecipient(order);
    if (!to) return;

    const { subject, html } = buildPaymentSuccessEmail(
      {
        orderNumber: order.orderNumber,
        total: order.total,
        paidAt: order.payment?.paidAt ?? null,
      },
      `${appUrl()}/orders/${order.id}`,
    );

    const result = await sendEmail({ to, subject, html });
    if (!result.ok) {
      console.error(
        `[notifications] email pembayaran ${order.orderNumber} gagal: ${result.reason}`,
      );
    }
  } catch (error) {
    console.error("[notifications] gagal mengirim email pembayaran", error);
  }
}

// Tautan pelacakan berbeda per jenis pembeli: customer memakai halaman
// session-scoped, guest memakai form lacak publik (nomor pesanan + nomor HP).
function trackingUrlFor(order: { id: string; userId: string | null }): string {
  return order.userId
    ? `${appUrl()}/orders/${order.id}/tracking`
    : `${appUrl()}/track-order`;
}

export async function sendOrderShippedEmail(orderId: string): Promise<void> {
  try {
    if (!isEmailConfigured()) return;

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { user: { select: { email: true } } },
    });
    if (!order) return;

    const to = resolveRecipient(order);
    if (!to) return;

    const { subject, html } = buildOrderShippedEmail(
      {
        orderNumber: order.orderNumber,
        trackingNumber: order.trackingNumber,
        courier: order.shippingCourier,
        service: order.shippingService,
      },
      trackingUrlFor(order),
    );

    const result = await sendEmail({ to, subject, html });
    if (!result.ok) {
      console.error(
        `[notifications] email pengiriman ${order.orderNumber} gagal: ${result.reason}`,
      );
    }
  } catch (error) {
    console.error("[notifications] gagal mengirim email pengiriman", error);
  }
}

export async function sendCancellationEmail(
  orderId: string,
  decision: "approved" | "rejected",
): Promise<void> {
  try {
    if (!isEmailConfigured()) return;

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { user: { select: { email: true } } },
    });
    if (!order) return;

    const to = resolveRecipient(order);
    if (!to) return;

    const { subject, html } = buildCancellationEmail(
      {
        orderNumber: order.orderNumber,
        decision,
        reason:
          decision === "approved"
            ? order.cancelReason
            : order.cancelRejectionReason,
      },
      `${appUrl()}/orders/${order.id}`,
    );

    const result = await sendEmail({ to, subject, html });
    if (!result.ok) {
      console.error(
        `[notifications] email pembatalan ${order.orderNumber} gagal: ${result.reason}`,
      );
    }
  } catch (error) {
    console.error("[notifications] gagal mengirim email pembatalan", error);
  }
}

export async function sendRefundCompletedEmail(orderId: string): Promise<void> {
  try {
    if (!isEmailConfigured()) return;

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        user: { select: { email: true } },
        refunds: { orderBy: { createdAt: "desc" }, take: 1 },
      },
    });
    if (!order) return;

    const to = resolveRecipient(order);
    if (!to) return;

    const refund = order.refunds[0];
    if (!refund) return;

    const { subject, html } = buildRefundCompletedEmail(
      {
        orderNumber: order.orderNumber,
        amount: refund.amount,
        note: refund.note,
      },
      `${appUrl()}/orders/${order.id}`,
    );

    const result = await sendEmail({ to, subject, html });
    if (!result.ok) {
      console.error(
        `[notifications] email refund ${order.orderNumber} gagal: ${result.reason}`,
      );
    }
  } catch (error) {
    console.error("[notifications] gagal mengirim email refund", error);
  }
}
