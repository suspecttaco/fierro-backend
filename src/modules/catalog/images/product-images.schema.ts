import { z } from 'zod';

export const AddProductImageSchema = z.object({
  url:       z.string().url().max(500),
  altText:   z.string().max(200).optional(),
  sortOrder: z.number().int().default(0),
  isPrimary: z.boolean().default(false),
  variantId: z.string().uuid().optional(),
});

export const UpdateProductImageSchema = AddProductImageSchema.partial();

export type AddProductImageInput    = z.infer<typeof AddProductImageSchema>;
export type UpdateProductImageInput = z.infer<typeof UpdateProductImageSchema>;