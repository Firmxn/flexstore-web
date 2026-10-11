import { escapeHtml, renderLayout } from "./layout";

// CUST-03 (PH-10): tautan verifikasi untuk alamat email baru. Token sekali pakai,
// berlaku 24 jam. Email dikirim ke alamat BARU, dan `User.email` baru berubah
// setelah tautan ini dibuka.
export function buildEmailChangeEmail(
  verifyUrl: string,
  brandName: string,
): { subject: string; html: string } {
  const bodyHtml = `
    <p style="margin:0 0 12px;font-size:14px;">
      Kami menerima permintaan untuk mengganti email akun ${escapeHtml(brandName)} Anda. Klik
      tombol di bawah untuk menyelesaikan verifikasi.
    </p>
    <p style="margin:16px 0 0;">
      <a href="${verifyUrl}" style="display:inline-block;background:#18181b;color:#ffffff;text-decoration:none;padding:10px 16px;border-radius:8px;font-size:14px;">
        Verifikasi Email
      </a>
    </p>
    <p style="margin:16px 0 0;font-size:12px;color:#71717a;">
      Tautan berlaku 24 jam dan hanya bisa dipakai sekali. Selama belum diverifikasi,
      email lama Anda tetap aktif. Bila Anda tidak meminta perubahan ini, abaikan
      email ini; email akun Anda tidak berubah.
    </p>`;

  return {
    subject: `Verifikasi Email ${brandName}`,
    html: renderLayout({
      heading: "Verifikasi Email",
      intro: "Konfirmasi alamat email baru Anda.",
      bodyHtml,
      footerHtml: brandName,
    }),
  };
}
