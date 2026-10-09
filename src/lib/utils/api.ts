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
