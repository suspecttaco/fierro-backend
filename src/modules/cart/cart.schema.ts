import { z } from "zod";

export const AddToCartSchema = z.object({
    variantId:  z.string().uuid(),
    quantity:   z.number().int().min(1).max(99),
});

export const UpdateCartItemSchema = z.object({
    quantity: z.number().int().min(1).max(99),
});

export const ApplyCouponSchema = z.object({
    code: z.string().min(1).max(30),
});

export type AddToCartInput = z.infer<typeof AddToCartSchema>;
export type UpdateCartItemInput = z.infer<typeof UpdateCartItemSchema>;
export type ApplyCouponInput = z.infer<typeof ApplyCouponSchema>