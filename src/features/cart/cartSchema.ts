import { z } from "zod";

export const MAX_LINE_QUANTITY = 10;

export const cartItemSchema = z.object({
  productId: z.number().int().positive(),
  // Older saved carts had no upper bound; clamp instead of discarding them.
  quantity: z
    .number()
    .int()
    .positive()
    .transform((quantity) => Math.min(quantity, MAX_LINE_QUANTITY)),
  size: z.number().int().positive().optional(),
  color: z.string().min(1).max(32).optional(),
  selected: z.boolean().optional(),
});

export const cartStateSchema = z.object({
  items: z.array(cartItemSchema),
});

export const persistedCartSchema = z.object({
  version: z.literal(1),
  cart: cartStateSchema,
});

const orderLineSchema = z.object({
  productId: z.number().int().positive(),
  name: z.string(),
  image: z.string(),
  unitPrice: z.number().nonnegative(),
  quantity: z.number().int().positive(),
  size: z.number().int().positive(),
  color: z.string(),
});

export const orderSchema = z.object({
  id: z.string().min(1),
  createdAt: z.string(),
  lines: z.array(orderLineSchema).min(1),
  totals: z.object({
    itemCount: z.number().int().nonnegative(),
    subtotal: z.number().nonnegative(),
    shipping: z.number().nonnegative(),
    total: z.number().nonnegative(),
  }),
  customer: z.object({
    fullName: z.string(),
    email: z.string(),
    city: z.string(),
  }),
});
