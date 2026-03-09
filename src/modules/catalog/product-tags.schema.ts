import { z } from 'zod';

export const CreateTagSchema = z.object({
  name: z.string().min(1).max(80),
  slug: z.string().min(1).max(80).optional(),
});

export const AssignTagsSchema = z.object({
  tagIds: z.array(z.string().uuid()).min(1),
});

export type CreateTagInput  = z.infer<typeof CreateTagSchema>;
export type AssignTagsInput = z.infer<typeof AssignTagsSchema>;