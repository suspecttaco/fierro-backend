import { Request, Response, NextFunction } from 'express';
import { returnsService } from './returns.service';
import { CreateReturnSchema, UpdateReturnStatusSchema } from './returns.schema';

export const returnsController = {

  createReturn: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const input = CreateReturnSchema.parse(req.body);
      const result = await returnsService.createReturn(input, res.locals.user.sub);
      res.status(201).json(result);
    } catch (err) { next(err); }
  },

  getReturns: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await returnsService.getReturns(res.locals.user.sub);
      res.json(result);
    } catch (err) { next(err); }
  },

  getReturnById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await returnsService.getReturnById(req.params.id as string, res.locals.user.sub);
      res.json(result);
    } catch (err) { next(err); }
  },

  // Admin
  getAllReturns: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page  = Number(req.query.page)  || 1;
      const limit = Number(req.query.limit) || 20;
      const result = await returnsService.getAllReturns(page, limit);
      res.json(result);
    } catch (err) { next(err); }
  },

  updateReturnStatus: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const input = UpdateReturnStatusSchema.parse(req.body);
      const result = await returnsService.updateReturnStatus(req.params.id as string, input, res.locals.user.sub);
      res.json(result);
    } catch (err) { next(err); }
  },

  getStockMovements: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { variantId, type, page, limit } = req.query;
      res.json(await returnsService.getStockMovements(
        variantId as string,
        type      as string,
        Number(page)  || 1,
        Number(limit) || 20,
      ));
    } catch (e) { next(e); }
  },
};