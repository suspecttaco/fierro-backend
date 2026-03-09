import { Router } from "express";
import { catalogController } from "./catalog.controller";

const router = Router();

router.get('/products', catalogController.getProducts);
router.get('/products/:slug', catalogController.getProductBySlug);
router.get('/categories', catalogController.getCategories);
router.get('/brands', catalogController.getBrands);
router.get('/variants/:variantId', catalogController.getVariantById);

export default router;