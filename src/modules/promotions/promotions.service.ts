import { promotionsRepository } from './promotions.repository';
import type { CreatePromotionInput, UpdatePromotionInput, AssignPromotionProductsInput } from './promotions.schema';
import { AppError } from '../../util/errors';

export const promotionsService = {

  getAll: (page = 1, limit = 20) => promotionsRepository.findAll(page, limit),

  getActive: () => promotionsRepository.findActive(),

  getById: async (promoId: string) => {
    const promo = await promotionsRepository.findById(promoId);
    if (!promo) throw new AppError('Promoción no encontrada.', 404, 'NOT_FOUND');
    return promo;
  },

  create: (data: CreatePromotionInput) => promotionsRepository.create(data),

  update: async (promoId: string, data: UpdatePromotionInput) => {
    await promotionsService.getById(promoId);
    return promotionsRepository.update(promoId, data);
  },

  delete: async (promoId: string) => {
    await promotionsService.getById(promoId);
    await promotionsRepository.delete(promoId);
    return { message: 'Promoción eliminada.' };
  },

  assignProducts: async (promoId: string, data: AssignPromotionProductsInput) => {
    await promotionsService.getById(promoId);
    return promotionsRepository.assignProducts(promoId, data.productIds);
  },

  removeProducts: async (promoId: string, data: AssignPromotionProductsInput) => {
    await promotionsService.getById(promoId);
    return promotionsRepository.removeProducts(promoId, data.productIds);
  },
};