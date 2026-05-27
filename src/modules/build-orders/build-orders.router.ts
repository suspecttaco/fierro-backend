import { Router } from 'express';
import { authenticate, authorize } from '../../middleware/auth';
import { buildOrdersController } from './build-orders.controller';

const router = Router();

const isAdmin = [authenticate, authorize('admin', 'staff')];

// ── Cliente (autenticado) ─────────────────────────────────────────────────
router.post('/',          authenticate, buildOrdersController.create);
router.get('/',           authenticate, buildOrdersController.getMyOrders);
router.get('/:id',        authenticate, buildOrdersController.getById);
router.post('/:id/cancel',authenticate, buildOrdersController.cancel);

// ── Admin / Staff ─────────────────────────────────────────────────────────
router.get( '/admin/all',             ...isAdmin, buildOrdersController.adminGetAll);
router.get( '/admin/:id',             ...isAdmin, buildOrdersController.adminGetById);
router.put( '/admin/:id/status',      ...isAdmin, buildOrdersController.updateStatus);
router.put( '/admin/:id/fee',         ...isAdmin, buildOrdersController.setAssemblyFee);
router.post('/admin/:id/observations',...isAdmin, buildOrdersController.addObservation);

export default router;
