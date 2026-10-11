import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db/prisma";
import {
  getGuestAccessPhone,
  isUuid,
  orderCancelRequestSchema,
  requestOrderCancellation,
} from "@/lib/orders";
import {
  apiError,
  apiSuccess,
  forbidden,
  notFound,
  validationError,
  withRouteErrors,
} from "@/lib/utils/api";

const idSchema = z.string().uuid();

type Context = { params: Promise<{ id: string }> };

// Pengajuan pembatalan oleh pembeli (ORDER-05, PRD 5.5). Customer memakai sesi;
// guest memakai cookie akses bertanda-tangan (nomor HP terverifikasi). Pesanan
// milik pihak lain dijawab 404 generik supaya keberadaannya tidak bocor.
export async function POST(request: Request, context: Context) {
  return withRouteErrors(async () => {
    const session = await auth();
    const user = session?.user ?? null;
    if (user && user.role !== "CUSTOMER") return forbidden();

    const { id } = await context.params;
    if (!idSchema.safeParse(id).success || !isUuid(id)) {
      return apiError("INVALID_ID", "ID tidak valid", 400);
    }

    const body = await request.json().catch(() => null);
    const parsed = orderCancelRequestSchema.safeParse(body);
    if (!parsed.success) return validationError(parsed.error);

    const order = await prisma.order.findUnique({
      where: { id },
      select: { userId: true, guestPhone: true },
    });
    if (!order) return notFound("Pesanan tidak ditemukan");

    let authorized = false;
    if (user) {
      authorized = order.userId === user.id;
    } else {
      const phone = await getGuestAccessPhone();
      authorized =
        order.userId === null && phone !== null && order.guestPhone === phone;
    }
    if (!authorized) return notFound("Pesanan tidak ditemukan");

    const result = await requestOrderCancellation(id, parsed.data.reason);
    if (!result.ok) return apiError(result.code, result.message, 409);

    return apiSuccess({ ok: true });
  });
}
