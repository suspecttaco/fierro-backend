import { z } from 'zod';

export const CreateRoleSchema = z.object({
  name:        z.string().min(1).max(80),
  slug:        z.string().min(1).max(80).optional(),
  description: z.string().optional(),
});

export const AssignPermissionsSchema = z.object({
  permissionIds: z.array(z.string().uuid()).min(1),
});

export const CreatePermissionSchema = z.object({
  resource:    z.string().min(1).max(80),
  action:      z.enum(['create', 'read', 'update', 'delete', 'manage', 'cancel', 'approve', 'ban']),
  slug:        z.string().min(1).max(120).optional(),
  description: z.string().max(300).optional(),
});

export const UpdateRoleSchema       = CreateRoleSchema.partial();
export const UpdatePermissionSchema = CreatePermissionSchema.partial();

export type CreateRoleInput         = z.infer<typeof CreateRoleSchema>;
export type UpdateRoleInput         = z.infer<typeof UpdateRoleSchema>;
export type AssignPermissionsInput  = z.infer<typeof AssignPermissionsSchema>;
export type CreatePermissionInput   = z.infer<typeof CreatePermissionSchema>;
export type UpdatePermissionInput   = z.infer<typeof UpdatePermissionSchema>;