import { formatRupiah } from "@/lib/utils/format";
import { renderLayout, renderSummaryRow } from "./layout";

export type RefundCompletedEmailData = {
  orderNumber: string;
  amount: unknown;
  note: string | null;
};

// Email refund selesai (PRD 3.1.I: refund completed).
export function buildRefundCompletedEmail(
  order: RefundCompletedEmailData,
  orderUrl: string,
): { subject: string; html: string } {
  const rows = [
    renderSummaryRow("Nomor pesanan", order.orderNumber),
    renderSummaryRow("Jumlah refund", formatRupiah(Number(order.amount)), {
      strong: true,
    }),
    order.note ? renderSummaryRow("Catatan", order.note) : "",
  ].join("");

  const bodyHtml = `
    <p style="margin:0 0 12px;font-size:14px;">
      Refund untuk pesanan <strong>${order.orderNumber}</strong> sudah kami proses.
    </p>
    <table style="width:100%;border-collapse:collapse;font-size:14px;">
      ${rows}
    </table>
    <p style="margin:16px 0 0;">
      <a href="${orderUrl}" style="display:inline-block;background:#18181b;color:#ffffff;text-decoration:none;padding:10px 16px;border-radius:8px;font-size:14px;">
        Lihat Pesanan
      </a>
    </p>`;

  return {
    subject: `Refund Pesanan ${order.orderNumber} Selesai - FlexStore`,
    html: renderLayout({
      heading: "Refund Selesai",
      intro: "Dana refund sudah kami kirimkan.",
      bodyHtml,
    }),
  };
}
