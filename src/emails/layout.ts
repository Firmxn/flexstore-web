// Kerangka HTML email bersama (MOD-NOTIF, PH-05). Ditulis sebagai string biasa
// (bukan React Email) supaya tidak menambah dependensi; gaya inline karena
// banyak klien email mengabaikan <style>.
// Escape HTML untuk semua data dinamis supaya nama produk/alamat tidak bisa
// menyisipkan markup (OWASP A03).

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function renderLayout({
  heading,
  intro,
  bodyHtml,
  footerHtml,
}: {
  heading: string;
  intro?: string;
  bodyHtml: string;
  footerHtml?: string;
}): string {
  return `<!doctype html>
<html lang="id">
  <body style="margin:0;background:#f4f4f5;font-family:Arial,Helvetica,sans-serif;color:#18181b;">
    <div style="max-width:560px;margin:0 auto;padding:24px;">
      <div style="background:#ffffff;border:1px solid #e4e4e7;border-radius:12px;padding:24px;">
        <h1 style="margin:0 0 8px;font-size:20px;">${escapeHtml(heading)}</h1>
        ${intro ? `<p style="margin:0 0 16px;color:#52525b;">${escapeHtml(intro)}</p>` : ""}
        ${bodyHtml}
      </div>
      <p style="margin:16px 0 0;font-size:12px;color:#71717a;text-align:center;">
        ${footerHtml ?? "FlexStore"}
      </p>
    </div>
  </body>
</html>`;
}

export function renderItemsTable(
  items: {
    productName: string;
    variantName: string;
    quantity: number;
    price: unknown;
  }[],
  formatRupiah: (value: number | string) => string,
): string {
  const rows = items
    .map(
      (item) => `<tr>
        <td style="padding:6px 0;border-bottom:1px solid #f4f4f5;">
          ${escapeHtml(item.productName)}
          <div style="font-size:12px;color:#71717a;">${escapeHtml(item.variantName)} x${item.quantity}</div>
        </td>
        <td style="padding:6px 0;border-bottom:1px solid #f4f4f5;text-align:right;white-space:nowrap;">
          ${formatRupiah(Number(item.price) * item.quantity)}
        </td>
      </tr>`,
    )
    .join("");

  return `<table style="width:100%;border-collapse:collapse;font-size:14px;">${rows}</table>`;
}

export function renderSummaryRow(
  label: string,
  value: string,
  options?: { strong?: boolean },
): string {
  const weight = options?.strong ? "font-weight:700;" : "color:#52525b;";
  return `<tr>
    <td style="padding:4px 0;${weight}">${escapeHtml(label)}</td>
    <td style="padding:4px 0;text-align:right;${weight}">${escapeHtml(value)}</td>
  </tr>`;
}
