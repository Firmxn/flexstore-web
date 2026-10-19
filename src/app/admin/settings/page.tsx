import { PageHeader } from "@/components/admin/PageHeader";
import { StoreSettingsForm } from "@/components/admin/StoreSettingsForm";
import { ThemeSettings } from "@/components/admin/ThemeSettings";
import { getStoreSettings } from "@/lib/config";

// CONFIG-01 (PH-06): pengaturan toko.
export const instant = false;

export default async function AdminSettingsPage() {
  const settings = await getStoreSettings();

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Pengaturan Toko"
        description="Informasi toko, kebijakan, dan opsi ambil di toko."
      />
      <StoreSettingsForm initial={settings} />
      <ThemeSettings />
    </div>
  );
}
