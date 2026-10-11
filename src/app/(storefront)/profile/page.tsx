import { connection } from "next/server";
import { PageContainer } from "@/components/layout/PageContainer";
import { AddressManager } from "@/components/customer/AddressManager";
import { NotificationPreferencesForm } from "@/components/customer/NotificationPreferencesForm";
import { requireCustomerPage } from "@/lib/auth/session";
import {
  MAX_ADDRESSES,
  getAddresses,
  getNotificationPreferences,
  toSavedAddress,
} from "@/lib/customers";
import { isShippingApiConfigured } from "@/lib/shipping";

export const metadata = { title: "Profil Saya" };

// CUST-01/CUST-02 (PH-07): alamat tersimpan + preferensi notifikasi. Membaca
// sesi, jadi request-time.
export const instant = false;

export default async function ProfilePage() {
  await connection();

  const user = await requireCustomerPage();

  const [addresses, preferences] = await Promise.all([
    getAddresses(user.id),
    getNotificationPreferences(user.id),
  ]);

  return (
    <PageContainer>
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight">Profil Saya</h1>
        <p className="text-sm text-muted-foreground">
          {user.name}
          {user.email ? ` - ${user.email}` : ""}
        </p>
      </div>

      <section className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="font-semibold">Alamat Tersimpan</h2>
          <p className="text-sm text-muted-foreground">
            Simpan alamat supaya bisa dipilih saat checkout (maksimal{" "}
            {MAX_ADDRESSES}).
          </p>
        </div>
        <AddressManager
          addresses={addresses.map(toSavedAddress)}
          shippingConfigured={isShippingApiConfigured()}
          maxAddresses={MAX_ADDRESSES}
        />
      </section>

      <section className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="font-semibold">Preferensi Notifikasi</h2>
          <p className="text-sm text-muted-foreground">
            Pilih email yang ingin Anda terima.
          </p>
        </div>
        <NotificationPreferencesForm preferences={preferences} />
      </section>
    </PageContainer>
  );
}
