import { Request, Response, NextFunction } from 'express';
import { promotionsService } from './promotions.service';
import { CreatePromotionSchema, UpdatePromotionSchema, AssignPromotionProductsSchema } from './promotions.schema';

export const promotionsController = {

  getAll: async (req: Request, res: Response, next: NextFunction) => {
    try { res.json(await promotionsService.getAll(Number(req.query.page) || 1, Number(req.query.limit) || 20)); } catch (e) { next(e); }
  },

  getActive: async (req: Request, res: Response, next: NextFunction) => {
    try { res.json(await promotionsService.getActive()); } catch (e) { next(e); }
  },

  getById: async (req: Request, res: Response, next: NextFunction) => {
    try { res.json(await promotionsService.getById(req.params.id as string)); } catch (e) { next(e); }
  },

  create: async (req: Request, res: Response, next: NextFunction) => {
    try { res.status(201).json(await promotionsService.create(CreatePromotionSchema.parse(req.body))); } catch (e) { next(e); }
  },

  update: async (req: Request, res: Response, next: NextFunction) => {
    try { res.json(await promotionsService.update(req.params.id as string, UpdatePromotionSchema.parse(req.body))); } catch (e) { next(e); }
  },

  delete: async (req: Request, res: Response, next: NextFunction) => {
    try { res.json(await promotionsService.delete(req.params.id as string)); } catch (e) { next(e); }
  },

  assignProducts: async (req: Request, res: Response, next: NextFunction) => {
    try { res.json(await promotionsService.assignProducts(req.params.id as string, AssignPromotionProductsSchema.parse(req.body))); } catch (e) { next(e); }
  },

  removeProducts: async (req: Request, res: Response, next: NextFunction) => {
    try { res.json(await promotionsService.removeProducts(req.params.id as string, AssignPromotionProductsSchema.parse(req.body))); } catch (e) { next(e); }
  },
};