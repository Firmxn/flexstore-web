import { redirect } from "next/navigation";
import { auth } from "./index";

export async function getCurrentUser() {
  const session = await auth();
  return session?.user ?? null;
}

// Untuk Server Component halaman admin.
export async function requireStoreAdminPage() {
  const user = await getCurrentUser();

  if (!user) redirect("/login");
  if (user.role !== "STORE_ADMIN") redirect("/");

  return user;
}

// Untuk halaman storefront yang butuh login (riwayat pesanan, PH-03). Semua
// role yang punya sesi boleh melihat riwayat pesanannya sendiri.
export async function requireCustomerPage() {
  const user = await getCurrentUser();

  if (!user) redirect("/login");

  return user;
}
