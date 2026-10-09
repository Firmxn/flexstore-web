import { Prisma } from "@prisma/client";
import { apiError } from "./api";

// Menerjemahkan error Prisma jadi respons API yang ramah pengguna.
// Pesan error detail tetap hanya ke log server (OWASP A09).
export function prismaErrorResponse(
  error: unknown,
  context: string,
  duplicateMessages: Record<string, string> = {},
) {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      const fields = (error.meta?.target as string[] | undefined) ?? [];
      const field = fields.find((name) => duplicateMessages[name]) ?? fields[0];
      const message = field
        ? (duplicateMessages[field] ?? `${field} sudah digunakan`)
        : "Data sudah digunakan";
      return apiError("DUPLICATE", message, 409, field);
    }

    if (error.code === "P2003") {
      return apiError(
        "INVALID_REFERENCE",
        "Data terkait tidak ditemukan",
        400,
      );
    }

    if (error.code === "P2025") {
      return apiError("NOT_FOUND", "Data tidak ditemukan", 404);
    }
  }

  console.error(`[${context}] error tak terduga`, error);
  return apiError("INTERNAL_ERROR", "Terjadi kesalahan, coba lagi", 500);
}
