import { prisma } from '../../lib/prisma';

export const wishlistRepository = {

  findByUser: async (userId: string) => {
    return prisma.wishlist.findMany({
      where:   { user_id: userId },
      include: {
        product: {
          include: {
            product_image: { where: { is_primary: true }, take: 1 },
            brand:         true,
          },
        },
      },
      orderBy: { added_at: 'desc' },
    });
  },

  findItem: async (userId: string, productId: string) => {
    return prisma.wishlist.findFirst({
      where: { user_id: userId, product_id: productId },
    });
  },

  add: async (userId: string, productId: string) => {
    return prisma.wishlist.create({
      data: { user_id: userId, product_id: productId },
    });
  },

  remove: async (userId: string, productId: string) => {
    return prisma.wishlist.deleteMany({
      where: { user_id: userId, product_id: productId },
    });
  },

  clear: async (userId: string) => {
    return prisma.wishlist.deleteMany({
      where: { user_id: userId },
    });
  },
};