import { Router } from "express";
import { cartController } from "./cart.controller";
import { authenticate } from "../../middleware/auth";

const router = Router();

// El carrito funciona con o sin autenticacion
// Si hay token se procesa, si no usa el token del header
router.get('/', cartController.getCart);
router.post('/items', cartController.addItem);
router.put('/items/:id', cartController.updateItem);
router.delete('/items/:id', cartController.deleteItem);
router.post('/coupon', cartController.applyCoupon);

export default router;