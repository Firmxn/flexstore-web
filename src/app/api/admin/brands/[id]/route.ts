import { z } from "zod";
import { requireStoreAdmin } from "@/lib/auth/guard";
import { deleteBrand, updateBrand } from "@/lib/brands";
import { brandUpdateSchema } from "@/lib/brands/validation";
import { apiError, apiSuccess, validationError } from "@/lib/utils/api";
import { prismaErrorResponse } from "@/lib/utils/prisma-error";

const idSchema = z.string().uuid();

type Context = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, context: Context) {
  const guard = await requireStoreAdmin();
  if (!guard.ok) return guard.response;

  const { id } = await context.params;
  if (!idSchema.safeParse(id).success) {
    return apiError("INVALID_ID", "ID tidak valid", 400);
  }

  const body = await request.json().catch(() => null);
  const parsed = brandUpdateSchema.safeParse(body);
  if (!parsed.success) return validationError(parsed.error);
  if (Object.keys(parsed.data).length === 0) {
    return apiError("EMPTY_UPDATE", "Tidak ada data yang diubah", 400);
  }

  try {
    const brand = await updateBrand(id, parsed.data);
    return apiSuccess({ brand });
  } catch (error) {
    return prismaErrorResponse(error, "api/admin/brands/[id]:PATCH", {
      name: "Nama brand sudah digunakan",
      slug: "Slug sudah digunakan",
    });
  }
}

export async function DELETE(_request: Request, context: Context) {
  const guard = await requireStoreAdmin();
  if (!guard.ok) return guard.response;

  const { id } = await context.params;
  if (!idSchema.safeParse(id).success) {
    return apiError("INVALID_ID", "ID tidak valid", 400);
  }

  try {
    await deleteBrand(id);
    return apiSuccess({ deleted: true });
  } catch (error) {
    return prismaErrorResponse(error, "api/admin/brands/[id]:DELETE");
  }
}
