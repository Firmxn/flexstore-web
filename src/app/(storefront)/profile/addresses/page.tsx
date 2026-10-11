import Link from "next/link";
import { connection } from "next/server";
import { PageContainer } from "@/components/layout/PageContainer";
import { AddressManager } from "@/components/customer/AddressManager";
import { requireCustomerPage } from "@/lib/auth/session";
import { MAX_ADDRESSES, getAddresses, toSavedAddress } from "@/lib/customers";
import { isShippingApiConfigured } from "@/lib/shipping";

export const metadata = { title: "Alamat Saya" };

// CUST-01 (revisi PH-10): halaman alamat berdiri sendiri — tanpa info akun dan
// preferensi notifikasi. API /api/customer/addresses tidak berubah.
export const instant = false;

export default async function ProfileAddressesPage() {
  await connection();

  const user = await requireCustomerPage();
  const addresses = await getAddresses(user.id);
  const shippingConfigured = await isShippingApiConfigured();

  return (
    <PageContainer>
      <div className="flex flex-col gap-1">
        <Link
          href="/profile"
          className="w-fit text-sm text-muted-foreground hover:underline"
        >
          Kembali ke profil
        </Link>
        <h1 className="text-2xl font-bold tracking-tight">Alamat Saya</h1>
        <p className="text-sm text-muted-foreground">
          Simpan alamat supaya bisa dipilih saat checkout (maksimal{" "}
          {MAX_ADDRESSES}).
        </p>
      </div>

      <AddressManager
        addresses={addresses.map(toSavedAddress)}
        shippingConfigured={shippingConfigured}
        maxAddresses={MAX_ADDRESSES}
      />
    </PageContainer>
  );
}
