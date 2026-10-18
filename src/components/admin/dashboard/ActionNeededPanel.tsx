import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { cn } from "@/lib/utils/cn";
import type { ActionNeededItem } from "@/lib/admin/dashboard-queries";

// Warna penanda status memakai token (primary/destructive/muted) — mengikuti
// kustomisasi palet brand, tanpa warna hardcode.
const TONE_DOT: Record<ActionNeededItem["tone"], string> = {
  primary: "bg-primary",
  destructive: "bg-destructive",
  muted: "bg-muted-foreground",
};

const TONE_COUNT: Record<ActionNeededItem["tone"], string> = {
  primary: "text-primary",
  destructive: "text-destructive",
  muted: "text-muted-foreground",
};

export function ActionNeededPanel({
  items,
  title,
  description,
}: {
  items: ActionNeededItem[];
  title: string;
  description?: string;
}) {
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">{title}</CardTitle>
        {description ? <CardDescription>{description}</CardDescription> : null}
      </CardHeader>
      <CardContent className="flex flex-col gap-1">
        {items.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="flex items-start gap-3 rounded-lg px-2 py-2.5 transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <span
              className={cn(
                "mt-1.5 h-2 w-2 shrink-0 rounded-full",
                TONE_DOT[item.tone],
              )}
              aria-hidden="true"
            />
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-medium">{item.label}</span>
              <span className="block text-xs text-muted-foreground">
                {item.description}
              </span>
            </span>
            <span
              className={cn(
                "text-xs font-semibold tabular-nums",
                TONE_COUNT[item.tone],
              )}
            >
              {item.count}
            </span>
          </Link>
        ))}
      </CardContent>
    </Card>
  );
}
