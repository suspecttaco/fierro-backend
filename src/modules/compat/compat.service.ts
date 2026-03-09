import { compatRepository } from './compat.repository';
import { generateSlug } from '../../util/slug';
import { AppError } from '../../util/errors';
import type {
  CreateGroupInput, UpdateGroupInput,
  CreateComponentRoleInput, UpdateComponentRoleInput,
  CreateCompatibilityRuleInput, UpdateCompatibilityRuleInput,
  AssignProductRoleInput,
} from './compat.schema';

export const compatService = {

  // Groups
  getGroups: () => compatRepository.findAllGroups(),

  getGroupById: async (groupId: string) => {
    const group = await compatRepository.findGroupById(groupId);
    if (!group) throw new AppError('Grupo no encontrado.', 404, 'NOT_FOUND');
    return group;
  },

  createGroup: (data: CreateGroupInput) => compatRepository.createGroup(data),

  updateGroup: async (groupId: string, data: UpdateGroupInput) => {
    await compatService.getGroupById(groupId);
    return compatRepository.updateGroup(groupId, data);
  },

  deleteGroup: async (groupId: string) => {
    await compatService.getGroupById(groupId);
    await compatRepository.deleteGroup(groupId);
    return { message: 'Grupo eliminado.' };
  },

  // Component Roles
  getRoles: (groupId?: string) => compatRepository.findAllRoles(groupId),

  getRoleById: async (roleId: string) => {
    const role = await compatRepository.findRoleById(roleId);
    if (!role) throw new AppError('Rol no encontrado.', 404, 'NOT_FOUND');
    return role;
  },

  createRole: async (data: CreateComponentRoleInput) => {
    const slug = data.slug ?? await generateSlug(data.name, 'component_role' as any);
    return compatRepository.createRole(data, slug);
  },

  updateRole: async (roleId: string, data: UpdateComponentRoleInput) => {
    await compatService.getRoleById(roleId);
    return compatRepository.updateRole(roleId, data);
  },

  deleteRole: async (roleId: string) => {
    await compatService.getRoleById(roleId);
    await compatRepository.deleteRole(roleId);
    return { message: 'Rol eliminado.' };
  },

  // Compatibility Rules
  getRules: () => compatRepository.findAllRules(),

  getRuleById: async (ruleId: string) => {
    const rule = await compatRepository.findRuleById(ruleId);
    if (!rule) throw new AppError('Regla no encontrada.', 404, 'NOT_FOUND');
    return rule;
  },

  createRule: (data: CreateCompatibilityRuleInput) => compatRepository.createRule(data),

  updateRule: async (ruleId: string, data: UpdateCompatibilityRuleInput) => {
    await compatService.getRuleById(ruleId);
    return compatRepository.updateRule(ruleId, data);
  },

  deleteRule: async (ruleId: string) => {
    await compatService.getRuleById(ruleId);
    await compatRepository.deleteRule(ruleId);
    return { message: 'Regla eliminada.' };
  },

  // Product Roles
  getProductRoles:   (productId: string)             => compatRepository.findProductRoles(productId),
  assignProductRole: (data: AssignProductRoleInput)  => compatRepository.assignProductRole(data),
  removeProductRole: (data: AssignProductRoleInput)  => compatRepository.removeProductRole(data),
};