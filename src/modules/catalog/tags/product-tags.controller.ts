import { Request, Response, NextFunction } from 'express';
import { productTagsService } from './product-tags.service';
import { CreateTagSchema, AssignTagsSchema } from './product-tags.schema';

export const productTagsController = {
  getAllTags:    async (req: Request, res: Response, next: NextFunction) => {
    try { res.json(await productTagsService.getAllTags()); } catch (e) { next(e); }
  },
  getByProduct: async (req: Request, res: Response, next: NextFunction) => {
    try { res.json(await productTagsService.getByProduct(req.params.productId as string)); } catch (e) { next(e); }
  },
  createTag: async (req: Request, res: Response, next: NextFunction) => {
    try { res.status(201).json(await productTagsService.createTag(CreateTagSchema.parse(req.body))); } catch (e) { next(e); }
  },
  deleteTag: async (req: Request, res: Response, next: NextFunction) => {
    try { res.json(await productTagsService.deleteTag(req.params.tagId  as string)); } catch (e) { next(e); }
  },
  assignTags: async (req: Request, res: Response, next: NextFunction) => {
    try { res.json(await productTagsService.assignTags(req.params.productId as string, AssignTagsSchema.parse(req.body))); } catch (e) { next(e); }
  },
  removeTags: async (req: Request, res: Response, next: NextFunction) => {
    try { res.json(await productTagsService.removeTags(req.params.productId as string, AssignTagsSchema.parse(req.body))); } catch (e) { next(e); }
  },
};