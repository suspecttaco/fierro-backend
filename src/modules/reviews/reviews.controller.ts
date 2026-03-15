import { Request, Response, NextFunction } from 'express';
import { reviewsService } from './reviews.service';
import { CreateReviewSchema, UpdateReviewStatusSchema } from './reviews.schema';

export const reviewsController = {

  canReview: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await reviewsService.canReview(req.params.productId as string, res.locals.user.sub);
      res.json(result);
    } catch (err) { next(err); }
  },

  getMyReview: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await reviewsService.getMyReview(req.params.productId as string, res.locals.user.sub);
      res.json(result);
    } catch (err) { next(err); }
  },

  createReview: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const input = CreateReviewSchema.parse(req.body);
      const result = await reviewsService.createReview(input, res.locals.user.sub);
      res.status(201).json(result);
    } catch (err) { next(err); }
  },

  getReviewsByProduct: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 20;
      const result = await reviewsService.getReviewsByProduct(req.params.productId as string, page, limit);
      res.json(result);
    } catch (err) { next(err); }
  },

  // Admin
  getAllReviews: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 20;
      const result = await reviewsService.getAllReviews(page, limit);
      res.json(result);
    } catch (err) { next(err); }
  },

  updateReviewStatus: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const input = UpdateReviewStatusSchema.parse(req.body);
      const result = await reviewsService.updateReviewStatus(req.params.id as string, input);
      res.json(result);
    } catch (err) { next(err); }
  },

  deleteReview: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await reviewsService.deleteReview(req.params.id as string);
      res.json(result);
    } catch (err) { next(err); }
  },
};