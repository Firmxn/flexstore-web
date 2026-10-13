import { notFound } from "next/navigation";
import { z } from "zod";
import { BackLink } from "@/components/layout/BackLink";
import { PageHeader } from "@/components/admin/PageHeader";
import { VoucherForm } from "@/components/admin/VoucherForm";
import { getVoucherById, getVoucherOptions, getVoucherScopeOptions } from "@/lib/vouchers";

const idSchema = z.string().uuid();

// `params` dan data voucher dibaca di level halaman, di luar Suspense.
// `instant = false` menandai rute ini sebagai blocking route (Next.js 16
// cacheComponents); konfigurasi di layout tidak diwariskan ke halaman.
export const instant = false;

const toDateInput = (value: Date) => value.toISOString().slice(0, 10);
const toString = (value: unknown) => (value == null ? "" : String(value));

export default async function EditVoucherPage({
  params,
}: PageProps<"/admin/vouchers/[id]/edit">) {
  const { id } = await params;
  if (!idSchema.safeParse(id).success) notFound();

  const [voucher, options, scope] = await Promise.all([
    getVoucherById(id),
    getVoucherOptions(id),
    getVoucherScopeOptions(),
  ]);

  if (!voucher) notFound();

  const compatibleVoucherIds = [
    ...voucher.compatibilitiesAsA
      .filter((item) => item.isAllowed)
      .map((item) => item.voucherBId),
    ...voucher.compatibilitiesAsB
      .filter((item) => item.isAllowed)
      .map((item) => item.voucherAId),
  ];

  return (
    <div className="flex flex-col gap-6">
      <BackLink href="/admin/vouchers">Kembali ke voucher</BackLink>

      <PageHeader title="Ubah Voucher" description={`Kode: ${voucher.code}`} />

      <VoucherForm
        options={options.map((option) => ({
          id: option.id,
          code: option.code,
          isActive: option.isActive,
        }))}
        products={scope.products}
        categories={scope.categories}
        initial={{
          id: voucher.id,
          code: voucher.code,
          type: voucher.type,
          discountPercentage: toString(voucher.discountPercentage),
          discountAmount: toString(voucher.discountAmount),
          maxDiscount: toString(voucher.maxDiscount),
          minTransaction: toString(voucher.minTransaction),
          usageLimit: toString(voucher.usageLimit),
          usageLimitPerPhone: toString(voucher.usageLimitPerPhone),
          validFrom: toDateInput(voucher.validFrom),
          validUntil: toDateInput(voucher.validUntil),
          isActive: voucher.isActive,
          compatibleVoucherIds,
          eligibleProductIds: voucher.products
            .filter((row) => row.kind === "ELIGIBLE")
            .map((row) => row.productId),
          excludedProductIds: voucher.products
            .filter((row) => row.kind === "EXCLUDED")
            .map((row) => row.productId),
          categoryIds: voucher.categories.map((row) => row.categoryId),
        }}
      />
    </div>
  );
}
