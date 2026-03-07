import { Router } from "express";
import { ordersController } from "./orders.controller";
import { authenticate, authorize } from "../../middleware/auth";

const router = Router();

// Cliente
router.post('/', authenticate, ordersController.checkout);
router.get('/', authenticate, ordersController.getOrders);
router.get('/:id', authenticate, ordersController.getOrderById);
router.post('/:id/cancel', authenticate, ordersController.cancelOrder);

// Admin
router.get('/admin/all', authenticate, authorize('admin', 'staff'), ordersController.getAllOrders);
router.put('/admin/:id/status', authenticate, authorize('admin', 'staff'), ordersController.updateOrderStatus);

export default router;