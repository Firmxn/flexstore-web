import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authConfig } from "./auth.config";
import { findUserByEmail, findUserByPhone } from "./queries";
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
});
