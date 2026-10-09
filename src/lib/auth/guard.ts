import { forbidden, unauthorized } from "@/lib/utils/api";
import { auth } from "./index";

// Guard untuk API Route Handler (OWASP A01 - Broken Access Control).
// Pemakaian:
//   const guard = await requireStoreAdmin();
//   if (!guard.ok) return guard.response;
//   guard.user.id
export async function requireStoreAdmin() {
  const session = await auth();

  if (!session?.user) {
    return { ok: false as const, response: unauthorized() };
  }

  if (session.user.role !== "STORE_ADMIN") {
    return { ok: false as const, response: forbidden() };
  }

  return { ok: true as const, user: session.user };
}

export async function requireCustomer() {
  const session = await auth();

  if (!session?.user) {
    return { ok: false as const, response: unauthorized() };
  }

  return { ok: true as const, user: session.user };
}
