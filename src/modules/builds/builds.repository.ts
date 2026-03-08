import { prisma } from '../../lib/prisma';

export const buildsRepository = {

  findGroups: async () => {
    return prisma.compatibility_group.findMany({
      where: { is_active: true },
      include: {
        component_role: {
          orderBy: { sort_order: 'asc' },
          select: {
            role_id: true, name: true, slug: true,
            is_required: true, max_quantity: true, sort_order: true,
          },
        },
      },
    });
  },

  createBuild: async (userId: string, data: {
    name: string; group_id: string;
  }) => {
    return prisma.build.create({
      data: { user_id: userId, ...data },
      include: { build_item: true, compatibility_group: true },
    });
  },

  findBuildById: async (buildId: string) => {
    return prisma.build.findUnique({
      where: { build_id: buildId },
      include: {
        compatibility_group: {
          include: { component_role: { orderBy: { sort_order: 'asc' } } },
        },
        build_item: {
          include: {
            component_role: true,
            product_variant: {
              include: {
                product: { select: { name: true, slug: true, product_image: { where: { is_primary: true }, take: 1 } } }
              },
            },
          },
        },
        build_compat_result: true,
      },
    });
  },

  findBuildsByUser: async (userId: string) => {
    return prisma.build.findMany({
      where: { user_id: userId },
      orderBy: { updated_at: 'desc' },
      include: {
        build_item: { select: { build_item_id: true } },
        compatibility_group: { select: { name: true } },
      },
    });
  },

  findPublicBuilds: async (page: number, limit: number) => {
    const offset = (page - 1) * limit;
    const [items, total] = await Promise.all([
      prisma.build.findMany({
        where: { is_public: true, status: 'complete' },
        orderBy: { updated_at: 'desc' },
        skip: offset,
        take: limit,
        include: {
          build_item: { select: { build_item_id: true } },
          compatibility_group: { select: { name: true } },
          user: { select: { first_name: true, last_name: true } },
        },
      }),
      prisma.build.count({ where: { is_public: true, status: 'complete' } }),
    ]);
    return { items, total, page, limit };
  },

  findBuildByShareToken: async (token: string) => {
    return prisma.build.findUnique({
      where: { share_token: token },
      include: {
        build_item: {
          include: {
            component_role: true,
            product_variant: {
              include: {
                product: { select: { name: true, slug: true, product_image: { where: { is_primary: true }, take: 1 } } }
              },
            },
          },
        },
        compatibility_group: true,
      },
    });
  },

  addBuildItem: async (buildId: string, data: {
    role_id: string; variant_id: string; quantity: number; unit_price: number;
  }) => {
    return prisma.build_item.create({
      data: { build_id: buildId, ...data },
    });
  },

  removeBuildItem: async (buildItemId: string) => {
    return prisma.build_item.delete({ where: { build_item_id: buildItemId } });
  },

  updateBuild: async (buildId: string, data: {
    name?: string; is_public?: boolean; status?: string;
    total_price?: number; share_token?: string;
  }) => {
    return prisma.build.update({ where: { build_id: buildId }, data });
  },

  deleteBuild: async (buildId: string) => {
    return prisma.build.delete({ where: { build_id: buildId } });
  },

  checkCompatibility: async (buildId: string) => {
    return prisma.$queryRaw<{ passed: boolean; severity: string; message: string; rule_id: string }[]>`
      SELECT r.rule_id, r.message, r.rule_type as severity,
             (
               SELECT COUNT(*) = 0 FROM catalog.product_attribute pa1
               JOIN catalog.product_attribute pa2
                 ON pa1.attr_type_id = r.source_attr_type_id
                AND pa2.attr_type_id = r.target_attr_type_id
               JOIN compat.build_item bi1 ON bi1.variant_id = pa1.variant_id AND bi1.build_id = ${buildId}::uuid AND bi1.role_id = r.source_role_id
               JOIN compat.build_item bi2 ON bi2.variant_id = pa2.variant_id AND bi2.build_id = ${buildId}::uuid AND bi2.role_id = r.target_role_id
               WHERE pa1.value_num IS NOT NULL AND pa2.value_num IS NOT NULL
                 AND CASE r.operator
                       WHEN 'eq'  THEN pa1.value_num != pa2.value_num
                       WHEN 'gte' THEN pa1.value_num < pa2.value_num
                       WHEN 'lte' THEN pa1.value_num > pa2.value_num
                     END
             ) as passed
      FROM compat.compatibility_rule r
      WHERE r.is_active = true
    `;
  },

  saveCompatResults: async (buildId: string, results: {
    rule_id: string; passed: boolean; severity: string; message: string;
  }[]) => {
    await prisma.build_compat_result.deleteMany({ where: { build_id: buildId } });
    if (results.length === 0) return;
    await prisma.build_compat_result.createMany({
      data: results.map(r => ({ build_id: buildId, ...r, checked_at: new Date() })),
    });
  },

  recalculateTotalPrice: async (buildId: string) => {
    const items = await prisma.build_item.findMany({
      where: { build_id: buildId },
      select: { unit_price: true, quantity: true },
    });
    const total = items.reduce((sum, i) => sum + Number(i.unit_price) * i.quantity, 0);
    return prisma.build.update({
      where: { build_id: buildId },
      data:  { total_price: total, updated_at: new Date() },
    });
  },
};