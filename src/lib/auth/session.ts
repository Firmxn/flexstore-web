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
