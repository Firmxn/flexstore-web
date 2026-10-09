import { Prisma } from "@prisma/client";
import {
  createCustomer,
  findUserByEmail,
  findUserByPhone,
} from "@/lib/auth/queries";
import { registerSchema } from "@/lib/auth/validation";
import {
  apiError,
  apiSuccess,
  serverError,
  validationError,
} from "@/lib/utils/api";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = registerSchema.safeParse(body);

  if (!parsed.success) {
    return validationError(parsed.error);
  }

  const { name, email, phone, password } = parsed.data;

  try {
    if (await findUserByEmail(email)) {
      return apiError("EMAIL_TAKEN", "Email sudah terdaftar", 409, "email");
    }

    if (phone && (await findUserByPhone(phone))) {
      return apiError("PHONE_TAKEN", "Nomor HP sudah terdaftar", 409, "phone");
    }

    const user = await createCustomer({ name, email, phone, password });

    return apiSuccess(
      { id: user.id, name: user.name, email: user.email },
      201,
    );
  } catch (error) {
    // Tangani race condition: dua request mendaftar email/phone yang sama.
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      const target = (error.meta?.target as string[] | undefined) ?? [];
      if (target.includes("phone")) {
        return apiError("PHONE_TAKEN", "Nomor HP sudah terdaftar", 409, "phone");
      }
      return apiError("EMAIL_TAKEN", "Email sudah terdaftar", 409, "email");
    }

    console.error("[api/auth/register] error tak terduga", error);
    return serverError();
  }
}
