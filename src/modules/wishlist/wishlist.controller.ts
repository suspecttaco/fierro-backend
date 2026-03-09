import { Request, Response, NextFunction } from 'express';
import { wishlistService } from './wishlist.service';
import { AddToWishlistSchema } from './wishlist.schema';

export const wishlistController = {

  getWishlist: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await wishlistService.getWishlist(res.locals.user.sub);
      res.json(result);
    } catch (err) { next(err); }
  },

  add: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const input = AddToWishlistSchema.parse(req.body);
      const result = await wishlistService.add(input, res.locals.user.sub);
      res.status(201).json(result);
    } catch (err) { next(err); }
  },

  remove: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await wishlistService.remove(req.params.productId as string, res.locals.user.sub);
      res.json(result);
    } catch (err) { next(err); }
  },

  clear: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await wishlistService.clear(res.locals.user.sub);
      res.json(result);
    } catch (err) { next(err); }
  },
};