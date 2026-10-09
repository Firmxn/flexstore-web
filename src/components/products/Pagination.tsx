import Link from "next/link";
import { cn } from "@/lib/utils/cn";

type PaginationProps = {
  page: number;
  limit: number;
  total: number;
  buildHref: (page: number) => string;
};

export function Pagination({ page, limit, total, buildHref }: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / limit));
  if (totalPages <= 1) return null;

  const linkClass =
    "inline-flex h-9 items-center rounded-md border border-input px-3 text-sm hover:bg-accent";
  const disabledClass = "pointer-events-none opacity-40";

  return (
    <nav
      aria-label="Navigasi halaman"
      className="flex items-center justify-between gap-4"
    >
      <Link
        href={buildHref(page - 1)}
        aria-disabled={page <= 1}
        className={cn(linkClass, page <= 1 && disabledClass)}
      >
        Sebelumnya
      </Link>

      <p className="text-sm text-muted-foreground">
        Halaman {page} dari {totalPages}
      </p>

      <Link
        href={buildHref(page + 1)}
        aria-disabled={page >= totalPages}
        className={cn(linkClass, page >= totalPages && disabledClass)}
      >
        Selanjutnya
      </Link>
    </nav>
  );
}
