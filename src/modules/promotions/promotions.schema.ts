import { z } from 'zod';

export const CreatePromotionSchema = z.object({
  name:            z.string().min(1).max(150),
  type:            z.enum(['banner', 'flash_sale', 'bundle', 'spotlight']),
  discountPercent: z.number().min(0).max(100).optional(),
  startsAt:        z.string().datetime(),
  endsAt:          z.string().datetime(),
  isActive:        z.boolean().default(true),
}).refine(d => new Date(d.endsAt) > new Date(d.startsAt), {
  message: 'endsAt debe ser mayor que startsAt',
});

export const UpdatePromotionSchema = CreatePromotionSchema.partial();

export const AssignPromotionProductsSchema = z.object({
  productIds: z.array(z.string().uuid()).min(1),
});

export type CreatePromotionInput         = z.infer<typeof CreatePromotionSchema>;
export type UpdatePromotionInput         = z.infer<typeof UpdatePromotionSchema>;
export type AssignPromotionProductsInput = z.infer<typeof AssignPromotionProductsSchema>;