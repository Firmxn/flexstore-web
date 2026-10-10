import { PageHeader } from "@/components/admin/PageHeader";
import { VoucherForm } from "@/components/admin/VoucherForm";
import { getVoucherOptions } from "@/lib/vouchers";

// Data voucher lain dibaca di level halaman, di luar Suspense.
// `instant = false` menandai rute ini sebagai blocking route (Next.js 16
// cacheComponents); konfigurasi di layout tidak diwariskan ke halaman.
export const instant = false;

export default async function NewVoucherPage() {
  const options = await getVoucherOptions();

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Tambah Voucher"
        description="Voucher berlaku sesuai periode, kuota, dan aturan kompatibilitas."
      />

      <VoucherForm
        options={options.map((option) => ({
          id: option.id,
          code: option.code,
          isActive: option.isActive,
        }))}
      />
    </div>
  );
}
