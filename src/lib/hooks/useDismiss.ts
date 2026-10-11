"use client";

import { useEffect, useRef } from "react";

// Menutup panel saat pengguna mengklik di luarnya atau menekan Escape.
// Mengembalikan ref yang harus dipasang pada elemen pembungkus panel.
// Callback disimpan di ref supaya langganan listener tidak dibuat ulang
// setiap kali orang merender komponen pemanggil.
export function useDismiss<T extends HTMLElement>(
  open: boolean,
  onDismiss: () => void,
) {
  const ref = useRef<T>(null);
  const onDismissRef = useRef(onDismiss);

  // Penulisan ref harus di dalam effect, bukan saat render (aturan
  // react-hooks/refs). Listener di bawah hanya bergantung pada `open`,
  // jadi langganan tidak dibuat ulang walau callback pemanggil baru.
  useEffect(() => {
    onDismissRef.current = onDismiss;
  }, [onDismiss]);

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: PointerEvent) {
      const target = event.target as Node | null;
      if (!target || !ref.current?.contains(target)) onDismissRef.current();
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onDismissRef.current();
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return ref;
}
