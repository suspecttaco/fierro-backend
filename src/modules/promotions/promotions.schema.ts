import { z } from 'zod';

const PromotionBaseSchema = z.object({
  name:            z.string().min(1).max(150),
  type:            z.enum(['banner', 'flash_sale', 'bundle', 'spotlight']),
  discountPercent: z.number().min(0).max(100).optional(),
  startsAt:        z.string().datetime(),
  endsAt:          z.string().datetime(),
  isActive:        z.boolean().default(true),
});

export const CreatePromotionSchema = PromotionBaseSchema.refine(d => new Date(d.endsAt) > new Date(d.startsAt), {
  message: 'endsAt debe ser mayor que startsAt',
});

export const UpdatePromotionSchema = PromotionBaseSchema.partial().refine(
  d => {
    // Only validate dates if both are provided
    if (d.startsAt && d.endsAt) {
      return new Date(d.endsAt) > new Date(d.startsAt);
    }
    return true;
  },
  {
    message: 'endsAt debe ser mayor que startsAt',
  }
);

export const AssignPromotionProductsSchema = z.object({
  productIds: z.array(z.string().uuid()).min(1),
});

export type CreatePromotionInput         = z.infer<typeof CreatePromotionSchema>;
export type UpdatePromotionInput         = z.infer<typeof UpdatePromotionSchema>;
export type AssignPromotionProductsInput = z.infer<typeof AssignPromotionProductsSchema>;