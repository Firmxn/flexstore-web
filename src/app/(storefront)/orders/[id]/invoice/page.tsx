import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { PageContainer } from "@/components/layout/PageContainer";
import { PrintButton } from "@/components/invoices/PrintButton";
import { getShopperUser } from "@/lib/auth/session";
import { getBrandSetting } from "@/lib/brand";
import { ORDER_STATUS_LABELS } from "@/lib/orders/status";
import {
  getGuestAccessPhone,
  getGuestOrderDetail,
  getOrderDetail,
} from "@/lib/orders";
import { formatDateTime, formatRupiah } from "@/lib/utils/format";

export const metadata = { title: "Invoice" };

export const instant = false;

type AddressJson = {
  name?: string;
  phone?: string;
  street?: string;
  city?: string;
  province?: string;
  district?: string;
  subdistrict?: string;
  postalCode?: string;
};

// Invoice (MOD-INV, PH-05). Akses memakai aturan yang sama dengan halaman
// pesanan: customer lewat sesi, guest lewat cookie bertanda-tangan. Pesanan
// milik orang lain atau ID bukan UUID menghasilkan 404 (AC-ORDER-02-04).
export default async function InvoicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await connection();

  const { id } = await params;
  const user = await getShopperUser();
  const guestPhone = user ? null : await getGuestAccessPhone();

  const order = user
    ? await getOrderDetail(user.id, id)
    : guestPhone
      ? await getGuestOrderDetail(id, guestPhone)
      : null;
  if (!order) notFound();

  // Invoice hanya sah setelah pembayaran lunas: pesanan yang belum dibayar atau
  // dibatalkan sebelum bayar tidak punya dokumen tagihan yang bisa dicetak
  // (keputusan 2026-10-11, `docs/04` bagian 10). URL langsung pun ditolak.
  if (order.payment?.status !== "PAID") notFound();

  // SITE-05 (PH-09): kop invoice memakai identitas brand.
  const brand = await getBrandSetting();

  const address = (order.shippingAddress ?? {}) as AddressJson;
  const isPaid = order.payment?.status === "PAID";

  return (
    <PageContainer className="print:max-w-none print:px-0 print:py-0">
      <div className="flex items-center justify-between gap-3 print:hidden">
        <Link
          href={`/orders/${order.id}`}
          className="text-sm text-muted-foreground hover:underline"
        >
          Kembali ke pesanan
        </Link>
        <PrintButton />
      </div>

      <article className="flex flex-col gap-6 rounded-xl border border-border bg-background p-4 print:rounded-none print:border-0 print:p-0">
        <header className="flex flex-wrap items-start justify-between gap-4 border-b border-border pb-4">
          <div>
            {brand.logoUrl ? (
              // URL berasal dari Uploadthing; pakai img biasa agar tidak
              // bergantung pada allowlist domain next/image.
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={brand.logoUrl}
                alt={brand.brandName}
                className="h-8 w-auto"
              />
            ) : (
              <p className="text-lg font-bold tracking-tight">
                {brand.brandName}
              </p>
            )}
            <p className="text-sm text-muted-foreground">
              Invoice {order.orderNumber}
            </p>
          </div>
          <div className="text-right text-sm">
            <p className="font-semibold">
              {isPaid ? "LUNAS" : ORDER_STATUS_LABELS[order.status]}
            </p>
            <p className="text-muted-foreground">
              {formatDateTime(order.createdAt)}
            </p>
          </div>
        </header>

        <section className="grid gap-4 text-sm sm:grid-cols-2">
          <div>
            <h2 className="mb-1 font-semibold">Ditagihkan kepada</h2>
            <p className="font-medium">{address.name}</p>
            <p className="text-muted-foreground">{address.phone}</p>
            <p className="text-muted-foreground">{address.street}</p>
            <p className="text-muted-foreground">
              {[
                address.subdistrict,
                address.district,
                address.city,
                address.province,
                address.postalCode,
              ]
                .filter(Boolean)
                .join(", ")}
            </p>
          </div>
          <div className="sm:text-right">
            <h2 className="mb-1 font-semibold">Pengiriman</h2>
            <p className="text-muted-foreground">
              {[order.shippingCourier, order.shippingService]
                .filter(Boolean)
                .join(" - ") || "-"}
            </p>
            {order.shippingEtd ? (
              <p className="text-muted-foreground">
                Estimasi {order.shippingEtd}
              </p>
            ) : null}
          </div>
        </section>

        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-border text-left">
              <th className="py-2 font-semibold">Item</th>
              <th className="py-2 text-right font-semibold">Qty</th>
              <th className="py-2 text-right font-semibold">Harga</th>
              <th className="py-2 text-right font-semibold">Jumlah</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item) => (
              <tr key={item.id} className="border-b border-border">
                <td className="py-2">
                  <span className="font-medium">{item.productName}</span>
                  <span className="block text-xs text-muted-foreground">
                    {item.variantName} - SKU {item.sku}
                  </span>
                </td>
                <td className="py-2 text-right">{item.quantity}</td>
                <td className="py-2 text-right">
                  {formatRupiah(Number(item.price))}
                </td>
                <td className="py-2 text-right">
                  {formatRupiah(Number(item.price) * item.quantity)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <dl className="ml-auto flex w-full max-w-xs flex-col gap-2 text-sm">
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Subtotal</dt>
            <dd>{formatRupiah(Number(order.subtotal))}</dd>
          </div>
          {Number(order.discount) > 0 ? (
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Diskon voucher</dt>
              <dd>-{formatRupiah(Number(order.discount))}</dd>
            </div>
          ) : null}
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Ongkos kirim</dt>
            <dd>{formatRupiah(Number(order.shippingCost))}</dd>
          </div>
          <div className="flex justify-between border-t border-border pt-2 font-semibold">
            <dt>Total</dt>
            <dd>{formatRupiah(Number(order.total))}</dd>
          </div>
        </dl>
      </article>
    </PageContainer>
  );
}
