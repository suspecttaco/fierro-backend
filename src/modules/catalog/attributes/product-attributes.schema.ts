import { z } from 'zod';

export const CreateAttributeTypeSchema = z.object({
  name:       z.string().min(1).max(100),
  slug:       z.string().min(1).max(100).optional(),
  dataType:   z.enum(['text', 'integer', 'decimal', 'boolean']),
  unit:       z.string().max(30).optional(),
  filterable: z.boolean().default(false),
  comparable: z.boolean().default(false),
});

export const SetProductAttributeSchema = z.object({
  attrTypeId: z.string().uuid(),
  valueText:  z.string().max(500).optional(),
  valueNum:   z.number().optional(),
  variantId:  z.string().uuid().optional(),
}).refine(d => d.valueText !== undefined || d.valueNum !== undefined, {
  message: 'Debe proporcionar valueText o valueNum',
});

export type CreateAttributeTypeInput  = z.infer<typeof CreateAttributeTypeSchema>;
export type SetProductAttributeInput  = z.infer<typeof SetProductAttributeSchema>;