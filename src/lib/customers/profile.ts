import { hashPassword, verifyPassword } from "@/lib/auth/password";
import { prisma } from "@/lib/db/prisma";

// CUST-03 (PH-10): data akun customer. Semua operasi mensyaratkan `userId`
// pemanggil sehingga akun lain tidak pernah tersentuh (OWASP A01).

export type AccountProfile = {
  name: string;
  email: string | null;
};

export function getAccountProfile(userId: string): Promise<AccountProfile | null> {
  return prisma.user.findUnique({
    where: { id: userId },
    select: { name: true, email: true },
  });
}

export function updateAccountName(userId: string, name: string) {
  return prisma.user.update({ where: { id: userId }, data: { name } });
}

// Dipakai saat memeriksa bentrok email (OWASP A01: hanya id yang diambil).
export function findUserIdByEmail(email: string) {
  return prisma.user.findUnique({
    where: { email },
    select: { id: true },
  });
}

// Perubahan email hanya terjadi lewat verifikasi token (lihat /api/auth/verify-email).
export function updateAccountEmail(userId: string, email: string) {
  return prisma.user.update({ where: { id: userId }, data: { email } });
}

export type PasswordChangeResult =
  | { ok: true }
  | { ok: false; code: "INVALID_PASSWORD" };

// Password lama langsung tidak berlaku setelah berhasil diganti; sesi lain
// tidak dipaksa logout (keputusan pengguna 2026-10-11, docs/03 CUST-03 bagian 13).
export async function updateAccountPassword(
  userId: string,
  currentPassword: string,
  newPassword: string,
): Promise<PasswordChangeResult> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { password: true },
  });

  if (!user?.password) return { ok: false, code: "INVALID_PASSWORD" };

  const valid = await verifyPassword(currentPassword, user.password);
  if (!valid) return { ok: false, code: "INVALID_PASSWORD" };

  await prisma.user.update({
    where: { id: userId },
    data: { password: await hashPassword(newPassword) },
  });

  return { ok: true };
}
