import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

// Container bersama untuk halaman storefront. Lebar diseragamkan (`max-w-6xl`)
// supaya konten sejajar dengan Header/Footer dan antar halaman tidak berbeda.
// Varian jarak yang disengaja dikirim lewat `className` (mis. invoice saat
// dicetak memakai `print:*`).
export function PageContainer({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-10",
        className,
      )}
    >
      {children}
    </div>
  );
}
