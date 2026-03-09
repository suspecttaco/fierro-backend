import { z } from 'zod';

export const AddToWishlistSchema = z.object({
  productId: z.string().uuid(),
});

export type AddToWishlistInput = z.infer<typeof AddToWishlistSchema>;