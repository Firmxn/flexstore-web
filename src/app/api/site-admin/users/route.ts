import { Prisma } from "@prisma/client";
import { requireSiteAdmin } from "@/lib/auth/guard";
import {
  createStoreAdmin,
  createStoreAdminSchema,
  listStoreAdmins,
} from "@/lib/platform";
import {
  apiError,
  apiSuccess,
  validationError,
  withRouteErrors,
} from "@/lib/utils/api";

// SITE-04 (PH-08): Site Admin mengelola akun Store Admin (PRD 2.4).
export async function GET() {
  return withRouteErrors(async () => {
    const guard = await requireSiteAdmin();
    if (!guard.ok) return guard.response;

    const users = await listStoreAdmins();
    return apiSuccess({ users });
  });
}

export async function POST(request: Request) {
  return withRouteErrors(async () => {
    const guard = await requireSiteAdmin();
    if (!guard.ok) return guard.response;

    const body = await request.json().catch(() => null);
    const parsed = createStoreAdminSchema.safeParse(body);
    if (!parsed.success) return validationError(parsed.error);

    try {
      const user = await createStoreAdmin(parsed.data);
      return apiSuccess({ user }, 201);
    } catch (error) {
      // Race condition: dua permintaan membuat email yang sama.
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        return apiError("EMAIL_TAKEN", "Email sudah terdaftar", 409, "email");
      }
      throw error;
    }
  });
}
