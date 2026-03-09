import { z } from 'zod';

export const CreateGroupSchema = z.object({
  name:        z.string().min(1).max(100),
  description: z.string().optional(),
  isActive:    z.boolean().default(true),
});

export const CreateComponentRoleSchema = z.object({
  groupId:     z.string().uuid(),
  name:        z.string().min(1).max(80),
  slug:        z.string().min(1).max(80).optional(),
  isRequired:  z.boolean().default(true),
  maxQuantity: z.number().int().min(1).default(1),
  sortOrder:   z.number().int().default(0),
});

export const CreateCompatibilityRuleSchema = z.object({
  sourceAttrTypeId: z.string().uuid(),
  targetAttrTypeId: z.string().uuid(),
  sourceRoleId:     z.string().uuid(),
  targetRoleId:     z.string().uuid(),
  operator:         z.enum(['eq', 'neq', 'lte', 'gte', 'in', 'match']),
  ruleType:         z.enum(['required', 'forbidden', 'warning']),
  message:          z.string().min(1),
  isActive:         z.boolean().default(true),
});

export const AssignProductRoleSchema = z.object({
  productId: z.string().uuid(),
  roleId:    z.string().uuid(),
});

export const UpdateGroupSchema            = CreateGroupSchema.partial();
export const UpdateComponentRoleSchema    = CreateComponentRoleSchema.partial();
export const UpdateCompatibilityRuleSchema = CreateCompatibilityRuleSchema.partial();

export type CreateGroupInput             = z.infer<typeof CreateGroupSchema>;
export type UpdateGroupInput             = z.infer<typeof UpdateGroupSchema>;
export type CreateComponentRoleInput     = z.infer<typeof CreateComponentRoleSchema>;
export type UpdateComponentRoleInput     = z.infer<typeof UpdateComponentRoleSchema>;
export type CreateCompatibilityRuleInput = z.infer<typeof CreateCompatibilityRuleSchema>;
export type UpdateCompatibilityRuleInput = z.infer<typeof UpdateCompatibilityRuleSchema>;
export type AssignProductRoleInput       = z.infer<typeof AssignProductRoleSchema>;