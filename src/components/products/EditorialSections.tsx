"use client";

// PROD-07 — seksi editorial detail produk: (1) VideoHero full-width di bawah
// grid, (2) ProductStory dua kolom gambar+narasi, (3) Lookbook grid 4 foto.
// Semua opsional: seksi tanpa data tidak dirender sama sekali (AC-PROD-07-01).
// "use client" karena `<video>` memakai handler onError untuk fallback.
import Image from "next/image";
import { useState } from "react";

export type EditorialData = {
  videoHeroUrl: string | null;
  videoHeroAutoplay: boolean;
  storyText: string | null;
  storyImageUrl: string | null;
  lookbookUrls: string[];
  productName: string;
  description: string | null;
};

export function EditorialSections({
  videoHeroUrl,
  videoHeroAutoplay,
  storyText,
  storyImageUrl,
  lookbookUrls,
  productName,
  description,
}: EditorialData) {
  const hasVideo = Boolean(videoHeroUrl);
  // Narasi tampil bila storyText terisi; storyText kosong tapi gambar STORY ada
  // → jatuh ke description (keputusan pengguna, docs/04 bagian 10).
  const narrative = storyText || (!storyImageUrl ? "" : description) || "";
  const hasStory = Boolean(storyImageUrl) || Boolean(storyText);
  const hasLookbook = lookbookUrls.length > 0;

  if (!hasVideo && !hasStory && !hasLookbook) return null;

  return (
    <div className="flex flex-col gap-8 pt-4">
      {hasVideo ? (
        <VideoHero url={videoHeroUrl!} autoplay={videoHeroAutoplay} />
      ) : null}

      {hasStory ? (
        <section
          aria-label="Cerita produk"
          className="grid gap-6 sm:grid-cols-2"
        >
          {storyImageUrl ? (
            <div className="relative aspect-square overflow-hidden rounded-xl border border-border bg-muted">
              <Image
                src={storyImageUrl}
                alt={`Cerita ${productName}`}
                fill
                sizes="(max-width: 640px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          ) : null}

          <div className="flex flex-col gap-2 sm:justify-center">
            <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              {productName}
            </p>
            {narrative ? (
              <p className="whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
                {narrative}
              </p>
            ) : null}
          </div>
        </section>
      ) : null}

      {hasLookbook ? (
        <section aria-label="Lookbook" className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {lookbookUrls.map((url, index) => (
            <div
              key={url}
              className="relative aspect-square overflow-hidden rounded-lg border border-border bg-muted"
            >
              <Image
                src={url}
                alt={`${productName} lookbook ${index + 1}`}
                fill
                sizes="(max-width: 640px) 50vw, 25vw"
                className="object-cover"
              />
            </div>
          ))}
        </section>
      ) : null}
    </div>
  );
}

function VideoHero({ url, autoplay }: { url: string; autoplay: boolean }) {
  const [failed, setFailed] = useState(false);

  return (
    <section
      aria-label="Video produk"
      className="relative aspect-video w-full overflow-hidden rounded-xl border border-border bg-muted"
    >
      {failed ? (
        // URL mati: bingkai bg-muted tetap, tanpa galat besar (AC bagian 8).
        <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
          Video tidak tersedia
        </div>
      ) : (
        <video
          // Galat media pada URL mati bisa terjadi SEBELUM hidrasi selesai
          // sehingga `onError` React terlewat; ref callback memeriksa `error`
          // yang sudah tersimpan saat elemen terpasang.
          ref={(element) => {
            if (element?.error) setFailed(true);
          }}
          src={url}
          className="h-full w-full object-cover"
          // Selalu senyap; admin hanya mengontrol autoplay (keputusan pengguna).
          // Tanpa autoplay video diberi kontrol bawaan supaya tetap bisa diputar.
          autoPlay={autoplay}
          muted
          loop={autoplay}
          playsInline
          controls={!autoplay}
          onError={() => setFailed(true)}
        />
      )}
    </section>
  );
}
