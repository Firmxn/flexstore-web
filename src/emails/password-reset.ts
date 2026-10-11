import { renderLayout } from "./layout";

// AUTH-05 (PH-07, PRD 4.1): tautan reset password untuk customer yang lupa
// password. Token sekali pakai, berlaku 1 jam.
export function buildPasswordResetEmail(
  resetUrl: string,
): { subject: string; html: string } {
  const bodyHtml = `
    <p style="margin:0 0 12px;font-size:14px;">
      Kami menerima permintaan reset password untuk akun FlexStore Anda. Klik
      tombol di bawah untuk membuat password baru.
    </p>
    <p style="margin:16px 0 0;">
      <a href="${resetUrl}" style="display:inline-block;background:#18181b;color:#ffffff;text-decoration:none;padding:10px 16px;border-radius:8px;font-size:14px;">
        Reset Password
      </a>
    </p>
    <p style="margin:16px 0 0;font-size:12px;color:#71717a;">
      Tautan berlaku 1 jam dan hanya bisa dipakai sekali. Bila Anda tidak meminta
      reset, abaikan email ini; password Anda tidak berubah.
    </p>`;

  return {
    subject: "Reset Password FlexStore",
    html: renderLayout({
      heading: "Reset Password",
      intro: "Atur ulang password akun Anda.",
      bodyHtml,
    }),
  };
}
