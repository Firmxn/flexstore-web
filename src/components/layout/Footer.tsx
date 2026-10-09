import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border bg-muted/30">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p className="font-semibold text-foreground">FlexStore</p>
        <nav className="flex items-center gap-4">
          <Link href="/products" className="hover:text-foreground">
            Produk
          </Link>
          <Link href="/verify-phone" className="hover:text-foreground">
            Verifikasi No. HP
          </Link>
          <Link href="/login" className="hover:text-foreground">
            Masuk
          </Link>
        </nav>
      </div>
    </footer>
  );
}
