import { requireStoreAdmin } from "@/lib/auth/guard";
import {
  createCategory,
  getCategories,
} from "@/lib/categories";
import { categorySchema } from "@/lib/categories/validation";
import {
  apiSuccess,
  validationError,
} from "@/lib/utils/api";
import { prismaErrorResponse } from "@/lib/utils/prisma-error";

export async function GET() {
  const guard = await requireStoreAdmin();
  if (!guard.ok) return guard.response;

  return apiSuccess({ categories: await getCategories() });
}

export async function POST(request: Request) {
  const guard = await requireStoreAdmin();
  if (!guard.ok) return guard.response;

  const body = await request.json().catch(() => null);
  const parsed = categorySchema.safeParse(body);
  if (!parsed.success) return validationError(parsed.error);

  try {
    const category = await createCategory(parsed.data);
    return apiSuccess({ category }, 201);
  } catch (error) {
    return prismaErrorResponse(error, "api/admin/categories:POST", {
      name: "Nama kategori sudah digunakan",
      slug: "Slug sudah digunakan",
    });
  }
}
