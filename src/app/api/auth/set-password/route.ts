import { createCustomer, findUserByEmail } from "@/lib/auth/queries";
import { consumeSetPasswordToken } from "@/lib/auth/tokens";
import { setPasswordSchema } from "@/lib/auth/validation";
import { prisma } from "@/lib/db/prisma";
import {
  apiError,
  apiSuccess,
  serverError,
  validationError,
} from "@/lib/utils/api";

// AUTH-04 (PH-07): guest yang mengisi email saat checkout membuat akun customer
// lewat tautan set password. Token sekali pakai; setelah akun dibuat, pesanan
// guest dengan email yang sama diikat ke akun baru supaya riwayatnya tidak
// hilang.
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = setPasswordSchema.safeParse(body);
  if (!parsed.success) return validationError(parsed.error);

  const payload = await consumeSetPasswordToken(parsed.data.token);
  if (!payload) {
    return apiError(
      "INVALID_TOKEN",
      "Tautan tidak valid atau sudah kedaluwarsa",
      400,
    );
  }

  try {
    if (await findUserByEmail(payload.email)) {
      return apiError(
        "EMAIL_TAKEN",
        "Email sudah terdaftar, silakan masuk",
        409,
        "email",
      );
    }

    const user = await createCustomer({
      name: payload.name,
      email: payload.email,
      phone: payload.phone ?? undefined,
      password: parsed.data.password,
    });

    await prisma.order.updateMany({
      where: { guestEmail: payload.email, userId: null },
      data: { userId: user.id },
    });

    return apiSuccess({ id: user.id, email: user.email }, 201);
  } catch (error) {
    console.error("[api/auth/set-password] error tak terduga", error);
    return serverError();
  }
}
