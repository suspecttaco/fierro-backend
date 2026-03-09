import { Router } from 'express';
import { productTagsController } from './product-tags.controller';
import { authenticate, authorize } from '../../../middleware/auth';

const router = Router();
const isAdmin = [authenticate, authorize('admin', 'staff')];

router.get('/tags',                               productTagsController.getAllTags);
router.post('/tags',                              ...isAdmin, productTagsController.createTag);
router.delete('/tags/:tagId',                     ...isAdmin, productTagsController.deleteTag);
router.get('/products/:productId/tags',           productTagsController.getByProduct);
router.post('/products/:productId/tags',          ...isAdmin, productTagsController.assignTags);
router.delete('/products/:productId/tags',        ...isAdmin, productTagsController.removeTags);

export default router;