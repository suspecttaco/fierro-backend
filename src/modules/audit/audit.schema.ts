import { z } from 'zod';

export const AuditLogQuerySchema = z.object({
  userId:     z.string().uuid().optional(),
  action:     z.string().optional(),
  entityType: z.string().optional(),
  from:       z.string().datetime().optional(),
  to:         z.string().datetime().optional(),
  page:       z.coerce.number().int().min(1).default(1),
  limit:      z.coerce.number().int().min(1).max(100).default(20),
});

export const SearchLogQuerySchema = z.object({
  query:      z.string().optional(),
  noResults:  z.coerce.boolean().optional(),
  from:       z.string().datetime().optional(),
  to:         z.string().datetime().optional(),
  page:       z.coerce.number().int().min(1).default(1),
  limit:      z.coerce.number().int().min(1).max(100).default(20),
});

export const LogSearchSchema = z.object({
  query:           z.string().min(1).max(300),
  filtersApplied: z.record(z.string(), z.any()).default({}),
  resultsCount:    z.number().int().min(0),
  clickedProductId:z.string().uuid().optional(),
  sessionToken:    z.string().optional(),
});

export type AuditLogQueryInput  = z.infer<typeof AuditLogQuerySchema>;
export type SearchLogQueryInput = z.infer<typeof SearchLogQuerySchema>;
export type LogSearchInput      = z.infer<typeof LogSearchSchema>;