import { renderLayout, renderSummaryRow } from "./layout";

export type CancellationEmailData = {
  orderNumber: string;
  decision: "approved" | "rejected";
  // Alasan penolakan dari admin (wajib saat ditolak, PRD 5.5 butir 4).
  reason: string | null;
};

// Email keputusan pembatalan (PRD 3.1.I: cancellation approved/rejected).
export function buildCancellationEmail(
  order: CancellationEmailData,
  orderUrl: string,
): { subject: string; html: string } {
  const approved = order.decision === "approved";

  const rows = [
    renderSummaryRow("Nomor pesanan", order.orderNumber),
    order.reason
      ? renderSummaryRow(approved ? "Catatan" : "Alasan penolakan", order.reason)
      : "",
  ].join("");

  const bodyHtml = `
    <p style="margin:0 0 12px;font-size:14px;">
      ${
        approved
          ? `Pembatalan pesanan <strong>${order.orderNumber}</strong> telah disetujui. Refund akan diproses sesuai ketentuan toko.`
          : `Mohon maaf, pembatalan pesanan <strong>${order.orderNumber}</strong> tidak dapat kami setujui.`
      }
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
    subject: `Pembatalan Pesanan ${order.orderNumber} ${approved ? "Disetujui" : "Ditolak"} - FlexStore`,
    html: renderLayout({
      heading: approved ? "Pembatalan Disetujui" : "Pembatalan Ditolak",
      intro: approved
        ? "Pesanan Anda telah dibatalkan."
        : "Pesanan Anda tetap diproses.",
      bodyHtml,
    }),
  };
}
