import { ORDER_STATUS_LABELS } from "@/lib/orders/status";
import { formatDateTime, formatRupiah } from "@/lib/utils/format";
import { renderItemsTable, renderLayout, renderSummaryRow } from "./layout";

export type OrderEmailData = {
  orderNumber: string;
  status: keyof typeof ORDER_STATUS_LABELS;
  subtotal: unknown;
  shippingCost: unknown;
  discount: unknown;
  total: unknown;
  shippingCourier: string | null;
  shippingService: string | null;
  stockReservedUntil: Date | null;
  items: {
    productName: string;
    variantName: string;
    quantity: number;
    price: unknown;
  }[];
};

// Email konfirmasi pesanan (AC-ORDER-01-05). Berisi ringkasan item dan
// tautan ke halaman pesanan untuk melanjutkan pembayaran.
export function buildOrderConfirmationEmail(
  order: OrderEmailData,
  orderUrl: string,
  brandName: string,
): { subject: string; html: string } {
  const summary = [
    renderSummaryRow("Subtotal", formatRupiah(Number(order.subtotal))),
    renderSummaryRow("Ongkos kirim", formatRupiah(Number(order.shippingCost))),
    Number(order.discount) > 0
      ? renderSummaryRow(
          "Diskon voucher",
          `-${formatRupiah(Number(order.discount))}`,
        )
      : "",
    renderSummaryRow("Total", formatRupiah(Number(order.total)), {
      strong: true,
    }),
  ]
    .filter(Boolean)
    .join("");

  const courier = [order.shippingCourier, order.shippingService]
    .filter(Boolean)
    .join(" - ");

  const bodyHtml = `
    <p style="margin:0 0 12px;font-size:14px;">
      Nomor pesanan: <strong>${order.orderNumber}</strong><br />
      Status: ${ORDER_STATUS_LABELS[order.status]}
      ${courier ? `<br />Pengiriman: ${courier}` : ""}
    </p>
    ${renderItemsTable(order.items, formatRupiah)}
    <table style="width:100%;border-collapse:collapse;font-size:14px;margin-top:12px;">
      ${summary}
    </table>
    ${
      order.stockReservedUntil
        ? `<p style="margin:16px 0 0;font-size:14px;color:#b45309;">
            Selesaikan pembayaran sebelum ${formatDateTime(order.stockReservedUntil)}
            agar pesanan tidak dibatalkan otomatis.
          </p>`
        : ""
    }
    <p style="margin:16px 0 0;">
      <a href="${orderUrl}" style="display:inline-block;background:#18181b;color:#ffffff;text-decoration:none;padding:10px 16px;border-radius:8px;font-size:14px;">
        Lihat Pesanan &amp; Bayar
      </a>
    </p>`;

  return {
    subject: `Konfirmasi Pesanan ${order.orderNumber} - ${brandName}`,
    html: renderLayout({
      heading: "Pesanan Diterima",
      intro: "Terima kasih, pesanan Anda sudah kami catat.",
      bodyHtml,
      footerHtml: brandName,
    }),
  };
}
