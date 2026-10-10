import { siteDescription } from "@/lib/site";

// Footer sengaja tidak memuat link navigasi: tautan sudah ada di navbar dan
// menu akun, jadi diulang di sini hanya menimbulkan duplikasi.
export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1">
          <p className="font-semibold text-foreground">FlexStore</p>
          <p>{siteDescription}</p>
        </div>
        {/* Tahun sengaja tidak ditulis: `new Date()` membuat bagian statis
            route lain (mis. /orders/[id]) gagal diprerender. */}
        <p>© FlexStore</p>
      </div>
    </footer>
  );
}
