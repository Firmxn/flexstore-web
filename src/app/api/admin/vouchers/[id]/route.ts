import { z } from "zod";
import { requireStoreAdmin } from "@/lib/auth/guard";
import {
  deleteVoucher,
  getVoucherById,
  updateVoucher,
  voucherSchema,
} from "@/lib/vouchers";
import { apiError, apiSuccess, notFound, validationError } from "@/lib/utils/api";
import { prismaErrorResponse } from "@/lib/utils/prisma-error";

const idSchema = z.string().uuid();

type Context = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: Context) {
  const guard = await requireStoreAdmin();
  if (!guard.ok) return guard.response;

  const { id } = await context.params;
  if (!idSchema.safeParse(id).success) {
    return apiError("INVALID_ID", "ID tidak valid", 400);
  }

  const voucher = await getVoucherById(id);
  if (!voucher) return notFound("Voucher tidak ditemukan");

  return apiSuccess({ voucher });
}

export async function PATCH(request: Request, context: Context) {
  const guard = await requireStoreAdmin();
  if (!guard.ok) return guard.response;

  const { id } = await context.params;
  if (!idSchema.safeParse(id).success) {
    return apiError("INVALID_ID", "ID tidak valid", 400);
  }

  const body = await request.json().catch(() => null);
  const parsed = voucherSchema.safeParse(body);
  if (!parsed.success) return validationError(parsed.error);

  if (!(await getVoucherById(id))) return notFound("Voucher tidak ditemukan");

  try {
    const voucher = await updateVoucher(id, parsed.data);
    return apiSuccess({ voucher });
  } catch (error) {
    return prismaErrorResponse(error, "api/admin/vouchers/[id]:PATCH", {
      code: "Kode voucher sudah digunakan",
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
    await deleteVoucher(id);
    return apiSuccess({ deleted: true });
  } catch (error) {
    return prismaErrorResponse(error, "api/admin/vouchers/[id]:DELETE");
  }
}
