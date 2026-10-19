import { NextResponse } from "next/server";
import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth/auth.config";

// Next.js 16 mengganti konvensi `middleware` menjadi `proxy`.
// Proxy berjalan di Edge runtime, jadi hanya memakai config edge-safe
// (tanpa Prisma/bcrypt). Proteksi /admin/* ada di callback `authorized`.
const { auth } = NextAuth(authConfig);

// Next.js 16 tidak menyediakan API server untuk membaca pathname (Next 16.4
// hanya mengekspor `headers()` dari `next/server`, tanpa `pathname()`), dan
// dokumentasi Next secara eksplisit menolak pembacaan URL dari Server Component.
// Karena itu pathname disuntikkan di sini, lalu dibaca layout admin lewat
// `headers().get("x-pathname")` untuk breadcrumb navbar. `matcher` di bawah
// sudah membatasi ke /admin/* dan /site-admin/* saja.
//
// Aman dari hydration mismatch: proyek ini tidak memakai `rewrites`, jadi
// `request.nextUrl.pathname` selalu pathname yang benar.
const proxy = auth((request) => {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-pathname", request.nextUrl.pathname);

  // `NextResponse.next({ request: { headers } })` meneruskan header ke Server
  // Component di atas — berbeda dari `NextResponse.next({ headers })` yang
  // hanya mengirim header balasan ke client.
  return NextResponse.next({ request: { headers: requestHeaders } });
});

// Dipakai default export karena Next.js tidak bisa menganalisis export hasil
// destructuring (`export const { auth: proxy } = ...`).
export default proxy;

export const config = {
  matcher: ["/admin/:path*", "/site-admin/:path*"],
};
