import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authConfig } from "./auth.config";
import {
  findUserByEmail,
  findUserByPhone,
  findUserContactById,
} from "./queries";
import { loginSchema } from "./validation";
import { verifyPassword, wasteTimeLikeVerify } from "./password";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        identifier: { label: "Email atau Nomor HP", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const { identifier, password } = parsed.data;
        // Identifier sudah disingkat bentuknya oleh loginSchema: email
        // (lowercase) atau nomor HP (format +62) — biar pencocokan akun
        // tepat kolomnya, bukan keduanya sekaligus.
        const user =
          identifier.kind === "email"
            ? await findUserByEmail(identifier.value)
            : await findUserByPhone(identifier.value);

        if (!user?.password) {
          await wasteTimeLikeVerify(password);
          return null;
        }

        const passwordValid = await verifyPassword(password, user.password);
        if (!passwordValid) return null;

        if (user.role === "GUEST") return null;
        // PH-08 (SITE-04): akun yang dinonaktifkan Site Admin tidak bisa masuk.
        if (user.deactivatedAt) return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,
    // CUST-03 (PH-10): sesi disegarkan diam-diam setelah nama/email berubah.
    // Klien memanggil update() NextAuth (trigger "update"); data terbaru dibaca
    // ulang dari database. Callback ini hidup di config Node (boleh Prisma),
    // bukan di auth.config.ts yang edge-safe untuk proxy.
    async jwt({ token, user, trigger }) {
      if (user) {
        token.id = user.id as string;
        token.role = user.role;
        token.name = user.name;
        token.email = user.email;
      }

      if (trigger === "update" && typeof token.id === "string") {
        const fresh = await findUserContactById(token.id);
        if (fresh) {
          token.name = fresh.name;
          token.email = fresh.email;
        }
      }

      return token;
    },
  },
});
