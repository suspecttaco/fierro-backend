import { Router } from 'express';
import { adminController } from './admin.controller';
import { authenticate, authorize } from '../../middleware/auth';

const router = Router();

const isAdmin = [authenticate, authorize('admin')];
const isStaff = [authenticate, authorize('admin', 'staff')];

// Productos
router.post('/products',                    ...isStaff, adminController.createProduct);
router.put('/products/:id',                 ...isStaff, adminController.updateProduct);
router.delete('/products/:id',              ...isAdmin, adminController.deleteProduct);
router.post('/products/:productId/variants',...isStaff, adminController.createVariant);
router.put('/variants/:id',                 ...isStaff, adminController.updateVariant);
router.delete('/variants/:id',              ...isStaff, adminController.deleteVariant);

// Stock
router.post('/stock/adjust',                ...isStaff, adminController.adjustStock);

// Categorías
router.post('/categories',                  ...isStaff, adminController.createCategory);
router.put('/categories/:id',               ...isStaff, adminController.updateCategory);

// Marcas
router.post('/brands',                      ...isStaff, adminController.createBrand);
router.put('/brands/:id',                   ...isStaff, adminController.updateBrand);

// Usuarios
router.get('/users',                        ...isAdmin, adminController.getUsers);
router.put('/users/:id',                    ...isAdmin, adminController.updateUser);

// Reportes
router.get('/reports/sales',                ...isAdmin, adminController.getSalesReport);

// Activar Admin
router.post('/users/:id/role', ...isAdmin, adminController.assignRole);

export default router;