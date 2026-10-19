// Label tampil untuk tiap segmen rute area admin. Segmen dinamis (`[id]`,
// `new`, `edit`) memakai label generik karena id sebenarnya tidak bisa dibaca
// dari URL tanpa mengambil data — judul spesifik tetap tampil di PageHeader
// di bawah navbar.
const SEGMENT_LABELS: Record<string, string> = {
  admin: "Admin",
  "site-admin": "Platform",
  products: "Produk",
  categories: "Kategori",
  brands: "Brand",
  vouchers: "Voucher",
  orders: "Pesanan",
  reports: "Laporan",
  settings: "Pengaturan",
  "cancellation-reasons": "Template Alasan",
  brand: "Identitas Brand",
  payment: "Payment Gateway",
  shipping: "Shipping Provider",
  users: "Store Admin",
  new: "Tambah",
  edit: "Ubah",
};

export type BreadcrumbItem = {
  label: string;
  // `null` untuk segmen terakhir (halaman saat ini) — tidak dirender sebagai
  // link karena pengguna sudah berada di sana.
  href: string | null;
};

// Potong prefiks area (admin / site-admin) dari pathname.
function stripAreaPrefix(segments: string[]): string[] {
  const first = segments[0];
  if (first === "admin" || first === "site-admin") {
    return segments.slice(1);
  }
  return segments;
}

// Bangun rantai breadcrumb dari pathname. `area` dipakai sebagai segmen pembuka
// ("Admin" / "Platform") supaya pengguna selalu tahu area kerjanya.
export function buildBreadcrumb(
  pathname: string,
  area: "admin" | "site-admin",
): BreadcrumbItem[] {
  const segments = pathname.split("/").filter(Boolean);
  const rest = stripAreaPrefix(segments);

  const items: BreadcrumbItem[] = [
    { label: area === "admin" ? "Admin" : "Platform", href: null },
  ];

  let href = area === "admin" ? "/admin" : "/site-admin";
  rest.forEach((segment, index) => {
    href += `/${segment}`;
    const isLast = index === rest.length - 1;
    items.push({
      label: SEGMENT_LABELS[segment] ?? segment,
      href: isLast ? null : href,
    });
  });

  return items;
}
