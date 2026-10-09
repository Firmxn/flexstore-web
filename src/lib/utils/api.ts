import { NextResponse } from "next/server";
import type { ZodError } from "zod";

// Format error seragam (SDD section 8): { error, message, field? }
export function apiError(
  code: string,
  message: string,
  status: number,
  field?: string,
) {
  return NextResponse.json(
    field ? { error: code, message, field } : { error: code, message },
    { status },
  );
}

export function apiSuccess<T>(data: T, status = 200) {
  return NextResponse.json(data, { status });
}

export function validationError(error: ZodError) {
  const first = error.issues[0];
  return apiError(
    "VALIDATION_ERROR",
    first?.message ?? "Data tidak valid",
    400,
    first?.path.join(".") || undefined,
  );
}

export const unauthorized = () =>
  apiError("UNAUTHORIZED", "Anda harus masuk terlebih dahulu", 401);

export const forbidden = () =>
  apiError("FORBIDDEN", "Anda tidak memiliki akses", 403);

export const notFound = (message = "Data tidak ditemukan") =>
  apiError("NOT_FOUND", message, 404);

export const serverError = () =>
  apiError("INTERNAL_ERROR", "Terjadi kesalahan, coba lagi", 500);

// Sinyal internal Next.js (bail out dari prerender, redirect, notFound) memakai
// `digest` berawalan NEXT_ atau DYNAMIC_SERVER_USAGE. Sinyal ini harus
// diteruskan apa adanya; menelannya sebagai 500 merusak alur framework.
function isNextControlFlowError(error: unknown): boolean {
  if (!error || typeof error !== "object") return false;
  const digest = (error as { digest?: unknown }).digest;
  return (
    typeof digest === "string" &&
    (digest.startsWith("NEXT_") || digest === "DYNAMIC_SERVER_USAGE")
  );
}

// Membungkus handler route supaya kegagalan tak terduga (Prisma/Redis) tidak
// bocor sebagai 500 mentah. Detail hanya ke log, pesan generik ke klien
// (SDD section 10: error messages generic to users, detailed to logs only).
export function withRouteErrors(
  handler: () => Promise<NextResponse>,
): Promise<NextResponse> {
  return handler().catch((error) => {
    if (isNextControlFlowError(error)) throw error;
    console.error("[api] unhandled route error", error);
    return serverError();
  });
}
