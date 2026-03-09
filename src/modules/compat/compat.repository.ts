import { prisma } from '../../lib/prisma';
import type {
  CreateGroupInput, UpdateGroupInput,
  CreateComponentRoleInput, UpdateComponentRoleInput,
  CreateCompatibilityRuleInput, UpdateCompatibilityRuleInput,
  AssignProductRoleInput,
} from './compat.schema';

export const compatRepository = {

  // Groups
  findAllGroups: async () => {
    return prisma.compatibility_group.findMany({
      where:   { is_active: true },
      include: { component_role: { orderBy: { sort_order: 'asc' } } },
      orderBy: { name: 'asc' },
    });
  },

  findGroupById: async (groupId: string) => {
    return prisma.compatibility_group.findUnique({
      where:   { group_id: groupId },
      include: { component_role: { orderBy: { sort_order: 'asc' } } },
    });
  },

  createGroup: async (data: CreateGroupInput) => {
    return prisma.compatibility_group.create({
      data: { name: data.name, description: data.description, is_active: data.isActive },
    });
  },

  updateGroup: async (groupId: string, data: UpdateGroupInput) => {
    return prisma.compatibility_group.update({
      where: { group_id: groupId },
      data:  { name: data.name, description: data.description, is_active: data.isActive },
    });
  },

  deleteGroup: async (groupId: string) => {
    return prisma.compatibility_group.delete({ where: { group_id: groupId } });
  },

  // Component Roles
  findAllRoles: async (groupId?: string) => {
    return prisma.component_role.findMany({
      where:   groupId ? { group_id: groupId } : undefined,
      include: { compatibility_group: true },
      orderBy: { sort_order: 'asc' },
    });
  },

  findRoleById: async (roleId: string) => {
    return prisma.component_role.findUnique({
      where:   { role_id: roleId },
      include: { compatibility_group: true },
    });
  },

  createRole: async (data: CreateComponentRoleInput, slug: string) => {
    return prisma.component_role.create({
      data: {
        group_id:     data.groupId,
        name:         data.name,
        slug,
        is_required:  data.isRequired,
        max_quantity: data.maxQuantity,
        sort_order:   data.sortOrder,
      },
    });
  },

  updateRole: async (roleId: string, data: UpdateComponentRoleInput) => {
    return prisma.component_role.update({
      where: { role_id: roleId },
      data: {
        name:         data.name,
        is_required:  data.isRequired,
        max_quantity: data.maxQuantity,
        sort_order:   data.sortOrder,
      },
    });
  },

  deleteRole: async (roleId: string) => {
    return prisma.component_role.delete({ where: { role_id: roleId } });
  },

  // Compatibility Rules
  findAllRules: async () => {
    return prisma.compatibility_rule.findMany({
      include: {
        component_role_compatibility_rule_source_role_idTocomponent_role: true,
        component_role_compatibility_rule_target_role_idTocomponent_role: true,
        attribute_type_compatibility_rule_source_attr_type_idToattribute_type: true,
        attribute_type_compatibility_rule_target_attr_type_idToattribute_type: true,
      },
      orderBy: { created_at: 'desc' },
    });
  },

  findRuleById: async (ruleId: string) => {
    return prisma.compatibility_rule.findUnique({
      where: { rule_id: ruleId },
      include: {
        component_role_compatibility_rule_source_role_idTocomponent_role: true,
        component_role_compatibility_rule_target_role_idTocomponent_role: true,
      },
    });
  },

  createRule: async (data: CreateCompatibilityRuleInput) => {
    return prisma.compatibility_rule.create({
      data: {
        source_attr_type_id: data.sourceAttrTypeId,
        target_attr_type_id: data.targetAttrTypeId,
        source_role_id:      data.sourceRoleId,
        target_role_id:      data.targetRoleId,
        operator:            data.operator,
        rule_type:           data.ruleType,
        message:             data.message,
        is_active:           data.isActive,
      },
    });
  },

  updateRule: async (ruleId: string, data: UpdateCompatibilityRuleInput) => {
    return prisma.compatibility_rule.update({
      where: { rule_id: ruleId },
      data: {
        source_attr_type_id: data.sourceAttrTypeId,
        target_attr_type_id: data.targetAttrTypeId,
        source_role_id:      data.sourceRoleId,
        target_role_id:      data.targetRoleId,
        operator:            data.operator,
        rule_type:           data.ruleType,
        message:             data.message,
        is_active:           data.isActive,
      },
    });
  },

  deleteRule: async (ruleId: string) => {
    return prisma.compatibility_rule.delete({ where: { rule_id: ruleId } });
  },

  // Product Roles
  assignProductRole: async (data: AssignProductRoleInput) => {
    return prisma.product_role.create({
      data: { product_id: data.productId, role_id: data.roleId },
    });
  },

  removeProductRole: async (data: AssignProductRoleInput) => {
    return prisma.product_role.deleteMany({
      where: { product_id: data.productId, role_id: data.roleId },
    });
  },

  findProductRoles: async (productId: string) => {
    return prisma.product_role.findMany({
      where:   { product_id: productId },
      include: { component_role: true },
    });
  },
};