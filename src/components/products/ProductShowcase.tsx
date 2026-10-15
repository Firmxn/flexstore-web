"use client";

// Induk klien halaman detail (PROD-06): memegang state varian terpilih dan
// menyambungkannya ke galeri carousel serta form beli. Galeri memakai
// transisi CSS translate sederhana (KISS — pustaka carousel baru tidak
// dipakai; keputusan dicatat docs/04). Bagan ukuran tidak masuk carousel:
// tautan kecil bergaya BackLink di kanan bawah form membuka dialog.
import Image from "next/image";
import { useMemo, useState, type ReactNode } from "react";
import { AddToCartForm } from "@/components/cart/AddToCartForm";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils/cn";

type GalleryImage = { id: string; url: string };
type VariantMedia = { variantId: string; variantName: string; imageUrl: string | null };
type VariantOption = {
  id: string;
  name: string;
  sku: string;
  price: number;
  stock: number;
};
type Slide = { key: string; url: string; alt: string };

export function ProductShowcase({
  productName,
  gallery,
  variantMedia,
  variants,
  sizeChartUrl,
  children,
}: {
  productName: string;
  gallery: GalleryImage[];
  variantMedia: VariantMedia[];
  variants: VariantOption[];
  sizeChartUrl: string | null;
  // Konten kolom kanan bagian atas (kategori, judul, stok, deskripsi) tetap
  // dirender sebagai Server Component children.
  children: ReactNode;
}) {
  const defaultVariantId =
    variants.find((variant) => variant.stock > 0)?.id ?? variants[0]?.id ?? null;
  // `seq` bertambah setiap varian diganti: galeri memakai penanda ini untuk
  // membedakan navigasi manual yang masih berlaku dari pilihan varian baru.
  const [selection, setSelection] = useState(() => ({
    variantId: defaultVariantId,
    seq: 0,
  }));

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <ProductGallery
        productName={productName}
        gallery={gallery}
        variantMedia={variantMedia}
        selection={selection}
      />
      <div className="flex flex-col gap-5">
        {children}
        <AddToCartForm
          variants={variants}
          initialVariantId={selection.variantId ?? undefined}
          onVariantChange={(variantId) =>
            setSelection((previous) => ({
              variantId,
              seq: previous.seq + 1,
            }))
          }
        />
        {sizeChartUrl ? (
          <div className="flex justify-end">
            <SizeChartTrigger url={sizeChartUrl} productName={productName} />
          </div>
        ) : null}
      </div>
    </div>
  );
}

function ProductGallery({
  productName,
  gallery,
  variantMedia,
  selection,
}: {
  productName: string;
  gallery: GalleryImage[];
  variantMedia: VariantMedia[];
  selection: { variantId: string | null; seq: number };
}) {
  // Slide = gambar utama + gambar varian yang belum ada di galeri. Varian
  // tanpa imageUrl tidak menambah slide (PROD-06 bagian 7).
  const slides = useMemo<Slide[]>(() => {
    const list: Slide[] = [];
    const seen = new Set<string>();

    for (const image of gallery) {
      if (seen.has(image.url)) continue;
      seen.add(image.url);
      list.push({ key: image.id, url: image.url, alt: productName });
    }

    for (const variant of variantMedia) {
      if (!variant.imageUrl || seen.has(variant.imageUrl)) continue;
      seen.add(variant.imageUrl);
      list.push({
        key: `variant-${variant.variantId}`,
        url: variant.imageUrl,
        alt: `${productName} - ${variant.variantName}`,
      });
    }

    return list;
  }, [gallery, variantMedia, productName]);

  // Slide aktif diturunkan (bukan effect): pilihan varian baru selalu
  // menggeser slide ke gambar varian (atau ke slide gambar utama bila varian
  // tanpa gambar — AC-PROD-06-01/02); navigasi manual hanya berlaku untuk
  // `seq` pilihan yang sama (AC-PROD-06-03).
  const [manual, setManual] = useState<{ seq: number; index: number } | null>(
    null,
  );
  const variant = variantMedia.find(
    (item) => item.variantId === selection.variantId,
  );
  const variantIndex = variant?.imageUrl
    ? slides.findIndex((slide) => slide.url === variant.imageUrl)
    : -1;
  const active =
    manual && manual.seq === selection.seq
      ? manual.index
      : variantIndex >= 0
        ? variantIndex
        : 0;

  if (slides.length === 0) {
    return (
      <div className="flex aspect-square items-center justify-center rounded-xl border border-dashed border-border text-sm text-muted-foreground">
        Tanpa gambar
      </div>
    );
  }

  const goPrevious = () =>
    setManual({
      seq: selection.seq,
      index: (active - 1 + slides.length) % slides.length,
    });
  const goNext = () =>
    setManual({
      seq: selection.seq,
      index: (active + 1) % slides.length,
    });

  // Strip thumbnail = slide selain yang sedang tampil (keputusan pengguna
  // 2026-10-15): 5 gambar tampil sebagai 1 besar + 4 kecil, bukan 1 besar + 5
  // kecil yang membuat jumlah kotak terlihat lebih banyak dari jumlah gambar.
  const thumbs = slides
    .map((slide, index) => ({ slide, index }))
    .filter((item) => item.index !== active);

  return (
    <div className="flex flex-col gap-3">
      <div className="group relative aspect-square overflow-hidden rounded-2xl border border-border bg-muted">
        <div
          className="flex h-full w-full transition-transform duration-300 ease-out"
          style={{ transform: `translateX(-${active * 100}%)` }}
        >
          {slides.map((slide) => (
            <div key={slide.key} className="relative h-full w-full shrink-0">
              <Image
                src={slide.url}
                alt={slide.alt}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
                // Gambar rusak (URL mati) hanya menyisakan bingkai bg-muted —
                // carousel tetap hidup (AC-PROD-06-05).
                onError={(event) => {
                  event.currentTarget.style.visibility = "hidden";
                }}
                priority={slide === slides[0]}
              />
            </div>
          ))}
        </div>

        {slides.length > 1 ? (
          <>
            <GalleryArrow direction="left" onClick={goPrevious} />
            <GalleryArrow direction="right" onClick={goNext} />
          </>
        ) : null}
      </div>

      {thumbs.length > 0 ? (
        // Strip = slide selain yang sedang tampil di kotak besar, supaya jumlah
        // kotak sama dengan jumlah gambar (5 gambar = 1 besar + 4 kecil) dan
        // tidak ada gambar yang tampil dua kali (keputusan pengguna 2026-10-15).
        // 4 gambar tetap satu baris (tata letak lama); 5 kotak dijejerkan satu
        // baris juga supaya tidak ada sisa menggantung.
        <div
          className={cn(
            "grid gap-3",
            thumbs.length === 5 ? "grid-cols-5" : "grid-cols-4",
          )}
        >
          {thumbs.map(({ slide, index }) => (
            <button
              key={slide.key}
              type="button"
              aria-label={`Gambar ${index + 1}`}
              onClick={() => setManual({ seq: selection.seq, index })}
              className="relative aspect-square overflow-hidden rounded-2xl border border-border bg-muted opacity-80 hover:opacity-100"
            >
              <Image
                src={slide.url}
                alt={slide.alt}
                fill
                sizes="120px"
                className="object-cover"
                onError={(event) => {
                  event.currentTarget.style.visibility = "hidden";
                }}
              />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function GalleryArrow({
  direction,
  onClick,
}: {
  direction: "left" | "right";
  onClick: () => void;
}) {
  const isLeft = direction === "left";
  return (
    <button
      type="button"
      aria-label={isLeft ? "Gambar sebelumnya" : "Gambar berikutnya"}
      onClick={onClick}
      className={cn(
        "absolute top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-background/80 text-lg shadow-sm transition-opacity",
        isLeft ? "left-3" : "right-3",
        "opacity-0 group-hover:opacity-100 focus-visible:opacity-100",
      )}
    >
      {isLeft ? "‹" : "›"}
    </button>
  );
}

function SizeChartTrigger({
  url,
  productName,
}: {
  url: string;
  productName: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground"
      >
        Lihat bagan ukuran
      </button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Bagan Ukuran</DialogTitle>
            <DialogDescription>Ukuran {productName}</DialogDescription>
          </DialogHeader>
          <div className="max-h-[70vh] overflow-y-auto">
            <Image
              src={url}
              alt={`Bagan ukuran ${productName}`}
              width={1200}
              height={1600}
              className="h-auto w-full object-contain"
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
