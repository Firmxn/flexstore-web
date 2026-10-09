import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-4 px-4 py-24 text-center">
      <p className="text-sm font-semibold text-muted-foreground">404</p>
      <h1 className="text-2xl font-bold tracking-tight">
        Halaman tidak ditemukan
      </h1>
      <p className="text-sm text-muted-foreground">
        Halaman atau produk yang Anda cari tidak tersedia.
      </p>
      <Link
        href="/"
        className="mt-2 inline-flex h-10 items-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90"
      >
        Kembali ke Beranda
      </Link>
    </div>
  );
}
