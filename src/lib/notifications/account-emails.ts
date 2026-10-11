import { buildPasswordResetEmail } from "@/emails/password-reset";
import { buildSetPasswordEmail } from "@/emails/set-password";
import { prisma } from "@/lib/db/prisma";
import {
  createPasswordResetToken,
  createSetPasswordToken,
} from "@/lib/auth/tokens";
import { isEmailConfigured } from "./config";
import { sendEmail } from "./email";

// Email akun (PH-07, AUTH-04/AUTH-05). Non-blocking seperti email lain: kegagalan
// hanya dicatat di log supaya alur checkout/reset tidak ikut gagal.

function appUrl(): string {
  return process.env.NEXT_PUBLIC_APP_URL?.trim() || "http://localhost:3000";
}

function recipientName(shippingAddress: unknown): string {
  if (shippingAddress && typeof shippingAddress === "object") {
    const name = (shippingAddress as { name?: unknown }).name;
    if (typeof name === "string" && name.trim()) return name.trim();
  }
  return "Pelanggan";
}

// AUTH-04: dipanggil setelah pesanan guest dibuat. Hanya kirim bila guest
// mengisi email, pesanan belum terikat akun, dan email belum terdaftar.
export async function sendSetPasswordEmailForOrder(
  orderId: string,
): Promise<void> {
  try {
    if (!isEmailConfigured()) return;

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      select: {
        userId: true,
        guestEmail: true,
        guestPhone: true,
        shippingAddress: true,
      },
    });
    if (!order || order.userId || !order.guestEmail) return;

    const email = order.guestEmail.trim().toLowerCase();
    if (!email) return;

    const existing = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });
    if (existing) return;

    const name = recipientName(order.shippingAddress);
    const token = await createSetPasswordToken({
      email,
      name,
      phone: order.guestPhone,
    });

    const { subject, html } = buildSetPasswordEmail(
      { name },
      `${appUrl()}/set-password?token=${token}`,
    );

    const result = await sendEmail({ to: email, subject, html });
    if (!result.ok) {
      console.error(`[notifications] email set password ${email} gagal: ${result.reason}`);
    }
  } catch (error) {
    console.error("[notifications] gagal mengirim email set password", error);
  }
}

// AUTH-05: tautan reset password. Token dibuat di sini supaya route pemanggil
// tidak perlu tahu detail token.
export async function sendPasswordResetEmail(
  email: string,
  userId: string,
): Promise<void> {
  try {
    if (!isEmailConfigured()) return;

    const token = await createPasswordResetToken(userId);
    const { subject, html } = buildPasswordResetEmail(
      `${appUrl()}/reset-password?token=${token}`,
    );

    const result = await sendEmail({ to: email, subject, html });
    if (!result.ok) {
      console.error(`[notifications] email reset password ${email} gagal: ${result.reason}`);
    }
  } catch (error) {
    console.error("[notifications] gagal mengirim email reset password", error);
  }
}
