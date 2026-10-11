import { PageHeader } from "@/components/admin/PageHeader";
import { BrandSettingsForm } from "@/components/platform/BrandSettingsForm";
import { readBrandSetting, toBrandFormValues } from "@/lib/brand";

// SITE-05 (PH-09): identitas brand per deployment.
export const instant = false;

export default async function SiteAdminBrandPage() {
  // Pembacaan tanpa cache: form harus menampilkan nilai database, bukan nilai
  // tampilan publik yang sedang ber-cache.
  const brand = await readBrandSetting();

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Identitas Brand"
        description="Nama, logo, favicon, palet warna, banner homepage, dan teks footer deployment ini."
      />
      <BrandSettingsForm initial={toBrandFormValues(brand)} />
    </div>
  );
}
