import { prisma } from '../../lib/prisma';
import type { AuditLogQueryInput, SearchLogQueryInput, LogSearchInput } from './audit.schema';

export const auditRepository = {

  findAuditLogs: async (query: AuditLogQueryInput) => {
    const offset = (query.page - 1) * query.limit;
    const where: any = {};
    if (query.userId)     where.user_id     = query.userId;
    if (query.action)     where.action      = { contains: query.action, mode: 'insensitive' };
    if (query.entityType) where.entity_type = query.entityType;
    if (query.from || query.to) {
      where.created_at = {};
      if (query.from) where.created_at.gte = new Date(query.from);
      if (query.to)   where.created_at.lte = new Date(query.to);
    }

    const [items, total] = await Promise.all([
      prisma.audit_log.findMany({
        where,
        skip:    offset,
        take:    query.limit,
        orderBy: { created_at: 'desc' },
        include: { user: { select: { user_id: true, email: true, first_name: true, last_name: true } } },
      }),
      prisma.audit_log.count({ where }),
    ]);
    return { items, total, page: query.page, limit: query.limit };
  },

  findSearchLogs: async (query: SearchLogQueryInput) => {
    const offset = (query.page - 1) * query.limit;
    const where: any = {};
    if (query.query)     where.query          = { contains: query.query, mode: 'insensitive' };
    if (query.noResults) where.results_count  = 0;
    if (query.from || query.to) {
      where.created_at = {};
      if (query.from) where.created_at.gte = new Date(query.from);
      if (query.to)   where.created_at.lte = new Date(query.to);
    }

    const [items, total] = await Promise.all([
      prisma.search_log.findMany({
        where,
        skip:    offset,
        take:    query.limit,
        orderBy: { created_at: 'desc' },
      }),
      prisma.search_log.count({ where }),
    ]);
    return { items, total, page: query.page, limit: query.limit };
  },

  logSearch: async (data: LogSearchInput, userId?: string, ipAddress?: string) => {
    return prisma.search_log.create({
      data: {
        user_id:           userId ?? null,
        query:             data.query,
        filters_applied:   data.filtersApplied,
        results_count:     data.resultsCount,
        clicked_product_id: data.clickedProductId ?? null,
        session_token:     data.sessionToken ?? null,
        ip_address:        ipAddress ?? null,
      },
    });
  },
};