import { escapeHtml, renderLayout } from "./layout";

export type SetPasswordEmailData = {
  name: string;
};

// AUTH-04 (PH-07, PRD 3.1.I/5.7): guest yang mengisi email saat checkout
// menerima tautan untuk membuat akun customer (set password).
export function buildSetPasswordEmail(
  data: SetPasswordEmailData,
  setPasswordUrl: string,
): { subject: string; html: string } {
  const bodyHtml = `
    <p style="margin:0 0 12px;font-size:14px;">
      Halo ${escapeHtml(data.name)}, terima kasih sudah berbelanja di FlexStore.
      Kami melihat Anda mengisi email saat checkout. Buat password untuk
      mengakses riwayat pesanan dan alamat tersimpan Anda.
    </p>
    <p style="margin:16px 0 0;">
      <a href="${setPasswordUrl}" style="display:inline-block;background:#18181b;color:#ffffff;text-decoration:none;padding:10px 16px;border-radius:8px;font-size:14px;">
        Buat Password
      </a>
    </p>
    <p style="margin:16px 0 0;font-size:12px;color:#71717a;">
      Tautan berlaku 24 jam dan hanya bisa dipakai sekali. Abaikan email ini bila
      Anda tidak ingin membuat akun.
    </p>`;

  return {
    subject: "Buat Password Akun FlexStore",
    html: renderLayout({
      heading: "Buat Password Akun",
      intro: "Lengkapi akun Anda dengan password.",
      bodyHtml,
    }),
  };
}
