import { requireStoreAdmin } from "@/lib/auth/guard";
import { brandSchema } from "@/lib/brands/validation";
import { createBrand, getBrands } from "@/lib/brands";
import { apiSuccess, validationError } from "@/lib/utils/api";
import { prismaErrorResponse } from "@/lib/utils/prisma-error";

export async function GET() {
  const guard = await requireStoreAdmin();
  if (!guard.ok) return guard.response;

  return apiSuccess({ brands: await getBrands() });
}

export async function POST(request: Request) {
  const guard = await requireStoreAdmin();
  if (!guard.ok) return guard.response;

  const body = await request.json().catch(() => null);
  const parsed = brandSchema.safeParse(body);
  if (!parsed.success) return validationError(parsed.error);

  try {
    const brand = await createBrand(parsed.data);
    return apiSuccess({ brand }, 201);
  } catch (error) {
    return prismaErrorResponse(error, "api/admin/brands:POST", {
      name: "Nama brand sudah digunakan",
      slug: "Slug sudah digunakan",
    });
  }
}
