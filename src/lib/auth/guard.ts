import type { Role } from "@prisma/client";
import { forbidden, unauthorized } from "@/lib/utils/api";
import { auth } from "./index";
import { findUserAccessById } from "./queries";

// Guard untuk API Route Handler (OWASP A01 - Broken Access Control).
// Pemakaian:
//   const guard = await requireStoreAdmin();
//   if (!guard.ok) return guard.response;
//   guard.user.id
//
// PH-08: role dan status aktif diperiksa ulang dari database, bukan hanya dari
// JWT, sehingga akun yang dinonaktifkan Site Admin langsung kehilangan akses
// (OWASP A07). Biayanya satu query primary key per permintaan terlindungi.
async function requireRole(role: Role) {
  const session = await auth();
  const id = session?.user?.id;

  if (!id) {
    return { ok: false as const, response: unauthorized() };
  }

  const access = await findUserAccessById(id);
  if (!access || access.deactivatedAt) {
    return { ok: false as const, response: unauthorized() };
  }

  if (access.role !== role) {
    return { ok: false as const, response: forbidden() };
  }

  return { ok: true as const, user: { ...session.user, id, role: access.role } };
}

export function requireStoreAdmin() {
  return requireRole("STORE_ADMIN");
}

// SITE-00 (PH-08): guard area konfigurasi platform.
export function requireSiteAdmin() {
  return requireRole("SITE_ADMIN");
}

export function requireCustomer() {
  return requireRole("CUSTOMER");
}
