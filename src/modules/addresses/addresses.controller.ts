import { Request, Response, NextFunction } from 'express';
import { addressesService } from './addresses.service';
import { CreateAddressSchema, UpdateAddressSchema } from './addresses.schema';

export const addressesController = {

  getAddresses: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await addressesService.getAddresses(res.locals.user.sub);
      res.json(result);
    } catch (err) { next(err); }
  },

  getById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await addressesService.getById(req.params.id as string, res.locals.user.sub);
      res.json(result);
    } catch (err) { next(err); }
  },

  create: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const input = CreateAddressSchema.parse(req.body);
      const result = await addressesService.create(input, res.locals.user.sub);
      res.status(201).json(result);
    } catch (err) { next(err); }
  },

  update: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const input = UpdateAddressSchema.parse(req.body);
      const result = await addressesService.update(req.params.id as string, input, res.locals.user.sub);
      res.json(result);
    } catch (err) { next(err); }
  },

  delete: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await addressesService.delete(req.params.id as string, res.locals.user.sub);
      res.json(result);
    } catch (err) { next(err); }
  },

  setDefault: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await addressesService.setDefault(req.params.id as string, res.locals.user.sub);
      res.json(result);
    } catch (err) { next(err); }
  },
};