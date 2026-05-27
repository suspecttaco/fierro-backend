import { z } from 'zod';

export const CreateBuildSchema = z.object({
  name: z.string().min(2).max(150).default('Mi configuración'),
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

export const CreateAiSessionSchema = z.object({
  title: z.string().max(200).optional(),
});

export const AiChatSchema = z.object({
  message: z.string().min(1).max(4000),
});

export type CreateAiSessionInput = z.infer<typeof CreateAiSessionSchema>;
export type AiChatInput          = z.infer<typeof AiChatSchema>;