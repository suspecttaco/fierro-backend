import { Request, Response, NextFunction } from 'express';
import { billingService } from './billing.service';
import { CreateTaxProfileSchema, UpdateTaxProfileInput, UpdateTaxProfileSchema } from './billing.schema';

export const billingController = {

  getTaxProfiles: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await billingService.getTaxProfiles(res.locals.user.sub);
      res.json(result);
    } catch (err) { next(err); }
  },

  createTaxProfile: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const input = CreateTaxProfileSchema.parse(req.body);
      const result = await billingService.createTaxProfile(input, res.locals.user.sub);
      res.status(201).json(result);
    } catch (err) { next(err); }
  },

  updateTaxProfile: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const input = UpdateTaxProfileSchema.parse(req.body);
      const result = await billingService.updateTaxProfile(req.params.id as string, input as UpdateTaxProfileInput, res.locals.user.sub);
      res.json(result);
    } catch (err) { next(err); }
  },

  deleteTaxProfile: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await billingService.deleteTaxProfile(req.params.id as string, res.locals.user.sub);
      res.json(result);
    } catch (err) { next(err); }
  },

  getInvoices: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await billingService.getInvoices(res.locals.user.sub);
      res.json(result);
    } catch (err) { next(err); }
  },

  getInvoiceById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await billingService.getInvoiceById(req.params.id as string, res.locals.user.sub);
      res.json(result);
    } catch (err) { next(err); }
  },

  getInvoiceItems: async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.json(await billingService.getInvoiceItems(req.params.id as string, res.locals.user.sub));
    } catch (e) { next(e); }
  },
};