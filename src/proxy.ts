import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth/auth.config";

// Next.js 16 mengganti konvensi `middleware` menjadi `proxy`.
// Proxy berjalan di Edge runtime, jadi hanya memakai config edge-safe
// (tanpa Prisma/bcrypt). Proteksi /admin/* ada di callback `authorized`.
// Dipakai default export karena Next.js tidak bisa menganalisis export hasil
// destructuring (`export const { auth: proxy } = ...`).
const { auth } = NextAuth(authConfig);

export default auth;

export const config = {
  matcher: ["/admin/:path*", "/site-admin/:path*"],
};
