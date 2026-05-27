import { z } from 'zod';

export const PC_COMPONENT_TYPES = [
  'cpu', 'motherboard', 'gpu', 'ram', 'storage', 'psu', 'case', 'cooler',
] as const;

export const CreateProductSchema = z.object({
  categoryId:   z.string().uuid(),
  brandId:      z.string().uuid(),
  sku:          z.string().min(1).transform(val => val.slice(0, 50)),
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
  componentType: z.string().optional().nullable(),
  pcSpecs:       z.record(z.string(), z.unknown()).optional().nullable(),
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

export const CreateAttributeTypeSchema = z.object({
  name:       z.string().min(2).max(100),
  slug:       z.string().min(2).max(100),
  dataType:   z.enum(['text', 'number', 'boolean']),
  unit:       z.string().max(30).optional(),
  filterable: z.boolean().default(false),
  comparable: z.boolean().default(false),
});

export const SetProductAttributeSchema = z.object({
  attrTypeId: z.string().uuid(),
  variantId:  z.string().uuid().optional().nullable(),
}).passthrough();

export const UpdateProductAttributeSchema = z.object({
  value:     z.union([z.string().max(500), z.number()]).optional().nullable(),
  valueText: z.string().max(500).optional().nullable(),
  valueNum:  z.coerce.number().optional().nullable(),
});

export type CreateAttributeTypeInput    = z.infer<typeof CreateAttributeTypeSchema>;
export type SetProductAttributeInput    = z.infer<typeof SetProductAttributeSchema>;
export type UpdateProductAttributeInput = z.infer<typeof UpdateProductAttributeSchema>;

export const BulkUpdateSpecsItemSchema = z.object({
  productId:     z.string().uuid(),
  componentType: z.string().max(30).optional().nullable(),
  pcSpecs:       z.record(z.string(), z.unknown()).optional().nullable(),
});

export const BulkUpdateSpecsSchema = z.object({
  items: z.array(BulkUpdateSpecsItemSchema).min(1).max(200),
});

export type BulkUpdateSpecsItem  = z.infer<typeof BulkUpdateSpecsItemSchema>;
export type BulkUpdateSpecsInput = z.infer<typeof BulkUpdateSpecsSchema>;
export type AssignRoleInput       = z.infer<typeof AssignRoleSchema>;
export type CreateProductInput    = z.infer<typeof CreateProductSchema>;
export type UpdateProductInput    = z.infer<typeof UpdateProductSchema>;
export type CreateVariantInput    = z.infer<typeof CreateVariantSchema>;
export type UpdateVariantInput    = z.infer<typeof UpdateVariantSchema>;
export type StockAdjustmentInput  = z.infer<typeof StockAdjustmentSchema>;
export type CreateCategoryInput   = z.infer<typeof CreateCategorySchema>;
export type CreateBrandInput      = z.infer<typeof CreateBrandSchema>;
export type UpdateUserInput       = z.infer<typeof UpdateUserSchema>;