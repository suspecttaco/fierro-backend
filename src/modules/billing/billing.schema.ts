import { z } from "zod";


export const CreateTaxProfileSchema = z.object({
    taxId:          z.string().min(12).max(13),
    legalName:      z.string().min(2).max(200),
    fiscalAddress:  z.string().min(5),
    taxRegime:      z.string().max(100).optional(),
    cfdiUse:        z.string().max(10).optional(),
    isDefault:      z.boolean().default(false),
});

export const UpdateTaxProfileSchema = CreateTaxProfileSchema.partial();

export type CreateTaxProfileInput = z.infer<typeof CreateTaxProfileSchema>;
export type UpdateTaxProfileInput = z.infer<typeof CreateTaxProfileSchema>;