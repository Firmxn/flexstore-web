import { z } from "zod";

const variantIdSchema = z
  .string({
    required_error: "Varian wajib dipilih",
    invalid_type_error: "Varian tidak valid",
  })
  .trim()
  .uuid("Varian tidak valid");

const quantitySchema = z
  .number({ invalid_type_error: "Jumlah harus berupa angka" })
  .int("Jumlah harus bilangan bulat")
  .min(1, "Jumlah minimal 1")
  .max(9999, "Jumlah terlalu besar");

export const addCartItemSchema = z.object({
  variantId: variantIdSchema,
  quantity: quantitySchema,
});

export const updateCartItemSchema = z.object({
  variantId: variantIdSchema,
  quantity: quantitySchema,
});

export const removeCartItemSchema = z.object({
  variantId: variantIdSchema,
});

export type AddCartItemInput = z.infer<typeof addCartItemSchema>;
export type UpdateCartItemInput = z.infer<typeof updateCartItemSchema>;
export type RemoveCartItemInput = z.infer<typeof removeCartItemSchema>;
