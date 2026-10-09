import { prisma } from "@/lib/db/prisma";
import type { BrandInput } from "./validation";

export function createBrand(input: BrandInput) {
  return prisma.brand.create({ data: input });
}

export function updateBrand(id: string, input: Partial<BrandInput>) {
  return prisma.brand.update({ where: { id }, data: input });
}

export function deleteBrand(id: string) {
  return prisma.brand.delete({ where: { id } });
}
