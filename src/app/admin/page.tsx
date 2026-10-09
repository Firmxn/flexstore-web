import { redirect } from "next/navigation";

// Halaman ini hanya mengalihkan ke daftar produk. `instant = false` menandai
// rute sebagai blocking route (Next.js 16 cacheComponents) supaya redirect
// tidak dicoba divalidasi sebagai rute instan.
export const instant = false;

export default function AdminIndexPage() {
  redirect("/admin/products");
}
