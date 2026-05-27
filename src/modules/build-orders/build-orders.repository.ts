import { prisma } from '../../lib/prisma';

const buildOrderInclude = {
  build: {
    include: {
      compatibility_group: { select: { name: true } },
      build_item: {
        include: {
          component_role: { select: { name: true, slug: true } },
          product_variant: {
            include: {
              product: { select: { name: true, slug: true, product_image: { where: { is_primary: true }, take: 1 } } },
            },
          },
        },
      },
      build_compat_result: true,
    },
  },
  user: { select: { user_id: true, first_name: true, last_name: true, email: true } },
  observations: {
    include: { author: { select: { user_id: true, first_name: true, last_name: true, email: true } } },
    orderBy: { created_at: 'asc' as const },
  },
};

export const buildOrdersRepository = {

  create: async (data: {
    build_id: string;
    user_id: string;
    order_number: string;
    components_total: number;
    notes?: string;
  }) => {
    return prisma.build_order.create({
      data: {
        ...data,
        total: data.components_total,
      },
      include: buildOrderInclude,
    });
  },

  findById: async (buildOrderId: string) => {
    return prisma.build_order.findUnique({
      where: { build_order_id: buildOrderId },
      include: buildOrderInclude,
    });
  },

  findByUser: async (userId: string, page: number, limit: number, status?: string) => {
    const where: any = { user_id: userId };
    if (status) where.status = status;
    const offset = (page - 1) * limit;
    const [items, total] = await Promise.all([
      prisma.build_order.findMany({
        where,
        skip: offset,
        take: limit,
        orderBy: { created_at: 'desc' },
        include: {
          build: {
            select: {
              name: true,
              total_price: true,
              compatibility_group: { select: { name: true } },
              build_item: { select: { build_item_id: true } },
            },
          },
          observations: {
            orderBy: { created_at: 'desc' },
            take: 1,
          },
        },
      }),
      prisma.build_order.count({ where }),
    ]);
    return { items, total };
  },

  findAll: async (page: number, limit: number, status?: string) => {
    const where: any = {};
    if (status) where.status = status;
    const offset = (page - 1) * limit;
    const [items, total] = await Promise.all([
      prisma.build_order.findMany({
        where,
        skip: offset,
        take: limit,
        orderBy: { created_at: 'desc' },
        include: {
          user: { select: { user_id: true, first_name: true, last_name: true, email: true } },
          build: {
            select: {
              name: true,
              total_price: true,
              compatibility_group: { select: { name: true } },
              build_item: { select: { build_item_id: true } },
            },
          },
          observations: {
            orderBy: { created_at: 'desc' },
            take: 1,
          },
        },
      }),
      prisma.build_order.count({ where }),
    ]);
    return { items, total };
  },

  updateStatus: async (buildOrderId: string, status: string) => {
    return prisma.build_order.update({
      where: { build_order_id: buildOrderId },
      data: { status, updated_at: new Date() },
    });
  },

  updateFee: async (buildOrderId: string, assemblyFee: number, componentsTotal: number) => {
    return prisma.build_order.update({
      where: { build_order_id: buildOrderId },
      data: {
        assembly_fee: assemblyFee,
        total: componentsTotal + assemblyFee,
        updated_at: new Date(),
      },
    });
  },

  addObservation: async (data: {
    build_order_id: string;
    author_id: string;
    type: string;
    message: string;
  }) => {
    return prisma.build_order_observation.create({ data });
  },

  cancel: async (buildOrderId: string) => {
    return prisma.build_order.update({
      where: { build_order_id: buildOrderId },
      data: { status: 'cancelled', updated_at: new Date() },
    });
  },
};
