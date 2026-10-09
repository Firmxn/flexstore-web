// Helper fetch untuk Client Component.
// Menerjemahkan bentuk error API (SDD section 8: { error, message, field? })
// menjadi ApiError yang seragam, sehingga pesan ke pengguna tetap generik.

export type ApiErrorBody = {
  error: string;
  message: string;
  field?: string;
};

export class ApiError extends Error {
  readonly code: string;
  readonly field?: string;
  readonly status: number;

  constructor(body: ApiErrorBody, status: number) {
    super(body.message);
    this.name = "ApiError";
    this.code = body.error;
    this.field = body.field;
    this.status = status;
  }
}

export async function apiRequest<T>(
  input: string,
  init?: RequestInit,
): Promise<T> {
  const response = await fetch(input, {
    ...init,
    headers: {
      ...(init?.body ? { "Content-Type": "application/json" } : {}),
      ...init?.headers,
    },
  });

  const payload: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    const body =
      payload && typeof payload === "object" && "message" in payload
        ? (payload as ApiErrorBody)
        : { error: "INTERNAL_ERROR", message: "Terjadi kesalahan, coba lagi" };

    throw new ApiError(body, response.status);
  }

  return payload as T;
}

// Selalu tampilkan pesan dari server (sudah generik); jangan bocorkan detail internal.
export function toErrorMessage(error: unknown): string {
  if (error instanceof ApiError) return error.message;
  return "Terjadi kesalahan, coba lagi";
}
