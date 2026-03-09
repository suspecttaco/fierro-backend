import { Router } from 'express';
import { couponsController } from './coupons.controller';
import { authenticate, authorize } from '../../middleware/auth';

const router = Router();
const isAdmin = [authenticate, authorize('admin', 'staff')];

router.get('/validate/:code',  authenticate, couponsController.validate);
router.get('/',                ...isAdmin,   couponsController.getAll);
router.get('/:id',             ...isAdmin,   couponsController.getById);
router.post('/',               ...isAdmin,   couponsController.create);
router.put('/:id',             ...isAdmin,   couponsController.update);
router.delete('/:id',          ...isAdmin,   couponsController.delete);

export default router;