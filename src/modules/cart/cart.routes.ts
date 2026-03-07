import { Router } from "express";
import { cartController } from "./cart.controller";
import { authenticate } from "../../middleware/auth";
import { optionalAuth } from "../../middleware/optionalAuth";

const router = Router();

// El carrito funciona con o sin autenticacion
// Si hay token se procesa, si no usa el token del header
router.get('/', optionalAuth, cartController.getCart);
router.post('/items', optionalAuth, cartController.addItem);
router.put('/items/:id', optionalAuth, cartController.updateItem);
router.delete('/items/:id', optionalAuth, cartController.deleteItem);
router.post('/coupon', optionalAuth, cartController.applyCoupon);

export default router;