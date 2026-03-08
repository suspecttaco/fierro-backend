import { reviewsRepository } from './reviews.repository';
import { sanitizeObject } from '../../util/sanitizer';
import type { CreateReviewInput, UpdateReviewStatusInput } from './reviews.schema';

export const reviewsService = {

  createReview: async (input: CreateReviewInput, userId: string) => {
    const existing = await reviewsRepository.findExistingReview(userId, input.productId);
    if (existing) {
      const err: any = new Error('Ya tienes una reseña para este producto');
      err.statusCode = 409;
      err.code = 'REVIEW_ALREADY_EXISTS';
      throw err;
    }

    const verifiedPurchase = await reviewsRepository.findVerifiedPurchase(userId, input.productId);
    const clean = sanitizeObject(input as any);

    return reviewsRepository.createReview({
      product_id:           input.productId,
      user_id:              userId,
      rating:               input.rating,
      title:                clean.title,
      body:                 clean.body,
      is_verified_purchase: !!verifiedPurchase,
      order_item_id:        verifiedPurchase?.order_item_id,
    });
  },

  getReviewsByProduct: async (productId: string, page = 1, limit = 20) => {
    const { items, total } = await reviewsRepository.findReviewsByProduct(productId, page, limit);
    return {
      data: items.map(r => ({
        reviewId:            r.review_id,
        rating:              r.rating,
        title:               r.title,
        body:                r.body,
        isVerifiedPurchase:  r.is_verified_purchase,
        helpfulCount:        r.helpful_count,
        createdAt:           r.created_at,
        user:                `${r.user.first_name} ${r.user.last_name}`,
      })),
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  },

  getAllReviews: async (page = 1, limit = 20) => {
    const { items, total } = await reviewsRepository.findAllReviews(page, limit);
    return {
      data: items,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  },

  updateReviewStatus: async (reviewId: string, input: UpdateReviewStatusInput) => {
    return reviewsRepository.updateReviewStatus(reviewId, input.status);
  },

  deleteReview: async (reviewId: string) => {
    await reviewsRepository.deleteReview(reviewId);
    return { message: 'Reseña eliminada.' };
  },
};