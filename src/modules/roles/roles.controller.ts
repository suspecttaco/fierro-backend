import { Request, Response, NextFunction } from 'express';
import { rolesService } from './roles.service';
import {
  CreateRoleSchema, UpdateRoleSchema,
  AssignPermissionsSchema,
  CreatePermissionSchema, UpdatePermissionSchema,
} from './roles.schema';

export const rolesController = {

  // Roles
  getRoles: async (req: Request, res: Response, next: NextFunction) => {
    try { res.json(await rolesService.getRoles()); } catch (e) { next(e); }
  },
  getRoleById: async (req: Request, res: Response, next: NextFunction) => {
    try { res.json(await rolesService.getRoleById(req.params.id as string)); } catch (e) { next(e); }
  },
  createRole: async (req: Request, res: Response, next: NextFunction) => {
    try { res.status(201).json(await rolesService.createRole(CreateRoleSchema.parse(req.body))); } catch (e) { next(e); }
  },
  updateRole: async (req: Request, res: Response, next: NextFunction) => {
    try { res.json(await rolesService.updateRole(req.params.id as string, UpdateRoleSchema.parse(req.body))); } catch (e) { next(e); }
  },
  deleteRole: async (req: Request, res: Response, next: NextFunction) => {
    try { res.json(await rolesService.deleteRole(req.params.id as string)); } catch (e) { next(e); }
  },

  // Permissions
  getPermissions: async (req: Request, res: Response, next: NextFunction) => {
    try { res.json(await rolesService.getPermissions()); } catch (e) { next(e); }
  },
  getPermissionById: async (req: Request, res: Response, next: NextFunction) => {
    try { res.json(await rolesService.getPermissionById(req.params.id as string)); } catch (e) { next(e); }
  },
  createPermission: async (req: Request, res: Response, next: NextFunction) => {
    try { res.status(201).json(await rolesService.createPermission(CreatePermissionSchema.parse(req.body))); } catch (e) { next(e); }
  },
  updatePermission: async (req: Request, res: Response, next: NextFunction) => {
    try { res.json(await rolesService.updatePermission(req.params.id as string, UpdatePermissionSchema.parse(req.body))); } catch (e) { next(e); }
  },
  deletePermission: async (req: Request, res: Response, next: NextFunction) => {
    try { res.json(await rolesService.deletePermission(req.params.id as string)); } catch (e) { next(e); }
  },

  // Role Permissions
  assignPermissions: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const input = AssignPermissionsSchema.parse(req.body);
      res.json(await rolesService.assignPermissions(req.params.id as string, input, res.locals.user.sub));
    } catch (e) { next(e); }
  },
  removePermissions: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const input = AssignPermissionsSchema.parse(req.body);
      res.json(await rolesService.removePermissions(req.params.id as string, input));
    } catch (e) { next(e); }
  },
};