import { prisma } from '../../lib/prisma';
import type { CreatePromotionInput, UpdatePromotionInput } from './promotions.schema';

export const promotionsRepository = {

  findAll: async (page: number, limit: number) => {
    const offset = (page - 1) * limit;
    const [items, total] = await Promise.all([
      prisma.promotion.findMany({
        skip:    offset,
        take:    limit,
        orderBy: { starts_at: 'desc' },
        include: { promotion_product: { include: { product: true } } },
      }),
      prisma.promotion.count(),
    ]);
    return { items, total, page, limit };
  },

  findActive: async () => {
    return prisma.promotion.findMany({
      where: {
        is_active: true,
        starts_at: { lte: new Date() },
        ends_at:   { gte: new Date() },
      },
      include: { promotion_product: { include: { product: true } } },
    });
  },

  findById: async (promoId: string) => {
    return prisma.promotion.findUnique({
      where:   { promo_id: promoId },
      include: { promotion_product: { include: { product: true } } },
    });
  },

  create: async (data: CreatePromotionInput) => {
    return prisma.promotion.create({
      data: {
        name:             data.name,
        type:             data.type,
        discount_percent: data.discountPercent,
        starts_at:        new Date(data.startsAt),
        ends_at:          new Date(data.endsAt),
        is_active:        data.isActive,
      },
    });
  },

  update: async (promoId: string, data: UpdatePromotionInput) => {
    return prisma.promotion.update({
      where: { promo_id: promoId },
      data: {
        name:             data.name,
        type:             data.type,
        discount_percent: data.discountPercent,
        starts_at:        data.startsAt ? new Date(data.startsAt) : undefined,
        ends_at:          data.endsAt   ? new Date(data.endsAt)   : undefined,
        is_active:        data.isActive,
      },
    });
  },

  delete: async (promoId: string) => {
    return prisma.promotion.delete({ where: { promo_id: promoId } });
  },

  assignProducts: async (promoId: string, productIds: string[]) => {
    const data = productIds.map(product_id => ({ promo_id: promoId, product_id }));
    return prisma.promotion_product.createMany({ data, skipDuplicates: true });
  },

  removeProducts: async (promoId: string, productIds: string[]) => {
    return prisma.promotion_product.deleteMany({
      where: { promo_id: promoId, product_id: { in: productIds } },
    });
  },
};