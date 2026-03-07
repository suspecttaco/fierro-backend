import { Request, Response, NextFunction } from 'express';
import { cartService } from './cart.service';
import { AddToCartSchema, UpdateCartItemSchema, ApplyCouponSchema } from './cart.schema';

export const cartController = {

  getCart: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId       = res.locals.user?.sub as string | undefined;
      const sessionToken = !userId 
        ? req.headers['x-session-token'] as string | undefined 
        : undefined;
      const result = await cartService.getCart(userId, sessionToken);
      res.json(result);
    } catch (err) { next(err); }
  },

  addItem: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId       = res.locals.user?.sub as string | undefined;
      const sessionToken = !userId 
        ? req.headers['x-session-token'] as string | undefined 
        : undefined;
      const input = AddToCartSchema.parse(req.body);
      const result = await cartService.addItem(input, userId, sessionToken);
      res.status(201).json(result);
    } catch (err) { next(err); }
  },

  updateItem: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId       = res.locals.user?.sub as string | undefined;
      const sessionToken = !userId 
        ? req.headers['x-session-token'] as string | undefined 
        : undefined;
      const input = UpdateCartItemSchema.parse(req.body);
      const result = await cartService.updateItem(req.params.id as string, input, userId, sessionToken);
      res.json(result);
    } catch (err) { next(err); }
  },

  deleteItem: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId       = res.locals.user?.sub as string | undefined;
      const sessionToken = !userId 
        ? req.headers['x-session-token'] as string | undefined 
        : undefined;
      const result = await cartService.deleteItem(req.params.id as string, userId, sessionToken);
      res.json(result);
    } catch (err) { next(err); }
  },

  applyCoupon: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { code } = ApplyCouponSchema.parse(req.body);
      const result = await cartService.applyCoupon(code);
      res.json(result);
    } catch (err) { next(err); }
  },
};