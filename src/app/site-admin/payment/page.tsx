import { PageHeader } from "@/components/admin/PageHeader";
import { PaymentSettingsForm } from "@/components/platform/PaymentSettingsForm";
import { getPlatformSecretStatus, getPlatformSettings } from "@/lib/platform";

// SITE-02 (PH-08): konfigurasi payment gateway Xendit.
export const instant = false;

export default async function SiteAdminPaymentPage() {
  const [settings, secrets] = await Promise.all([
    getPlatformSettings(),
    Promise.resolve(getPlatformSecretStatus()),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Payment Gateway"
        description="Perilaku pembayaran Xendit. Kunci API tetap di env."
      />
      <PaymentSettingsForm
        initial={{
          paymentEnabled: settings.paymentEnabled,
          paymentMode: settings.paymentMode,
          invoiceDurationSeconds: settings.invoiceDurationSeconds,
        }}
        secrets={{
          xenditSecretKey: secrets.xenditSecretKey,
          xenditWebhookToken: secrets.xenditWebhookToken,
        }}
      />
    </div>
  );
}
