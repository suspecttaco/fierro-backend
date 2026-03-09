import { auditRepository } from './audit.repository';
import type { AuditLogQueryInput, SearchLogQueryInput, LogSearchInput } from './audit.schema';

export const auditService = {

  getAuditLogs:  (query: AuditLogQueryInput)  => auditRepository.findAuditLogs(query),
  getSearchLogs: (query: SearchLogQueryInput) => auditRepository.findSearchLogs(query),
  logSearch:     (data: LogSearchInput, userId?: string, ipAddress?: string) =>
    auditRepository.logSearch(data, userId, ipAddress),
};