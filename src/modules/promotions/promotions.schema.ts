import { z } from 'zod';

const PromotionBaseSchema = z.object({
  name:            z.string().min(1).max(150),
  type:            z.string().min(1).max(50),
  discountPercent: z.number().min(0).max(100).optional(),
  startsAt:        z.coerce.date().transform(d => d.toISOString()),
  endsAt:          z.coerce.date().transform(d => d.toISOString()),
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