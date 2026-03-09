import { Router } from 'express';
import { wishlistController } from './wishlist.controller';
import { authenticate } from '../../middleware/auth';

const router = Router();

router.get('/',                    authenticate, wishlistController.getWishlist);
router.post('/',                   authenticate, wishlistController.add);
router.delete('/clear',            authenticate, wishlistController.clear);
router.delete('/:productId',       authenticate, wishlistController.remove);

export default router;