import { Request, Response, NextFunction } from 'express';
import { ordersService } from './orders.service';
import { CheckoutSchema, UpdateOrderStatusSchema } from './orders.schema';

export const ordersController = {

  checkout: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const input = CheckoutSchema.parse(req.body);
      const result = await ordersService.checkout(input, res.locals.user.sub);
      res.status(201).json(result);
    } catch (err) { next(err); }
  },

  getOrders: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page  = Number(req.query.page)  || 1;
      const limit = Number(req.query.limit) || 20;
      const result = await ordersService.getOrders(res.locals.user.sub, page, limit);
      res.json(result);
    } catch (err) { next(err); }
  },

  getOrderById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await ordersService.getOrderById(req.params.id as string, res.locals.user.sub);
      res.json(result);
    } catch (err) { next(err); }
  },

  cancelOrder: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await ordersService.cancelOrder(req.params.id as string, res.locals.user.sub);
      res.json(result);
    } catch (err) { next(err); }
  },

  // Admin
  getAllOrders: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page  = Number(req.query.page)  || 1;
      const limit = Number(req.query.limit) || 20;
      const result = await ordersService.getAllOrders(page, limit);
      res.json(result);
    } catch (err) { next(err); }
  },

  updateOrderStatus: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const input = UpdateOrderStatusSchema.parse(req.body);
      const result = await ordersService.updateOrderStatus(req.params.id as string, input);
      res.json(result);
    } catch (err) { next(err); }
  },
};