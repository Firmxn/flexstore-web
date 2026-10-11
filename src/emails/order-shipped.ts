import { renderLayout, renderSummaryRow } from "./layout";

export type OrderShippedEmailData = {
  orderNumber: string;
  trackingNumber: string | null;
  courier: string | null;
  service: string | null;
};

// Email pesanan dikirim (PRD 3.1.I) dengan nomor resi dan tautan pelacakan.
export function buildOrderShippedEmail(
  order: OrderShippedEmailData,
  trackingUrl: string,
): { subject: string; html: string } {
  const rows = [
    renderSummaryRow("Nomor pesanan", order.orderNumber),
    order.courier
      ? renderSummaryRow(
          "Kurir",
          [order.courier, order.service].filter(Boolean).join(" "),
        )
      : "",
    order.trackingNumber
      ? renderSummaryRow("Nomor resi", order.trackingNumber, { strong: true })
      : "",
  ].join("");

  const bodyHtml = `
    <p style="margin:0 0 12px;font-size:14px;">
      Kabar baik! Pesanan <strong>${order.orderNumber}</strong> sudah kami kirim.
    </p>
    <table style="width:100%;border-collapse:collapse;font-size:14px;">
      ${rows}
    </table>
    <p style="margin:16px 0 0;">
      <a href="${trackingUrl}" style="display:inline-block;background:#18181b;color:#ffffff;text-decoration:none;padding:10px 16px;border-radius:8px;font-size:14px;">
        Lacak Pesanan
      </a>
    </p>`;

  return {
    subject: `Pesanan ${order.orderNumber} Dikirim - FlexStore`,
    html: renderLayout({
      heading: "Pesanan Dikirim",
      intro: "Pesanan Anda sedang dalam perjalanan.",
      bodyHtml,
    }),
  };
}
