import Link from "next/link";

// Pola navigasi storefront & admin (keputusan docs/04 bagian 10): link
// "kembali" selalu diletakkan di atas konten, di atas judul halaman, dengan
// gaya satu sumber — bukan disalin per halaman dan bukan di bagian bawah.
// CTA di bawah halaman memakai bahasa maju, bukan "Kembali".
export function BackLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="w-fit text-sm text-muted-foreground hover:underline"
    >
      {children}
    </Link>
  );
}
