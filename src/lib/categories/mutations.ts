import { prisma } from "@/lib/db/prisma";
import type { CategoryInput } from "./validation";

export function createCategory(input: CategoryInput) {
  return prisma.category.create({ data: input });
}

export function updateCategory(id: string, input: Partial<CategoryInput>) {
  return prisma.category.update({ where: { id }, data: input });
}

export function deleteCategory(id: string) {
  return prisma.category.delete({ where: { id } });
}
