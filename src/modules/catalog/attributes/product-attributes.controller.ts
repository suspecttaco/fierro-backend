import { Request, Response, NextFunction } from 'express';
import { productAttributesService } from './product-attributes.service';
import { CreateAttributeTypeSchema, SetProductAttributeSchema } from './product-attributes.schema';

export const productAttributesController = {
  getAllTypes:    async (req: Request, res: Response, next: NextFunction) => {
    try { res.json(await productAttributesService.getAllTypes()); } catch (e) { next(e); }
  },
  getByProduct:  async (req: Request, res: Response, next: NextFunction) => {
    try { res.json(await productAttributesService.getByProduct(req.params.productId as string)); } catch (e) { next(e); }
  },
  createType:    async (req: Request, res: Response, next: NextFunction) => {
    try { res.status(201).json(await productAttributesService.createType(CreateAttributeTypeSchema.parse(req.body))); } catch (e) { next(e); }
  },
  deleteType:    async (req: Request, res: Response, next: NextFunction) => {
    try { res.json(await productAttributesService.deleteType(req.params.attrTypeId as string)); } catch (e) { next(e); }
  },
  setAttribute:  async (req: Request, res: Response, next: NextFunction) => {
    try { res.status(201).json(await productAttributesService.setAttribute(req.params.productId as string, SetProductAttributeSchema.parse(req.body))); } catch (e) { next(e); }
  },
  deleteAttribute: async (req: Request, res: Response, next: NextFunction) => {
    try { res.json(await productAttributesService.deleteAttribute(req.params.productAttrId as string)); } catch (e) { next(e); }
  },
};