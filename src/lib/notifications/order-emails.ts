import { buildOrderConfirmationEmail } from "@/emails/order-confirmation";
import { buildPaymentSuccessEmail } from "@/emails/payment-success";
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
