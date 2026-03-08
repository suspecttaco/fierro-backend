import { prisma } from '../../lib/prisma';

export const reviewsRepository = {

  findVerifiedPurchase: async (userId: string, productId: string) => {
    return prisma.order_item.findFirst({
      where: {
        product_variant: { product_id: productId },
        order: { user_id: userId, status: 'delivered' },
      },
    });
  },

  findExistingReview: async (userId: string, productId: string) => {
    return prisma.review.findUnique({
      where: { user_id_product_id: { user_id: userId, product_id: productId } },
    });
  },

  createReview: async (data: {
    product_id: string;
    user_id:    string;
    rating:     number;
    title?:     string;
    body?:      string;
    is_verified_purchase: boolean;
    order_item_id?: string;
  }) => {
    return prisma.review.create({ data });
  },

  findReviewsByProduct: async (productId: string, page: number, limit: number) => {
    const offset = (page - 1) * limit;
    const [items, total] = await Promise.all([
      prisma.review.findMany({
        where: { product_id: productId, status: 'approved' },
        orderBy: { created_at: 'desc' },
        skip: offset,
        take: limit,
        include: { user: { select: { first_name: true, last_name: true } } },
      }),
      prisma.review.count({ where: { product_id: productId, status: 'approved' } }),
    ]);
    return { items, total, page, limit };
  },

  findAllReviews: async (page: number, limit: number) => {
    const offset = (page - 1) * limit;
    const [items, total] = await Promise.all([
      prisma.review.findMany({
        orderBy: { created_at: 'desc' },
        skip: offset,
        take: limit,
        include: {
          user:    { select: { first_name: true, last_name: true, email: true } },
          product: { select: { name: true, slug: true } },
        },
      }),
      prisma.review.count(),
    ]);
    return { items, total, page, limit };
  },

  updateReviewStatus: async (reviewId: string, status: string) => {
    return prisma.review.update({
      where: { review_id: reviewId },
      data:  { status },
    });
  },

  deleteReview: async (reviewId: string) => {
    return prisma.review.delete({ where: { review_id: reviewId } });
  },
};