import { Router } from 'express';
import { productImagesController } from './product-images.controller';
import { authenticate, authorize } from '../../../middleware/auth';

const router = Router();
const isAdmin = [authenticate, authorize('admin', 'staff')];

router.get('/products/:productId/images',           productImagesController.getByProduct);
router.post('/products/:productId/images',          ...isAdmin, productImagesController.add);
router.put('/products/:productId/images/:imageId',  ...isAdmin, productImagesController.update);
router.delete('/products/:productId/images/:imageId',...isAdmin, productImagesController.delete);

export default router;