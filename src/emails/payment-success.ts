import { formatRupiah } from "@/lib/utils/format";
import { renderLayout, renderSummaryRow } from "./layout";

export type PaymentSuccessEmailData = {
  orderNumber: string;
  total: unknown;
  paidAt: Date | null;
};

// Email pembayaran berhasil (AC-PAY-02-05).
export function buildPaymentSuccessEmail(
  order: PaymentSuccessEmailData,
  orderUrl: string,
  brandName: string,
): { subject: string; html: string } {
  const summary = [
    renderSummaryRow("Total dibayar", formatRupiah(Number(order.total)), {
      strong: true,
    }),
  ].join("");

  const bodyHtml = `
    <p style="margin:0 0 12px;font-size:14px;">
      Pembayaran untuk pesanan <strong>${order.orderNumber}</strong> sudah kami
      terima. Pesanan akan segera kami proses.
    </p>
    <table style="width:100%;border-collapse:collapse;font-size:14px;">
      ${summary}
    </table>
    <p style="margin:16px 0 0;">
      <a href="${orderUrl}" style="display:inline-block;background:#18181b;color:#ffffff;text-decoration:none;padding:10px 16px;border-radius:8px;font-size:14px;">
        Lihat Pesanan
      </a>
    </p>`;

  return {
    subject: `Pembayaran Berhasil ${order.orderNumber} - ${brandName}`,
    html: renderLayout({
      heading: "Pembayaran Berhasil",
      intro: "Terima kasih, pembayaran Anda sudah terkonfirmasi.",
      bodyHtml,
      footerHtml: brandName,
    }),
  };
}
