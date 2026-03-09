import { Request, Response, NextFunction } from 'express';
import { auditService } from './audit.service';
import { AuditLogQuerySchema, SearchLogQuerySchema, LogSearchSchema } from './audit.schema';

export const auditController = {

  getAuditLogs: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const query = AuditLogQuerySchema.parse(req.query);
      res.json(await auditService.getAuditLogs(query));
    } catch (e) { next(e); }
  },

  getSearchLogs: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const query = SearchLogQuerySchema.parse(req.query);
      res.json(await auditService.getSearchLogs(query));
    } catch (e) { next(e); }
  },

  logSearch: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const input = LogSearchSchema.parse(req.body);
      const userId    = res.locals.user?.sub;
      const ipAddress = req.ip;
      res.status(201).json(await auditService.logSearch(input, userId, ipAddress));
    } catch (e) { next(e); }
  },
};