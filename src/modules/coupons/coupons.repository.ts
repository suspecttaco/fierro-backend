import { prisma } from '../../lib/prisma';
import type { CreateCouponInput, UpdateCouponInput } from './coupons.schema';

export const couponsRepository = {

  findAll: async (page: number, limit: number) => {
    const offset = (page - 1) * limit;
    const [items, total] = await Promise.all([
      prisma.coupon.findMany({ skip: offset, take: limit, orderBy: { created_at: 'desc' } }),
      prisma.coupon.count(),
    ]);
    return { items, total, page, limit };
  },

  findById: async (couponId: string) => {
    return prisma.coupon.findUnique({ where: { coupon_id: couponId } });
  },

  findByCode: async (code: string) => {
    return prisma.coupon.findUnique({ where: { code } });
  },

  create: async (data: CreateCouponInput) => {
    return prisma.coupon.create({
      data: {
        code:             data.code,
        discount_type:    data.discountType,
        discount_value:   data.discountValue,
        min_order_amount: data.minOrderAmount,
        max_uses:         data.maxUses,
        expires_at:       data.expiresAt ? new Date(data.expiresAt) : undefined,
        is_active:        data.isActive,
      },
    });
  },

  update: async (couponId: string, data: UpdateCouponInput) => {
    return prisma.coupon.update({
      where: { coupon_id: couponId },
      data: {
        code:             data.code,
        discount_type:    data.discountType,
        discount_value:   data.discountValue,
        min_order_amount: data.minOrderAmount,
        max_uses:         data.maxUses,
        expires_at:       data.expiresAt ? new Date(data.expiresAt) : undefined,
        is_active:        data.isActive,
      },
    });
  },

  delete: async (couponId: string) => {
    return prisma.coupon.delete({ where: { coupon_id: couponId } });
  },

  validate: async (code: string) => {
    return prisma.coupon.findFirst({
      where: {
        code,
        is_active: true,
        OR: [{ expires_at: null }, { expires_at: { gt: new Date() } }],
      },
    });
  },
};