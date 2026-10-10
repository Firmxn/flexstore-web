// Konfigurasi email (MOD-NOTIF, PH-05). Resend dipanggil lewat HTTP API
// (tanpa SDK) supaya dependensi tetap ramping, sama seperti integrasi Xendit.
// Kalau `RESEND_API_KEY` kosong, pengiriman email dilewati tanpa menggagalkan
// alur pesanan/pembayaran (non-blocking).

export function getResendApiKey(): string | null {
  const value = process.env.RESEND_API_KEY?.trim();
  return value ? value : null;
}

export function isEmailConfigured(): boolean {
  return getResendApiKey() !== null;
}

// Alamat pengirim. Default memakai domain uji Resend supaya dev bisa jalan
// tanpa verifikasi domain.
export function getEmailFrom(): string {
  return process.env.EMAIL_FROM?.trim() || "FlexStore <onboarding@resend.dev>";
}
