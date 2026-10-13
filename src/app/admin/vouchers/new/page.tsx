import { BackLink } from "@/components/layout/BackLink";
import { PageHeader } from "@/components/admin/PageHeader";
import { VoucherForm } from "@/components/admin/VoucherForm";
import { getVoucherOptions, getVoucherScopeOptions } from "@/lib/vouchers";

// Data voucher lain dibaca di level halaman, di luar Suspense.
// `instant = false` menandai rute ini sebagai blocking route (Next.js 16
// cacheComponents); konfigurasi di layout tidak diwariskan ke halaman.
export const instant = false;

export default async function NewVoucherPage() {
  const [options, scope] = await Promise.all([
    getVoucherOptions(),
    getVoucherScopeOptions(),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <BackLink href="/admin/vouchers">Kembali ke voucher</BackLink>

      <PageHeader
        title="Tambah Voucher"
        description="Voucher berlaku sesuai periode, kuota, cakupan produk, dan aturan kompatibilitas."
      />

      <VoucherForm
        options={options.map((option) => ({
          id: option.id,
          code: option.code,
          isActive: option.isActive,
        }))}
        products={scope.products}
        categories={scope.categories}
      />
    </div>
  );
}
