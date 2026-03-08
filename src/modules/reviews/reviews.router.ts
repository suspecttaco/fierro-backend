import { Router } from "express";
import { reviewsController } from "./reviews.controller";
import { authenticate, authorize } from "../../middleware/auth";

const router = Router();

router.post('/', authenticate, reviewsController.createReview);
router.get('/product/:productId', reviewsController.getReviewsByProduct);

// Admin
router.get('/admin/all', authenticate, authorize('admin', 'staff'), reviewsController.getAllReviews);
router.put('/admin/:id/status', authenticate, authorize('admin', 'staff'), reviewsController.updateReviewStatus);
router.delete('/admin/:id', authenticate, authorize('admin', 'staff'), reviewsController.deleteReview);

export default router;