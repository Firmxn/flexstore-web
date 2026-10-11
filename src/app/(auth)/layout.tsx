import Link from "next/link";

// Layout untuk halaman autentikasi (login, daftar). Sengaja terpisah dari
// `(storefront)` supaya halaman login/daftar tidak memuat Header (badge
// keranjang, menu akun, tautan "Masuk/Daftar" yang menunjuk ke halaman yang
// sedang dibuka) dan Footer. URL tidak berubah: route group tidak
// memengaruhi path.
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    // `flex-1` (bukan `min-h-full`): `<body>` root layout hanya punya
    // `min-height`, sehingga persentase tinggi tidak dapat dihitung.
    <div className="flex flex-1 flex-col">
      <header className="border-b border-border">
        <div className="mx-auto flex h-16 max-w-6xl items-center px-4">
          <Link href="/" className="text-xl font-bold tracking-tight">
            FlexStore
          </Link>
        </div>
      </header>

      <main className="flex flex-1 items-center justify-center px-4 py-10">
        <div className="w-full max-w-md">{children}</div>
      </main>
    </div>
  );
}
