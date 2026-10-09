import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authConfig } from "./auth.config";
import { findUserByIdentifier } from "./queries";
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
        const user = await findUserByIdentifier(identifier);

        if (!user?.password) {
          await wasteTimeLikeVerify(password);
          return null;
        }

        const passwordValid = await verifyPassword(password, user.password);
        if (!passwordValid) return null;

        if (user.role === "GUEST") return null;

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
