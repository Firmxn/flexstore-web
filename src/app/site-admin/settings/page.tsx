import { PageHeader } from "@/components/admin/PageHeader";
import { PlatformSettingsForm } from "@/components/platform/PlatformSettingsForm";
import { getPlatformSettings } from "@/lib/platform";

// SITE-01 (PH-08): pengaturan platform.
export const instant = false;

export default async function SiteAdminSettingsPage() {
  const settings = await getPlatformSettings();

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Pengaturan Platform"
        description="Mode pemeliharaan dan status pendaftaran publik."
      />
      <PlatformSettingsForm
        initial={{
          maintenanceMode: settings.maintenanceMode,
          maintenanceMessage: settings.maintenanceMessage,
          registrationEnabled: settings.registrationEnabled,
        }}
      />
    </div>
  );
}
