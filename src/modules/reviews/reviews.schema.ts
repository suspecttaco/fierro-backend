import { z } from 'zod';

export const CreateReviewSchema = z.object({
  productId: z.string().uuid(),
  rating:    z.number().int().min(1).max(5),
  title:     z.string().max(200).optional(),
  body:      z.string().max(2000).optional(),
});

export const UpdateReviewStatusSchema = z.object({
  status: z.enum(['pending', 'approved', 'rejected']),
});

export type CreateReviewInput      = z.infer<typeof CreateReviewSchema>;
export type UpdateReviewStatusInput = z.infer<typeof UpdateReviewStatusSchema>;