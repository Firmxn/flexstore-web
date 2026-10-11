import Link from "next/link";
import { cn } from "@/lib/utils/cn";

type CategoryPill = { name: string; slug: string };

// Pil filter kategori di katalog. `preserve` menampung query lain yang aktif
// (search, minPrice, maxPrice, sort) supaya tidak hilang saat berpindah kategori.
export function CategoryPills({
  categories,
  activeSlug,
  preserve,
}: {
  categories: CategoryPill[];
  activeSlug: string | null;
  preserve: Record<string, string | undefined>;
}) {
  function href(slug: string | null): string {
    const query = new URLSearchParams();
    for (const [key, value] of Object.entries(preserve)) {
      if (value) query.set(key, value);
    }
    if (slug) query.set("category", slug);
    const qs = query.toString();
    return qs ? `/products?${qs}` : "/products";
  }

  const items: { label: string; slug: string | null }[] = [
    { label: "Semua Produk", slug: null },
    ...categories.map((category) => ({
      label: category.name,
      slug: category.slug,
    })),
  ];

  return (
    <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
      {items.map((item) => {
        const active = item.slug === activeSlug;
        return (
          <Link
            key={item.slug ?? "all"}
            href={href(item.slug)}
            className={cn(
              "shrink-0 rounded-full px-4 py-2 text-sm transition-colors",
              active
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-accent hover:text-foreground",
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </div>
  );
}
