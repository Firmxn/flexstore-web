"use client";

import { useSyncExternalStore } from "react";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

// Favorit dummy (permintaan pengguna 2026-10-16): tanpa API dan tanpa tabel —
// status disimpan per peramban di localStorage (kunci `flexstore_wishlist`,
// daftar productId). Dibaca lewat useSyncExternalStore supaya aman hydration
// (server selalu `false`, klien mengisi setelah mount) dan bebas setState di
// dalam effect (larangan lint react-hooks/set-state-in-effect).
const STORAGE_KEY = "flexstore_wishlist";
const CHANGE_EVENT = "flexstore:wishlist";

function readFavorites(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed)
      ? parsed.filter((id): id is string => typeof id === "string")
      : [];
  } catch {
    return [];
  }
}

function subscribe(onStoreChange: () => void): () => void {
  // `storage` = perubahan dari tab lain; acara kustom = toggle di tab ini
  // (event storage tidak menyala untuk tab yang menulis).
  window.addEventListener("storage", onStoreChange);
  window.addEventListener(CHANGE_EVENT, onStoreChange);
  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener(CHANGE_EVENT, onStoreChange);
  };
}

const getSnapshot = (productId: string) => readFavorites().includes(productId);
const getServerSnapshot = () => false;

export function WishlistButton({
  productId,
  productName,
}: {
  productId: string;
  productName: string;
}) {
  const active = useSyncExternalStore(
    subscribe,
    () => getSnapshot(productId),
    getServerSnapshot,
  );

  function toggle() {
    const current = readFavorites();
    const next = current.includes(productId)
      ? current.filter((id) => id !== productId)
      : [...current, productId];
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // localStorage nonaktif/kuota penuh: favorit tidak bertahan setelah
      // muat ulang, kegagalan tetap tidak mengganggu aksi kartu lain.
    }
    window.dispatchEvent(new Event(CHANGE_EVENT));
  }

  // z-index hati sengaja z-auto (bukan z-10): header storefront `sticky z-10`
  // — kalau hati ikut z-10, hati (DOM lebih akhir) menimpa navbar saat digulir.
  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      aria-pressed={active}
      aria-label={
        active
          ? `Hapus ${productName} dari favorit`
          : `Tambah ${productName} ke favorit`
      }
      title={active ? "Hapus dari favorit" : "Tambah ke favorit"}
      onClick={toggle}
      className="absolute right-2 top-2 size-9 rounded-full bg-background/80 backdrop-blur"
    >
      <Heart
        className={
          active
            ? "size-4 fill-red-500 text-red-500"
            : "size-4 text-muted-foreground"
        }
      />
    </Button>
  );
}
