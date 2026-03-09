import { Router } from 'express';
import { productAttributesController } from './product-attributes.controller';
import { authenticate, authorize } from '../../../middleware/auth';

const router = Router();
const isAdmin = [authenticate, authorize('admin', 'staff')];

router.get('/attribute-types',                              productAttributesController.getAllTypes);
router.post('/attribute-types',                             ...isAdmin, productAttributesController.createType);
router.delete('/attribute-types/:attrTypeId',               ...isAdmin, productAttributesController.deleteType);
router.get('/products/:productId/attributes',               productAttributesController.getByProduct);
router.post('/products/:productId/attributes',              ...isAdmin, productAttributesController.setAttribute);
router.delete('/products/:productId/attributes/:productAttrId', ...isAdmin, productAttributesController.deleteAttribute);

export default router;