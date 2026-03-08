import { z } from 'zod';

export const CreateBuildSchema = z.object({
  name:    z.string().min(2).max(150).default('Mi configuración'),
  groupId: z.string().uuid(),
});

export const AddBuildItemSchema = z.object({
  roleId:    z.string().uuid(),
  variantId: z.string().uuid(),
  quantity:  z.number().int().min(1).default(1),
});

export const UpdateBuildSchema = z.object({
  name:     z.string().min(2).max(150).optional(),
  isPublic: z.boolean().optional(),
});

export type CreateBuildInput  = z.infer<typeof CreateBuildSchema>;
export type AddBuildItemInput = z.infer<typeof AddBuildItemSchema>;
export type UpdateBuildInput  = z.infer<typeof UpdateBuildSchema>;