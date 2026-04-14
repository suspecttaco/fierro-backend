import { z } from "zod";

export const ProductListSchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(50).default(20),
    category: z.string().optional(),
    brand: z.string().optional(),
    price_min: z.coerce.number().min(0).optional(),
    price_max: z.coerce.number().min(0).optional(),
    in_stock: z.coerce.boolean().optional(),
    tags: z.string().optional(),
    q: z.string().optional(),
    min_rating: z.coerce.number().min(1).max(5).optional(),
});

export const ProductSlugSchema = z.object({
    slug: z.string().min(1),
});

export type ProductListInput = z.infer<typeof ProductListSchema>;