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

// Untuk halaman storefront yang butuh login (riwayat pesanan, PH-03). Hanya
// customer yang boleh; admin diarahkan ke area admin (PRD 2: role Guest,
// Customer, Store Admin — admin tidak berbelanja).
export async function requireCustomerPage() {
  const user = await getCurrentUser();

  if (!user) redirect("/login");
  if (user.role !== "CUSTOMER") redirect("/admin");

  return user;
}

// Sesi untuk halaman storefront yang boleh diakses guest maupun customer
// (detail pesanan, invoice). Guest mengembalikan null; role lain diarahkan ke
// area admin.
export async function getShopperUser() {
  const user = await getCurrentUser();

  if (user && user.role !== "CUSTOMER") redirect("/admin");

  return user;
}
