import { Router } from 'express';
import { addressesController } from './addresses.controller';
import { authenticate } from '../../middleware/auth';

const router = Router();

router.get('/',              authenticate, addressesController.getAddresses);
router.get('/:id',           authenticate, addressesController.getById);
router.post('/',             authenticate, addressesController.create);
router.put('/:id',           authenticate, addressesController.update);
router.delete('/:id',        authenticate, addressesController.delete);
router.patch('/:id/default', authenticate, addressesController.setDefault);

export default router;