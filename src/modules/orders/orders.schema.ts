import { z } from "zod";

export const CheckoutSchema = z.object({
    addressId:      z.string().uuid(),
    couponId:       z.string().uuid().optional(),
    idempotencyKey: z.string().min(1).max(100),
});

export const UpdateOrderStatusSchema = z.object({
    status: z.enum(['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled']),
});

export type CheckoutInput           = z.infer<typeof CheckoutSchema>;
export type UpdateOrderStatusInput  = z.infer<typeof UpdateOrderStatusSchema>;