"use client";

import { SessionProvider } from "next-auth/react";

// CUST-03 (PH-10): menyediakan update() NextAuth di sisi klien supaya sesi bisa
// disegarkan diam-diam setelah nama/email berubah — tanpa memaksa login ulang.
// Sesi awal tetap dibaca di server (auth()); provider ini hanya untuk refresh.
export function AuthProvider({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}
