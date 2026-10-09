import { getBrandById } from "@/lib/brands";
import { getCategoryById } from "@/lib/categories";
import { requireStoreAdmin } from "@/lib/auth/guard";
import { createProduct, getProducts } from "@/lib/products";
import {
  productListQuerySchema,
  productSchema,
} from "@/lib/products/validation";
import { apiError, apiSuccess, validationError } from "@/lib/utils/api";
import { prismaErrorResponse } from "@/lib/utils/prisma-error";

export async function GET(request: Request) {
  const guard = await requireStoreAdmin();
  if (!guard.ok) return guard.response;

  const searchParams = Object.fromEntries(new URL(request.url).searchParams);
  const parsed = productListQuerySchema.safeParse(searchParams);
  if (!parsed.success) return validationError(parsed.error);

  const result = await getProducts(parsed.data);
  return apiSuccess(result);
}

export async function POST(request: Request) {
  const guard = await requireStoreAdmin();
  if (!guard.ok) return guard.response;

  const body = await request.json().catch(() => null);
  const parsed = productSchema.safeParse(body);
  if (!parsed.success) return validationError(parsed.error);

  const input = parsed.data;

  if (!(await getCategoryById(input.categoryId))) {
    return apiError("INVALID_CATEGORY", "Kategori tidak valid", 400, "categoryId");
  }

  if (input.brandId && !(await getBrandById(input.brandId))) {
    return apiError("INVALID_BRAND", "Brand tidak valid", 400, "brandId");
  }

  try {
    const product = await createProduct(input);
    return apiSuccess({ product }, 201);
  } catch (error) {
    return prismaErrorResponse(error, "api/admin/products:POST", {
      slug: "Slug sudah digunakan",
      sku: "SKU sudah digunakan",
    });
  }
}
