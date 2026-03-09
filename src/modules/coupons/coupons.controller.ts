import { Request, Response, NextFunction } from 'express';
import { couponsService } from './coupons.service';
import { CreateCouponSchema, UpdateCouponSchema } from './coupons.schema';

export const couponsController = {
  getAll: async (req: Request, res: Response, next: NextFunction) => {
    try { res.json(await couponsService.getAll(Number(req.query.page) || 1, Number(req.query.limit) || 20)); } catch (e) { next(e); }
  },
  getById: async (req: Request, res: Response, next: NextFunction) => {
    try { res.json(await couponsService.getById(req.params.id as string)); } catch (e) { next(e); }
  },
  validate: async (req: Request, res: Response, next: NextFunction) => {
    try { res.json(await couponsService.validate(req.params.code as string)); } catch (e) { next(e); }
  },
  create: async (req: Request, res: Response, next: NextFunction) => {
    try { res.status(201).json(await couponsService.create(CreateCouponSchema.parse(req.body))); } catch (e) { next(e); }
  },
  update: async (req: Request, res: Response, next: NextFunction) => {
    try { res.json(await couponsService.update(req.params.id  as string, UpdateCouponSchema.parse(req.body))); } catch (e) { next(e); }
  },
  delete: async (req: Request, res: Response, next: NextFunction) => {
    try { res.json(await couponsService.delete(req.params.id  as string)); } catch (e) { next(e); }
  },
};