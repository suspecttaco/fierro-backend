import { Request, Response, NextFunction } from 'express';
import { productImagesService } from './product-images.service';
import { AddProductImageSchema, UpdateProductImageSchema } from './product-images.schema';

export const productImagesController = {
  getByProduct: async (req: Request, res: Response, next: NextFunction) => {
    try { res.json(await productImagesService.getByProduct(req.params.productId as string)); } catch (e) { next(e); }
  },
  add: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const input = AddProductImageSchema.parse(req.body);
      res.status(201).json(await productImagesService.add(req.params.productId  as string, input));
    } catch (e) { next(e); }
  },
  update: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const input = UpdateProductImageSchema.parse(req.body);
      res.json(await productImagesService.update(req.params.imageId  as string, req.params.productId  as string, input));
    } catch (e) { next(e); }
  },
  delete: async (req: Request, res: Response, next: NextFunction) => {
    try { res.json(await productImagesService.delete(req.params.imageId  as string)); } catch (e) { next(e); }
  },
};