import { prisma } from '../../lib/prisma';
import type { CreateRoleInput, UpdateRoleInput, AssignPermissionsInput, CreatePermissionInput, UpdatePermissionInput } from './roles.schema';

export const rolesRepository = {

  // Roles
  findAllRoles: async () => {
    return prisma.role.findMany({
      include: {
        role_permission: { include: { permission: true } },
        _count:          { select: { user_role: true } },
      },
      orderBy: { name: 'asc' },
    });
  },

  findRoleById: async (roleId: string) => {
    return prisma.role.findUnique({
      where:   { role_id: roleId },
      include: { role_permission: { include: { permission: true } } },
    });
  },

  createRole: async (data: CreateRoleInput, slug: string) => {
    return prisma.role.create({
      data: { name: data.name, slug, description: data.description, is_system: false },
    });
  },

  updateRole: async (roleId: string, data: UpdateRoleInput) => {
    return prisma.role.update({
      where: { role_id: roleId },
      data:  { name: data.name, description: data.description },
    });
  },

  deleteRole: async (roleId: string) => {
    return prisma.role.delete({ where: { role_id: roleId } });
  },

  // Permissions
  findAllPermissions: async () => {
    return prisma.permission.findMany({ orderBy: [{ resource: 'asc' }, { action: 'asc' }] });
  },

  findPermissionById: async (permissionId: string) => {
    return prisma.permission.findUnique({ where: { permission_id: permissionId } });
  },

  createPermission: async (data: CreatePermissionInput, slug: string) => {
    return prisma.permission.create({
      data: { resource: data.resource, action: data.action, slug, description: data.description },
    });
  },

  updatePermission: async (permissionId: string, data: UpdatePermissionInput) => {
    return prisma.permission.update({
      where: { permission_id: permissionId },
      data:  { resource: data.resource, action: data.action, description: data.description },
    });
  },

  deletePermission: async (permissionId: string) => {
    return prisma.permission.delete({ where: { permission_id: permissionId } });
  },

  // Role Permissions
  assignPermissions: async (roleId: string, data: AssignPermissionsInput, grantedBy?: string) => {
    const records = data.permissionIds.map(permission_id => ({
      role_id: roleId,
      permission_id,
      granted_by: grantedBy ?? null,
    }));
    return prisma.role_permission.createMany({ data: records, skipDuplicates: true });
  },

  removePermissions: async (roleId: string, data: AssignPermissionsInput) => {
    return prisma.role_permission.deleteMany({
      where: { role_id: roleId, permission_id: { in: data.permissionIds } },
    });
  },
};