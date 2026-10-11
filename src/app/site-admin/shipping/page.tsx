import { PageHeader } from "@/components/admin/PageHeader";
import { ShippingSettingsForm } from "@/components/platform/ShippingSettingsForm";
import { getPlatformSecretStatus, getPlatformSettings } from "@/lib/platform";

// SITE-03 (PH-08): konfigurasi shipping provider RajaOngkir.
export const instant = false;

export default async function SiteAdminShippingPage() {
  const [settings, secrets] = await Promise.all([
    getPlatformSettings(),
    Promise.resolve(getPlatformSecretStatus()),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Shipping Provider"
        description="Perilaku perhitungan ongkir RajaOngkir. Kunci API tetap di env."
      />
      <ShippingSettingsForm
        initial={{
          shippingEnabled: settings.shippingEnabled,
          shippingOriginDistrictId: settings.shippingOriginDistrictId,
          shippingCouriers: settings.shippingCouriers,
          shippingWeightPerItemGram: settings.shippingWeightPerItemGram,
          shippingFlatRateIdr: settings.shippingFlatRateIdr,
        }}
        rajaongkirConfigured={secrets.rajaongkirApiKey}
      />
    </div>
  );
}
