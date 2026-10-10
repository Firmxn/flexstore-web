import { requireStoreAdmin } from "@/lib/auth/guard";
import {
  createVoucher,
  getVouchers,
  voucherListQuerySchema,
  voucherSchema,
} from "@/lib/vouchers";
import { apiSuccess, validationError } from "@/lib/utils/api";
import { prismaErrorResponse } from "@/lib/utils/prisma-error";

export async function GET(request: Request) {
  const guard = await requireStoreAdmin();
  if (!guard.ok) return guard.response;

  const searchParams = Object.fromEntries(new URL(request.url).searchParams);
  const parsed = voucherListQuerySchema.safeParse(searchParams);
  if (!parsed.success) return validationError(parsed.error);

  const result = await getVouchers(parsed.data);
  return apiSuccess(result);
}

export async function POST(request: Request) {
  const guard = await requireStoreAdmin();
  if (!guard.ok) return guard.response;

  const body = await request.json().catch(() => null);
  const parsed = voucherSchema.safeParse(body);
  if (!parsed.success) return validationError(parsed.error);

  try {
    const voucher = await createVoucher(parsed.data);
    return apiSuccess({ voucher }, 201);
  } catch (error) {
    return prismaErrorResponse(error, "api/admin/vouchers:POST", {
      code: "Kode voucher sudah digunakan",
    });
  }
}
