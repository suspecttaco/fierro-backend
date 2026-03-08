import { buildsRepository } from './builds.repository';
import { prisma } from '../../lib/prisma';
import crypto from 'crypto';
import type { CreateBuildInput, AddBuildItemInput, UpdateBuildInput } from './builds.schema';

export const buildsService = {

  getGroups: async () => {
    return buildsRepository.findGroups();
  },

  createBuild: async (input: CreateBuildInput, userId: string) => {
    return buildsRepository.createBuild(userId, {
      name:     input.name,
      group_id: input.groupId,
    });
  },

  getBuildById: async (buildId: string, userId?: string) => {
    const build = await buildsRepository.findBuildById(buildId);
    if (!build) {
      const err: any = new Error('Build no encontrado');
      err.statusCode = 404;
      err.code = 'BUILD_NOT_FOUND';
      throw err;
    }
    if (!build.is_public && build.user_id !== userId) {
      const err: any = new Error('No autorizado');
      err.statusCode = 403;
      err.code = 'FORBIDDEN';
      throw err;
    }
    return build;
  },

  getBuildsByUser: async (userId: string) => {
    return buildsRepository.findBuildsByUser(userId);
  },

  getPublicBuilds: async (page = 1, limit = 20) => {
    const { items, total } = await buildsRepository.findPublicBuilds(page, limit);
    return {
      data: items,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  },

  getBuildByShareToken: async (token: string) => {
    const build = await buildsRepository.findBuildByShareToken(token);
    if (!build) {
      const err: any = new Error('Build no encontrado');
      err.statusCode = 404;
      err.code = 'BUILD_NOT_FOUND';
      throw err;
    }
    return build;
  },

  addItem: async (buildId: string, input: AddBuildItemInput, userId: string) => {
    const build = await buildsRepository.findBuildById(buildId);
    if (!build || build.user_id !== userId) {
      const err: any = new Error('Build no encontrado');
      err.statusCode = 404;
      err.code = 'BUILD_NOT_FOUND';
      throw err;
    }

    const variant = await prisma.product_variant.findUnique({
      where: { variant_id: input.variantId },
      include: { product: { select: { base_price: true } } },
    });
    if (!variant) {
      const err: any = new Error('Variante no encontrada');
      err.statusCode = 404;
      err.code = 'VARIANT_NOT_FOUND';
      throw err;
    }

    const unitPrice = Number(variant.product.base_price) + Number(variant.price_modifier);

    await buildsRepository.addBuildItem(buildId, {
      role_id:    input.roleId,
      variant_id: input.variantId,
      quantity:   input.quantity,
      unit_price: unitPrice,
    });

    await buildsRepository.recalculateTotalPrice(buildId);
    return buildsRepository.findBuildById(buildId);
  },

  removeItem: async (buildId: string, buildItemId: string, userId: string) => {
    const build = await buildsRepository.findBuildById(buildId);
    if (!build || build.user_id !== userId) {
      const err: any = new Error('Build no encontrado');
      err.statusCode = 404;
      err.code = 'BUILD_NOT_FOUND';
      throw err;
    }
    await buildsRepository.removeBuildItem(buildItemId);
    await buildsRepository.recalculateTotalPrice(buildId);
    return buildsRepository.findBuildById(buildId);
  },

  updateBuild: async (buildId: string, input: UpdateBuildInput, userId: string) => {
    const build = await buildsRepository.findBuildById(buildId);
    if (!build || build.user_id !== userId) {
      const err: any = new Error('Build no encontrado');
      err.statusCode = 404;
      err.code = 'BUILD_NOT_FOUND';
      throw err;
    }
    return buildsRepository.updateBuild(buildId, {
      name:      input.name,
      is_public: input.isPublic,
    });
  },

  deleteBuild: async (buildId: string, userId: string) => {
    const build = await buildsRepository.findBuildById(buildId);
    if (!build || build.user_id !== userId) {
      const err: any = new Error('Build no encontrado');
      err.statusCode = 404;
      err.code = 'BUILD_NOT_FOUND';
      throw err;
    }
    await buildsRepository.deleteBuild(buildId);
    return { message: 'Build eliminado.' };
  },

  generateShareToken: async (buildId: string, userId: string) => {
    const build = await buildsRepository.findBuildById(buildId);
    if (!build || build.user_id !== userId) {
      const err: any = new Error('Build no encontrado');
      err.statusCode = 404;
      err.code = 'BUILD_NOT_FOUND';
      throw err;
    }
    const token = crypto.randomBytes(32).toString('hex');
    await buildsRepository.updateBuild(buildId, { share_token: token, is_public: true });
    return { shareToken: token, shareUrl: `/builds/share/${token}` };
  },

  checkCompatibility: async (buildId: string, userId: string) => {
    const build = await buildsRepository.findBuildById(buildId);
    if (!build || build.user_id !== userId) {
      const err: any = new Error('Build no encontrado');
      err.statusCode = 404;
      err.code = 'BUILD_NOT_FOUND';
      throw err;
    }

    const results = await buildsRepository.checkCompatibility(buildId);
    await buildsRepository.saveCompatResults(buildId, results.map(r => ({
      rule_id:  r.rule_id,
      passed:   r.passed,
      severity: r.severity,
      message:  r.message,
    })));

    const allPassed = results.every(r => r.passed);
    await buildsRepository.updateBuild(buildId, {
      status: allPassed ? 'complete' : 'incompatible',
    });

    return {
      compatible: allPassed,
      results,
    };
  },
};