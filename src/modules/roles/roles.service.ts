import { rolesRepository } from './roles.repository';
import { generateSlug } from '../../util/slug';
import { AppError } from '../../util/errors';
import type {
  CreateRoleInput, UpdateRoleInput,
  AssignPermissionsInput,
  CreatePermissionInput, UpdatePermissionInput,
} from './roles.schema';

export const rolesService = {

  // Roles
  getRoles: () => rolesRepository.findAllRoles(),

  getRoleById: async (roleId: string) => {
    const role = await rolesRepository.findRoleById(roleId);
    if (!role) throw new AppError('Rol no encontrado.', 404, 'NOT_FOUND');
    return role;
  },

  createRole: async (data: CreateRoleInput) => {
    const slug = data.slug ?? await generateSlug(data.name, 'role' as any);
    return rolesRepository.createRole(data, slug);
  },

  updateRole: async (roleId: string, data: UpdateRoleInput) => {
    const role = await rolesService.getRoleById(roleId);
    if (role.is_system) throw new AppError('No se pueden editar roles del sistema.', 403, 'FORBIDDEN');
    return rolesRepository.updateRole(roleId, data);
  },

  deleteRole: async (roleId: string) => {
    const role = await rolesService.getRoleById(roleId);
    if (role.is_system) throw new AppError('No se pueden eliminar roles del sistema.', 403, 'FORBIDDEN');
    await rolesRepository.deleteRole(roleId);
    return { message: 'Rol eliminado.' };
  },

  // Permissions
  getPermissions:   () => rolesRepository.findAllPermissions(),

  getPermissionById: async (permissionId: string) => {
    const permission = await rolesRepository.findPermissionById(permissionId);
    if (!permission) throw new AppError('Permiso no encontrado.', 404, 'NOT_FOUND');
    return permission;
  },

  createPermission: async (data: CreatePermissionInput) => {
    const slug = data.slug ?? `${data.resource}.${data.action}`;
    return rolesRepository.createPermission(data, slug);
  },

  updatePermission: async (permissionId: string, data: UpdatePermissionInput) => {
    await rolesService.getPermissionById(permissionId);
    return rolesRepository.updatePermission(permissionId, data);
  },

  deletePermission: async (permissionId: string) => {
    await rolesService.getPermissionById(permissionId);
    await rolesRepository.deletePermission(permissionId);
    return { message: 'Permiso eliminado.' };
  },

  // Role Permissions
  assignPermissions: async (roleId: string, data: AssignPermissionsInput, grantedBy?: string) => {
    await rolesService.getRoleById(roleId);
    return rolesRepository.assignPermissions(roleId, data, grantedBy);
  },

  removePermissions: async (roleId: string, data: AssignPermissionsInput) => {
    await rolesService.getRoleById(roleId);
    return rolesRepository.removePermissions(roleId, data);
  },
};