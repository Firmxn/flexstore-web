import { hashPassword } from "@/lib/auth/password";
import { consumePasswordResetToken } from "@/lib/auth/tokens";
import { resetPasswordSchema } from "@/lib/auth/validation";
import { prisma } from "@/lib/db/prisma";
import {
  apiError,
  apiSuccess,
  serverError,
  validationError,
} from "@/lib/utils/api";

// AUTH-05 (PH-07): set password baru lewat token sekali pakai.
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = resetPasswordSchema.safeParse(body);
  if (!parsed.success) return validationError(parsed.error);

  const payload = await consumePasswordResetToken(parsed.data.token);
  if (!payload) {
    return apiError(
      "INVALID_TOKEN",
      "Tautan tidak valid atau sudah kedaluwarsa",
      400,
    );
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { id: true, role: true },
    });
    if (!user || user.role === "GUEST") {
      return apiError("INVALID_TOKEN", "Tautan tidak valid", 400);
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { password: await hashPassword(parsed.data.password) },
    });

    return apiSuccess({ ok: true });
  } catch (error) {
    console.error("[api/auth/reset-password] error tak terduga", error);
    return serverError();
  }
}
