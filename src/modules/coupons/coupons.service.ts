import { couponsRepository } from './coupons.repository';
import type { CreateCouponInput, UpdateCouponInput } from './coupons.schema';
import { AppError } from '../../util/errors';

export const couponsService = {

  getAll: (page = 1, limit = 20) => couponsRepository.findAll(page, limit),

  getById: async (couponId: string) => {
    const coupon = await couponsRepository.findById(couponId);
    if (!coupon) throw new AppError('Cupón no encontrado.', 404, 'NOT_FOUND');
    return coupon;
  },

  validate: async (code: string) => {
    const coupon = await couponsRepository.validate(code);
    if (!coupon) throw new AppError('Cupón inválido o expirado.', 400, 'INVALID_COUPON');
    return coupon;
  },

  create: async (data: CreateCouponInput) => {
    const exists = await couponsRepository.findByCode(data.code);
    if (exists) throw new AppError('El código de cupón ya existe.', 409, 'ALREADY_EXISTS');
    return couponsRepository.create(data);
  },

  update: async (couponId: string, data: UpdateCouponInput) => {
    await couponsService.getById(couponId);
    return couponsRepository.update(couponId, data);
  },

  delete: async (couponId: string) => {
    await couponsService.getById(couponId);
    await couponsRepository.delete(couponId);
    return { message: 'Cupón eliminado.' };
  },
};