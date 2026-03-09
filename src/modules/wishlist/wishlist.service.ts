import { wishlistRepository } from './wishlist.repository';
import type { AddToWishlistInput } from './wishlist.schema';
import { AppError } from '../../util/errors';

export const wishlistService = {

  getWishlist: async (userId: string) => {
    return wishlistRepository.findByUser(userId);
  },

  add: async (input: AddToWishlistInput, userId: string) => {
    const exists = await wishlistRepository.findItem(userId, input.productId);
    if (exists) throw new AppError('El producto ya está en tu wishlist.', 409, 'ALREADY_EXISTS');
    return wishlistRepository.add(userId, input.productId);
  },

  remove: async (productId: string, userId: string) => {
    await wishlistRepository.remove(userId, productId);
    return { message: 'Producto eliminado de la wishlist.' };
  },

  clear: async (userId: string) => {
    await wishlistRepository.clear(userId);
    return { message: 'Wishlist vaciada.' };
  },
};