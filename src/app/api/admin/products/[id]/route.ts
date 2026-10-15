import { z } from "zod";
import { Prisma } from "@prisma/client";
import { requireStoreAdmin } from "@/lib/auth/guard";
import { getBrandById } from "@/lib/brands";
import { getCategoryById } from "@/lib/categories";
import {
  countCartItemsForProduct,
  deleteProduct,
  getProductById,
  updateProduct,
} from "@/lib/products";
import { productSchema } from "@/lib/products/validation";
import { apiError, apiSuccess, notFound, validationError } from "@/lib/utils/api";
import { prismaErrorResponse } from "@/lib/utils/prisma-error";

const idSchema = z.string().uuid();

type Context = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: Context) {
  const guard = await requireStoreAdmin();
  if (!guard.ok) return guard.response;

  const { id } = await context.params;
  if (!idSchema.safeParse(id).success) {
    return apiError("INVALID_ID", "ID tidak valid", 400);
  }

  const product = await getProductById(id);
  if (!product) return notFound("Produk tidak ditemukan");

  return apiSuccess({ product });
}

export async function PATCH(request: Request, context: Context) {
  const guard = await requireStoreAdmin();
  if (!guard.ok) return guard.response;

  const { id } = await context.params;
  if (!idSchema.safeParse(id).success) {
    return apiError("INVALID_ID", "ID tidak valid", 400);
  }

  const body = await request.json().catch(() => null);
  const parsed = productSchema.safeParse(body);
  if (!parsed.success) return validationError(parsed.error);

  const input = parsed.data;

  if (!(await getProductById(id))) {
    return notFound("Produk tidak ditemukan");
  }

  if (!(await getCategoryById(input.categoryId))) {
    return apiError("INVALID_CATEGORY", "Kategori tidak valid", 400, "categoryId");
  }

  if (input.brandId && !(await getBrandById(input.brandId))) {
    return apiError("INVALID_BRAND", "Brand tidak valid", 400, "brandId");
  }

  try {
    const product = await updateProduct(id, input);
    return apiSuccess({ product });
  } catch (error) {
    return prismaErrorResponse(error, "api/admin/products/[id]:PATCH", {
      slug: "Slug sudah digunakan",
      sku: "SKU sudah digunakan",
    });
  }
}

export async function DELETE(_request: Request, context: Context) {
  const guard = await requireStoreAdmin();
  if (!guard.ok) return guard.response;

  const { id } = await context.params;
  if (!idSchema.safeParse(id).success) {
    return apiError("INVALID_ID", "ID tidak valid", 400);
  }

  try {
    // Keputusan 2026-10-15 (docs/04 bagian 10): produk yang masih tersimpan
    // di keranjang pembeli tidak boleh dihapus — kaskade FK akan menghapus
    // CartItem secara senyap. Admin diarahkan ke jalur lunak DISCONTINUED.
    const cartItemCount = await countCartItemsForProduct(id);
    if (cartItemCount > 0) {
      return apiError(
        "PRODUCT_IN_CART",
        `Produk tidak bisa dihapus karena masih ada di keranjang ${cartItemCount} pembeli. Ubah status produk ke DISCONTINUED bila ingin disembunyikan.`,
        409,
      );
    }
    await deleteProduct(id);
    return apiSuccess({ deleted: true });
  } catch (error) {
    // Produk yang pernah dipesan tidak boleh dihapus supaya riwayat pesanan
    // tetap utuh (OrderItem.variantId memakai Restrict). Lihat docs/04 PH-03.
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2003"
    ) {
      return apiError(
        "PRODUCT_IN_USE",
        "Produk tidak bisa dihapus karena sudah pernah dipesan",
        409,
      );
    }
    return prismaErrorResponse(error, "api/admin/products/[id]:DELETE");
  }
}
