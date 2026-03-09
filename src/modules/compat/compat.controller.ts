import { Request, Response, NextFunction } from 'express';
import { compatService } from './compat.service';
import {
  CreateGroupSchema, UpdateGroupSchema,
  CreateComponentRoleSchema, UpdateComponentRoleSchema,
  CreateCompatibilityRuleSchema, UpdateCompatibilityRuleSchema,
  AssignProductRoleSchema,
} from './compat.schema';

export const compatController = {

  // Groups
  getGroups:    async (req: Request, res: Response, next: NextFunction) => {
    try { res.json(await compatService.getGroups()); } catch (e) { next(e); }
  },
  getGroupById: async (req: Request, res: Response, next: NextFunction) => {
    try { res.json(await compatService.getGroupById(req.params.id as string)); } catch (e) { next(e); }
  },
  createGroup:  async (req: Request, res: Response, next: NextFunction) => {
    try { res.status(201).json(await compatService.createGroup(CreateGroupSchema.parse(req.body))); } catch (e) { next(e); }
  },
  updateGroup:  async (req: Request, res: Response, next: NextFunction) => {
    try { res.json(await compatService.updateGroup(req.params.id as string, UpdateGroupSchema.parse(req.body))); } catch (e) { next(e); }
  },
  deleteGroup:  async (req: Request, res: Response, next: NextFunction) => {
    try { res.json(await compatService.deleteGroup(req.params.id as string)); } catch (e) { next(e); }
  },

  // Component Roles
  getRoles:    async (req: Request, res: Response, next: NextFunction) => {
    try { res.json(await compatService.getRoles(req.query.groupId as string)); } catch (e) { next(e); }
  },
  getRoleById: async (req: Request, res: Response, next: NextFunction) => {
    try { res.json(await compatService.getRoleById(req.params.id as string)); } catch (e) { next(e); }
  },
  createRole:  async (req: Request, res: Response, next: NextFunction) => {
    try { res.status(201).json(await compatService.createRole(CreateComponentRoleSchema.parse(req.body))); } catch (e) { next(e); }
  },
  updateRole:  async (req: Request, res: Response, next: NextFunction) => {
    try { res.json(await compatService.updateRole(req.params.id as string, UpdateComponentRoleSchema.parse(req.body))); } catch (e) { next(e); }
  },
  deleteRole:  async (req: Request, res: Response, next: NextFunction) => {
    try { res.json(await compatService.deleteRole(req.params.id as string)); } catch (e) { next(e); }
  },

  // Compatibility Rules
  getRules:    async (req: Request, res: Response, next: NextFunction) => {
    try { res.json(await compatService.getRules()); } catch (e) { next(e); }
  },
  getRuleById: async (req: Request, res: Response, next: NextFunction) => {
    try { res.json(await compatService.getRuleById(req.params.id as string)); } catch (e) { next(e); }
  },
  createRule:  async (req: Request, res: Response, next: NextFunction) => {
    try { res.status(201).json(await compatService.createRule(CreateCompatibilityRuleSchema.parse(req.body))); } catch (e) { next(e); }
  },
  updateRule:  async (req: Request, res: Response, next: NextFunction) => {
    try { res.json(await compatService.updateRule(req.params.id as string, UpdateCompatibilityRuleSchema.parse(req.body))); } catch (e) { next(e); }
  },
  deleteRule:  async (req: Request, res: Response, next: NextFunction) => {
    try { res.json(await compatService.deleteRule(req.params.id as string)); } catch (e) { next(e); }
  },

  // Product Roles
  getProductRoles:   async (req: Request, res: Response, next: NextFunction) => {
    try { res.json(await compatService.getProductRoles(req.params.productId as string)); } catch (e) { next(e); }
  },
  assignProductRole: async (req: Request, res: Response, next: NextFunction) => {
    try { res.status(201).json(await compatService.assignProductRole(AssignProductRoleSchema.parse(req.body))); } catch (e) { next(e); }
  },
  removeProductRole: async (req: Request, res: Response, next: NextFunction) => {
    try { res.json(await compatService.removeProductRole(AssignProductRoleSchema.parse(req.body))); } catch (e) { next(e); }
  },
};