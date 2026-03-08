import { z } from 'zod';

export const CreateReturnSchema = z.object({
  orderId: z.string().uuid(),
  reason:  z.enum(['defective', 'wrong_item', 'not_as_described', 'changed_mind', 'damaged', 'other']),
  customerNotes: z.string().max(500).optional(),
  items: z.array(z.object({
    orderItemId: z.string().uuid(),
    quantity:    z.number().int().min(1),
    condition:   z.enum(['new', 'good', 'fair', 'damaged']),
  })).min(1),
});

export const UpdateReturnStatusSchema = z.object({
  status:     z.enum(['pending', 'approved', 'rejected', 'completed']),
  resolution: z.enum(['refund', 'exchange', 'store_credit']).optional(),
  staffNotes: z.string().max(500).optional(),
});

export type CreateReturnInput      = z.infer<typeof CreateReturnSchema>;
export type UpdateReturnStatusInput = z.infer<typeof UpdateReturnStatusSchema>;