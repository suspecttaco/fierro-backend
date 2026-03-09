import { z } from 'zod';

export const CreateCouponSchema = z.object({
  code:            z.string().min(3).max(30).toUpperCase(),
  discountType:    z.enum(['percent', 'fixed']),
  discountValue:   z.number().positive(),
  minOrderAmount:  z.number().min(0).default(0),
  maxUses:         z.number().int().positive().optional(),
  expiresAt:       z.string().datetime().optional(),
  isActive:        z.boolean().default(true),
});

export const UpdateCouponSchema = CreateCouponSchema.partial();

export type CreateCouponInput = z.infer<typeof CreateCouponSchema>;
export type UpdateCouponInput = z.infer<typeof UpdateCouponSchema>;