import { z } from 'zod';

export const UpdatePreferenceSchema = z.object({
  event:        z.string().min(1).max(100),
  emailEnabled: z.boolean().optional(),
  smsEnabled:   z.boolean().optional(),
  pushEnabled:  z.boolean().optional(),
  inAppEnabled: z.boolean().optional(),
});

export type UpdatePreferenceInput = z.infer<typeof UpdatePreferenceSchema>;