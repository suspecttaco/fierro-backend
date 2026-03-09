import { Router } from 'express';
import { rolesController } from './roles.controller';
import { authenticate, authorize } from '../../middleware/auth';

const router = Router();
const isAdmin = [authenticate, authorize('admin')];

// Roles
router.get('/',                       ...isAdmin, rolesController.getRoles);
router.get('/:id',                    ...isAdmin, rolesController.getRoleById);
router.post('/',                      ...isAdmin, rolesController.createRole);
router.put('/:id',                    ...isAdmin, rolesController.updateRole);
router.delete('/:id',                 ...isAdmin, rolesController.deleteRole);
router.post('/:id/permissions',       ...isAdmin, rolesController.assignPermissions);
router.delete('/:id/permissions',     ...isAdmin, rolesController.removePermissions);

// Permissions
router.get('/permissions',            ...isAdmin, rolesController.getPermissions);
router.get('/permissions/:id',        ...isAdmin, rolesController.getPermissionById);
router.post('/permissions',           ...isAdmin, rolesController.createPermission);
router.put('/permissions/:id',        ...isAdmin, rolesController.updatePermission);
router.delete('/permissions/:id',     ...isAdmin, rolesController.deletePermission);

export default router;