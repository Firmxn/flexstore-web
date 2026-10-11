import { prisma } from "@/lib/db/prisma";
import { hashPassword } from "./password";

export function findUserByEmail(email: string) {
  return prisma.user.findUnique({ where: { email } });
}

// PH-08 (SITE-04): role dan status aktif dibaca ulang dari database pada setiap
// permintaan terlindungi supaya penonaktifan akun berlaku segera, bukan menunggu
// JWT kedaluwarsa (OWASP A07).
export function findUserAccessById(id: string) {
  return prisma.user.findUnique({
    where: { id },
    select: { id: true, role: true, deactivatedAt: true },
  });
}

export function findUserByPhone(phone: string) {
  return prisma.user.findUnique({ where: { phone } });
}

// CUST-03 (PH-10): data kontak terbaru untuk menyegarkan sesi (jwt callback
// `trigger === "update"`) tanpa membaca kolom sensitif seperti password.
export function findUserContactById(id: string) {
  return prisma.user.findUnique({
    where: { id },
    select: { name: true, email: true },
  });
}

export async function createCustomer(input: {
  name: string;
  email: string;
  phone?: string;
  password: string;
}) {
  return prisma.user.create({
    data: {
      name: input.name,
      email: input.email,
      phone: input.phone,
      password: await hashPassword(input.password),
      role: "CUSTOMER",
    },
  });
}
