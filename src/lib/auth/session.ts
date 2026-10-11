import type { Role } from "@prisma/client";
import { redirect } from "next/navigation";
import { auth } from "./index";
import { findUserAccessById } from "./queries";

export async function getCurrentUser() {
  const session = await auth();
  return session?.user ?? null;
}

// Halaman awal tiap role (PH-08: Site Admin dipisahkan dari Store Admin).
export function homeForRole(role: Role): string {
  if (role === "STORE_ADMIN") return "/admin";
  if (role === "SITE_ADMIN") return "/site-admin";
  return "/";
}

// Role dan status aktif dibaca ulang dari database supaya akun yang dinonaktifkan
// Site Admin tidak bisa terus memakai halaman terlindungi sampai JWT habis
// (OWASP A07). Tanpa sesi / akun nonaktif → paksa login ulang.
async function loadActiveUser() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const access = await findUserAccessById(user.id);
  if (!access || access.deactivatedAt) redirect("/login");

  return { ...user, id: access.id, role: access.role };
}

// Untuk Server Component halaman admin (Store Admin).
export async function requireStoreAdminPage() {
  const user = await loadActiveUser();
  if (user.role !== "STORE_ADMIN") redirect(homeForRole(user.role));
  return user;
}

// SITE-00 (PH-08): halaman konfigurasi platform.
export async function requireSiteAdminPage() {
  const user = await loadActiveUser();
  if (user.role !== "SITE_ADMIN") redirect(homeForRole(user.role));
  return user;
}

// Untuk halaman storefront yang butuh login (riwayat pesanan, PH-03). Hanya
// customer yang boleh; admin diarahkan ke areanya masing-masing (PRD 2: role
// Guest, Customer, Store Admin, Site Admin — admin tidak berbelanja).
export async function requireCustomerPage() {
  const user = await loadActiveUser();
  if (user.role !== "CUSTOMER") redirect(homeForRole(user.role));
  return user;
}

// Sesi untuk halaman storefront yang boleh diakses guest maupun customer
// (detail pesanan, invoice). Guest mengembalikan null; role lain diarahkan ke
// areanya masing-masing. Akun nonaktif diperlakukan seperti guest.
export async function getShopperUser() {
  const user = await getCurrentUser();
  if (!user) return null;

  const access = await findUserAccessById(user.id);
  if (!access || access.deactivatedAt) return null;

  if (access.role !== "CUSTOMER") redirect(homeForRole(access.role));

  return { ...user, id: access.id, role: access.role };
}
