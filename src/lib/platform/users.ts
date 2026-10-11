import { hashPassword } from "@/lib/auth/password";
import { prisma } from "@/lib/db/prisma";
import type { CreateStoreAdminInput, UpdateStoreAdminInput } from "./validation";

// SITE-04 (PH-08): Site Admin mengelola akun Store Admin (PRD 2.4). Cakupan
// sengaja dibatasi ke role STORE_ADMIN; akun Site Admin dikelola lewat seed.

const storeAdminSelect = {
  id: true,
  name: true,
  email: true,
  deactivatedAt: true,
  createdAt: true,
} as const;

export function listStoreAdmins() {
  return prisma.user.findMany({
    where: { role: "STORE_ADMIN" },
    select: storeAdminSelect,
    orderBy: { createdAt: "asc" },
  });
}

export async function createStoreAdmin(input: CreateStoreAdminInput) {
  return prisma.user.create({
    data: {
      name: input.name,
      email: input.email,
      password: await hashPassword(input.password),
      role: "STORE_ADMIN",
    },
    select: storeAdminSelect,
  });
}

// Target wajib ber-role STORE_ADMIN; akun Site Admin/Customer mengembalikan
// `null` supaya handler menjawab 404 (bukan 403, agar keberadaan akun lain
// tidak bocor).
export function findStoreAdmin(id: string) {
  return prisma.user.findFirst({
    where: { id, role: "STORE_ADMIN" },
    select: { id: true, deactivatedAt: true },
  });
}

export async function updateStoreAdmin(
  id: string,
  input: UpdateStoreAdminInput,
): Promise<number> {
  const data: { deactivatedAt?: Date | null; password?: string } = {};

  if (input.active !== undefined) {
    data.deactivatedAt = input.active ? null : new Date();
  }
  if (input.password !== undefined) {
    data.password = await hashPassword(input.password);
  }

  // `updateMany` + cek count: `update` melempar P2025 kalau baris hilang.
  const result = await prisma.user.updateMany({
    where: { id, role: "STORE_ADMIN" },
    data,
  });
  return result.count;
}
