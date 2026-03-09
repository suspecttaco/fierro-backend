import { Router } from 'express';
import { compatController } from './compat.controller';
import { authenticate, authorize } from '../../middleware/auth';

const router = Router();
const isAdmin = [authenticate, authorize('admin', 'staff')];

// Groups
router.get('/groups',          compatController.getGroups);
router.get('/groups/:id',      compatController.getGroupById);
router.post('/groups',         ...isAdmin, compatController.createGroup);
router.put('/groups/:id',      ...isAdmin, compatController.updateGroup);
router.delete('/groups/:id',   ...isAdmin, compatController.deleteGroup);

// Component Roles
router.get('/roles',           compatController.getRoles);
router.get('/roles/:id',       compatController.getRoleById);
router.post('/roles',          ...isAdmin, compatController.createRole);
router.put('/roles/:id',       ...isAdmin, compatController.updateRole);
router.delete('/roles/:id',    ...isAdmin, compatController.deleteRole);

// Compatibility Rules
router.get('/rules',           ...isAdmin, compatController.getRules);
router.get('/rules/:id',       ...isAdmin, compatController.getRuleById);
router.post('/rules',          ...isAdmin, compatController.createRule);
router.put('/rules/:id',       ...isAdmin, compatController.updateRule);
router.delete('/rules/:id',    ...isAdmin, compatController.deleteRule);

// Product Roles
router.get('/products/:productId/roles',    compatController.getProductRoles);
router.post('/products/roles',              ...isAdmin, compatController.assignProductRole);
router.delete('/products/roles',            ...isAdmin, compatController.removeProductRole);

export default router;