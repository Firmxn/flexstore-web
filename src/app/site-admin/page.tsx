import Link from "next/link";
import { PageHeader } from "@/components/admin/PageHeader";
import { Badge } from "@/components/ui/badge";
import {
  getPlatformSecretStatus,
  getPlatformSettings,
  listStoreAdmins,
} from "@/lib/platform";

// Dasbor platform (PH-08): ringkasan konfigurasi level sistem + status kunci.
export const instant = false;

export default async function SiteAdminIndexPage() {
  const [settings, storeAdmins] = await Promise.all([
    getPlatformSettings(),
    listStoreAdmins(),
  ]);
  const secrets = getPlatformSecretStatus();
  const activeAdmins = storeAdmins.filter((user) => !user.deactivatedAt).length;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Dasbor Platform"
        description="Konfigurasi level sistem, gateway, dan akun Store Admin."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Link
          href="/site-admin/settings"
          className="rounded-xl border border-border bg-background p-4 hover:bg-accent"
        >
          <p className="text-xs text-muted-foreground">Mode pemeliharaan</p>
          <p className="text-lg font-bold">
            {settings.maintenanceMode ? "Aktif" : "Nonaktif"}
          </p>
          <p className="text-xs text-muted-foreground">
            Pendaftaran publik:{" "}
            {settings.registrationEnabled ? "terbuka" : "ditutup"}
          </p>
        </Link>

        <Link
          href="/site-admin/payment"
          className="rounded-xl border border-border bg-background p-4 hover:bg-accent"
        >
          <p className="text-xs text-muted-foreground">Pembayaran Xendit</p>
          <p className="text-lg font-bold">
            {settings.paymentEnabled ? "Aktif" : "Dimatikan"}
          </p>
          <p className="text-xs text-muted-foreground">
            Mode {settings.paymentMode === "PRODUCTION" ? "produksi" : "sandbox"}
            {" - "}
            {secrets.xenditSecretKey ? "kunci ada" : "kunci belum diisi"}
          </p>
        </Link>

        <Link
          href="/site-admin/shipping"
          className="rounded-xl border border-border bg-background p-4 hover:bg-accent"
        >
          <p className="text-xs text-muted-foreground">Ongkir RajaOngkir</p>
          <p className="text-lg font-bold">
            {settings.shippingEnabled ? "Aktif" : "Dimatikan"}
          </p>
          <p className="text-xs text-muted-foreground">
            {settings.shippingOriginDistrictId
              ? "Asal ongkir diatur"
              : "Asal ongkir dari env"}
            {" - "}
            {secrets.rajaongkirApiKey ? "kunci ada" : "kunci belum diisi"}
          </p>
        </Link>

        <Link
          href="/site-admin/users"
          className="rounded-xl border border-border bg-background p-4 hover:bg-accent"
        >
          <p className="text-xs text-muted-foreground">Akun Store Admin</p>
          <p className="text-lg font-bold">{activeAdmins}</p>
          <p className="text-xs text-muted-foreground">
            {storeAdmins.length - activeAdmins} nonaktif dari{" "}
            {storeAdmins.length} total
          </p>
        </Link>
      </div>

      <section className="flex flex-col gap-3 rounded-xl border border-border bg-background p-4">
        <h2 className="font-semibold">Status Kunci Rahasia</h2>
        <p className="text-sm text-muted-foreground">
          Kunci tetap disimpan di env (bukan di database). Nilainya tidak pernah
          dikirim ke halaman ini.
        </p>
        <ul className="flex flex-wrap gap-2">
          <li className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm">
            Xendit secret key
            <Badge variant={secrets.xenditSecretKey ? "success" : "destructive"}>
              {secrets.xenditSecretKey ? "Ada" : "Belum"}
            </Badge>
          </li>
          <li className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm">
            Xendit webhook token
            <Badge
              variant={secrets.xenditWebhookToken ? "success" : "destructive"}
            >
              {secrets.xenditWebhookToken ? "Ada" : "Belum"}
            </Badge>
          </li>
          <li className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm">
            RajaOngkir API key
            <Badge
              variant={secrets.rajaongkirApiKey ? "success" : "destructive"}
            >
              {secrets.rajaongkirApiKey ? "Ada" : "Belum"}
            </Badge>
          </li>
        </ul>
      </section>
    </div>
  );
}
