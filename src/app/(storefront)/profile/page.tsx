import Link from "next/link";
import { connection } from "next/server";
import { PageContainer } from "@/components/layout/PageContainer";
import { AccountProfileForm } from "@/components/customer/AccountProfileForm";
import { ChangePasswordForm } from "@/components/customer/ChangePasswordForm";
import { requireCustomerPage } from "@/lib/auth/session";
import { getAccountProfile } from "@/lib/customers";

export const metadata = { title: "Profil Saya" };

// CUST-03 (PH-10): halaman akun mandiri — info akun dan ubah password saja.
// Alamat ada di /profile/addresses; preferensi notifikasi pindah ke dialog
// navbar (NOTIF-02). Membaca sesi, jadi request-time.
export const instant = false;

export default async function ProfilePage() {
  await connection();

  const user = await requireCustomerPage();
  const profile = await getAccountProfile(user.id);

  return (
    <PageContainer>
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight">Profil Saya</h1>
        <p className="text-sm text-muted-foreground">
          Kelola informasi akun dan password Anda.
        </p>
      </div>

      <section className="flex flex-col gap-4">
        <h2 className="font-semibold">Info Akun</h2>
        <AccountProfileForm
          defaultName={profile?.name ?? user.name ?? ""}
          defaultEmail={profile?.email ?? ""}
        />
      </section>

      <section className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="font-semibold">Ubah Password</h2>
          <p className="text-sm text-muted-foreground">
            Gunakan password yang kuat dan mudah Anda ingat.
          </p>
        </div>
        <ChangePasswordForm />
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="font-semibold">Alamat Saya</h2>
        <p className="text-sm text-muted-foreground">
          Simpan alamat supaya bisa dipilih saat checkout.
        </p>
        <Link
          href="/profile/addresses"
          className="w-fit text-sm font-medium underline"
        >
          Kelola alamat
        </Link>
      </section>
    </PageContainer>
  );
}
