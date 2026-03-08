import { Router } from "express";
import { returnsController } from "./returns.controller";
import { authenticate, authorize } from "../../middleware/auth";

const router = Router();

router.post('/', authenticate, returnsController.createReturn);
router.get('/', authenticate, returnsController.getReturns);
router.get('/:id', authenticate, returnsController.getReturnById);

// Admin
router.get('/admin/all', authenticate, authorize('admin', 'staff'), returnsController.getAllReturns);
router.put('/admin/:id/status', authenticate, authorize('admin', 'staff'), returnsController.updateReturnStatus);

export default router;