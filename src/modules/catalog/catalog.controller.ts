import { Request, Response, NextFunction } from 'express';
import { catalogService } from './catalog.service';
import { ProductListSchema, ProductSlugSchema } from './catalog.schema';

export const catalogController = {

  getProducts: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const input = ProductListSchema.parse(req.query);
      const result = await catalogService.getProducts(input);
      res.json(result);
    } catch (err) { next(err); }
  },

  getProductBySlug: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { slug } = ProductSlugSchema.parse(req.params);
      const result = await catalogService.getProductBySlug(slug);
      res.json(result);
    } catch (err) { next(err); }
  },

  getCategories: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await catalogService.getCategories();
      res.json(result);
    } catch (err) { next(err); }
  },

  getBrands: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await catalogService.getBrands();
      res.json(result);
    } catch (err) { next(err); }
  },

  getVariantById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.json(await catalogService.getVariantById(req.params.variantId as string));
    } catch (e) { next(e); }
  },
};