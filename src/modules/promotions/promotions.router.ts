import { Router } from 'express';
import { promotionsController } from './promotions.controller';
import { authenticate, authorize } from '../../middleware/auth';

const router = Router();
const isAdmin = [authenticate, authorize('admin', 'staff')];

router.get('/active',          promotionsController.getActive);
router.get('/',                ...isAdmin, promotionsController.getAll);
router.get('/:id',             ...isAdmin, promotionsController.getById);
router.post('/',               ...isAdmin, promotionsController.create);
router.put('/:id',             ...isAdmin, promotionsController.update);
router.delete('/:id',          ...isAdmin, promotionsController.delete);
router.post('/:id/products',   ...isAdmin, promotionsController.assignProducts);
router.delete('/:id/products', ...isAdmin, promotionsController.removeProducts);

export default router;