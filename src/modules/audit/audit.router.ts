import { Router } from 'express';
import { auditController } from './audit.controller';
import { authenticate, authorize } from '../../middleware/auth';
import { optionalAuth } from '../../middleware/optionalAuth';

const router = Router();
const isAdmin = [authenticate, authorize('admin')];

router.get('/logs',         ...isAdmin,  auditController.getAuditLogs);
router.get('/searches',     ...isAdmin,  auditController.getSearchLogs);
router.post('/searches',    optionalAuth, auditController.logSearch);

export default router;