import { z } from 'zod';

export const CreateProductSchema = z.object({
  categoryId:   z.string().uuid(),
  brandId:      z.string().uuid(),
  sku:          z.string().min(1).max(50),
  name:         z.string().min(2).max(200),
  description:  z.string().optional(),
  shortDescription: z.string().max(500).optional(),
  basePrice:    z.number().positive(),
  comparePrice: z.number().positive().optional(),
  costPrice:    z.number().positive().optional(),
  weightKg:     z.number().positive().optional(),
  isActive:     z.boolean().default(true),
  isFeatured:   z.boolean().default(false),
  requiresCompatibilityCheck: z.boolean().default(false),
});

export const UpdateProductSchema = CreateProductSchema.partial();

export const CreateVariantSchema = z.object({
  skuVariant:    z.string().min(1).max(80),
  name:          z.string().min(2).max(200),
  priceModifier: z.number().default(0),
  stockQty:      z.number().int().min(0).default(0),
  isActive:      z.boolean().default(true),
  barcode:       z.string().max(100).optional(),
});

export const UpdateVariantSchema = CreateVariantSchema.partial();

export const StockAdjustmentSchema = z.object({
  variantId: z.string().uuid(),
  quantity:  z.number().int(),
  type:      z.enum(['purchase', 'adjustment', 'damage', 'return']),
  notes:     z.string().max(300).optional(),
});

export const CreateCategorySchema = z.object({
  parentId:    z.string().uuid().optional(),
  name:        z.string().min(2).max(100),
  slug:        z.string().min(2).max(100),
  description: z.string().optional(),
  iconUrl:     z.string().url().optional(),
  sortOrder:   z.number().int().default(0),
  isActive:    z.boolean().default(true),
});

export const CreateBrandSchema = z.object({
  name:            z.string().min(2).max(100),
  slug:            z.string().min(2).max(100),
  logoUrl:         z.string().url().optional(),
  website:         z.string().url().optional(),
  countryOfOrigin: z.string().length(2).optional(),
  isActive:        z.boolean().default(true),
});

export const UpdateUserSchema = z.object({
  isActive:   z.boolean().optional(),
  isCustomer: z.boolean().optional(),
});

export const AssignRoleSchema = z.object({
  roleSlug: z.enum(['admin', 'staff', 'customer']),
});

export type AssignRoleInput       = z.infer<typeof AssignRoleSchema>;
export type CreateProductInput    = z.infer<typeof CreateProductSchema>;
export type UpdateProductInput    = z.infer<typeof UpdateProductSchema>;
export type CreateVariantInput    = z.infer<typeof CreateVariantSchema>;
export type UpdateVariantInput    = z.infer<typeof UpdateVariantSchema>;
export type StockAdjustmentInput  = z.infer<typeof StockAdjustmentSchema>;
export type CreateCategoryInput   = z.infer<typeof CreateCategorySchema>;
export type CreateBrandInput      = z.infer<typeof CreateBrandSchema>;
export type UpdateUserInput       = z.infer<typeof UpdateUserSchema>;