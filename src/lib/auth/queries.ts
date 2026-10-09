import { prisma } from "@/lib/db/prisma";
import { hashPassword } from "./password";

export function findUserByIdentifier(identifier: string) {
  return prisma.user.findFirst({
    where: {
      OR: [{ email: identifier }, { phone: identifier }],
    },
  });
}

export function findUserByEmail(email: string) {
  return prisma.user.findUnique({ where: { email } });
}

export function findUserByPhone(phone: string) {
  return prisma.user.findUnique({ where: { phone } });
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
