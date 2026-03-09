import { z } from 'zod';

export const CreateAddressSchema = z.object({
  alias:         z.string().max(50).optional(),
  recipientName: z.string().min(2).max(160),
  streetLine1:   z.string().min(5).max(200),
  streetLine2:   z.string().max(200).optional(),
  city:          z.string().min(2).max(100),
  state:         z.string().min(2).max(100),
  zipCode:       z.string().min(3).max(20),
  country:       z.string().length(2).default('MX'),
  phone:         z.string().max(30).optional(),
  isDefault:     z.boolean().optional().default(false),
});

export const UpdateAddressSchema = CreateAddressSchema.partial();

export type CreateAddressInput = z.infer<typeof CreateAddressSchema>;
export type UpdateAddressInput = z.infer<typeof UpdateAddressSchema>;