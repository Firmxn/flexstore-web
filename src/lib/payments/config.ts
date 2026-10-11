// Konfigurasi Xendit (MOD-PAY, PH-04). Base URL ditulis tetap di kode supaya
// tidak bisa diarahkan ke host lain (OWASP A10 SSRF).
import { getPlatformSettingsRow } from "@/lib/platform/queries";

export const XENDIT_BASE_URL = "https://api.xendit.co";

// Masa bayar invoice = masa reservasi stok. Satu nilai dipakai keduanya supaya
// stok tidak dilepas saat pembeli masih bisa membayar. Diatur lewat env agar
// bisa diubah tanpa menyentuh kode, mis. XENDIT_INVOICE_DURATION=1800 (30 menit).
const DEFAULT_INVOICE_DURATION_SECONDS = 15 * 60;
const MIN_INVOICE_DURATION_SECONDS = 60;

export function getInvoiceDurationSeconds(): number {
  const raw = Number(process.env.XENDIT_INVOICE_DURATION);
  if (Number.isFinite(raw) && raw >= MIN_INVOICE_DURATION_SECONDS) {
    return Math.floor(raw);
  }
  return DEFAULT_INVOICE_DURATION_SECONDS;
}

export function getXenditSecretKey(): string {
  return process.env.XENDIT_SECRET_KEY?.trim() ?? "";
}

// PH-08 (SITE-02): durasi efektif = nilai yang diatur Site Admin di database ->
// env XENDIT_INVOICE_DURATION -> bawaan. Baris database dibuat hanya saat Site
// Admin menyimpan, sehingga nilai env tetap dipakai sampai itu terjadi.
export async function getEffectiveInvoiceDurationSeconds(): Promise<number> {
  const row = await getPlatformSettingsRow();
  return row?.invoiceDurationSeconds ?? getInvoiceDurationSeconds();
}

// PH-08 (SITE-02): sakelar pembayaran. Baris belum ada = aktif.
export async function isPaymentEnabled(): Promise<boolean> {
  const row = await getPlatformSettingsRow();
  return row?.paymentEnabled ?? true;
}

export function getXenditWebhookToken(): string {
  return process.env.XENDIT_WEBHOOK_TOKEN?.trim() ?? "";
}

export function isXenditConfigured(): boolean {
  return getXenditSecretKey().length > 0;
}
