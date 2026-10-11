import type { NextAuthConfig } from "next-auth";
import type { Role } from "@prisma/client";

// Payload yang kita simpan di dalam JWT.
// Auth.js mendeklarasikan interface `JWT` di @auth/core/jwt (transitive
// dependency pnpm, tidak ada di node_modules root), jadi `declare module`
// dari proyek ini tidak menjangkaunya. Karena itu payload dibaca lewat tipe
// lokal di bawah, bukan lewat module augmentation.
type SessionToken = {
  id?: string;
  role?: Role;
};

const asSessionToken = (token: unknown): SessionToken =>
  token as SessionToken;

// Config edge-safe: TIDAK boleh import Prisma/bcrypt.
// Dipakai middleware (Edge runtime) dan di-extend oleh config penuh di ./index.ts
export const authConfig = {
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  pages: {
    signIn: "/login",
  },
  providers: [],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const path = nextUrl.pathname;
      // PH-08 (SITE-00): dua area terpisah — /admin untuk Store Admin,
      // /site-admin untuk Site Admin. Pemisahan ketat sesuai PRD 2.4.
      const isSiteAdminRoute = path.startsWith("/site-admin");
      const isAdminRoute = path.startsWith("/admin");
      if (!isAdminRoute && !isSiteAdminRoute) return true;

      const user = auth?.user;
      if (!user) return false;

      if (isSiteAdminRoute) {
        if (user.role === "SITE_ADMIN") return true;
        return Response.redirect(
          new URL(user.role === "STORE_ADMIN" ? "/admin" : "/", nextUrl),
        );
      }

      if (user.role === "STORE_ADMIN") return true;
      return Response.redirect(
        new URL(user.role === "SITE_ADMIN" ? "/site-admin" : "/", nextUrl),
      );
    },
    jwt({ token, user }) {
      if (user) {
        token.id = user.id as string;
        token.role = user.role;
      }
      return token;
    },
    session({ session, token }) {
      const { id, role } = asSessionToken(token);
      if (id) session.user.id = id;
      if (role) session.user.role = role;
      return session;
    },
  },
} satisfies NextAuthConfig;
