import { Request, Response, NextFunction } from 'express';
import { buildOrdersService } from './build-orders.service';
import {
  CreateBuildOrderSchema,
  UpdateBuildOrderStatusSchema,
  SetAssemblyFeeSchema,
  AddObservationSchema,
  ListBuildOrdersSchema,
} from './build-orders.schema';

export const buildOrdersController = {

  // ── Cliente ───────────────────────────────────────────────────────────────

  create: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const input = CreateBuildOrderSchema.parse(req.body);
      const result = await buildOrdersService.createOrder(input, res.locals.user.sub);
      res.status(201).json(result);
    } catch (err) { next(err); }
  },

  getMyOrders: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const params = ListBuildOrdersSchema.parse(req.query);
      const result = await buildOrdersService.getMyOrders(res.locals.user.sub, params);
      res.json(result);
    } catch (err) { next(err); }
  },

  getById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await buildOrdersService.getOrderById(req.params.id as string, res.locals.user.sub);
      res.json(result);
    } catch (err) { next(err); }
  },

  cancel: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await buildOrdersService.cancelOrder(req.params.id as string, res.locals.user.sub);
      res.json(result);
    } catch (err) { next(err); }
  },

  // ── Admin ─────────────────────────────────────────────────────────────────

  adminGetAll: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const params = ListBuildOrdersSchema.parse(req.query);
      const result = await buildOrdersService.getAllOrders(params);
      res.json(result);
    } catch (err) { next(err); }
  },

  adminGetById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await buildOrdersService.adminGetOrderById(req.params.id as string);
      res.json(result);
    } catch (err) { next(err); }
  },

  updateStatus: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const input = UpdateBuildOrderStatusSchema.parse(req.body);
      const result = await buildOrdersService.updateStatus(req.params.id as string, input, res.locals.user.sub);
      res.json(result);
    } catch (err) { next(err); }
  },

  setAssemblyFee: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const input = SetAssemblyFeeSchema.parse(req.body);
      const result = await buildOrdersService.setAssemblyFee(req.params.id as string, input, res.locals.user.sub);
      res.json(result);
    } catch (err) { next(err); }
  },

  addObservation: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const input = AddObservationSchema.parse(req.body);
      const result = await buildOrdersService.addObservation(req.params.id as string, input, res.locals.user.sub);
      res.status(201).json(result);
    } catch (err) { next(err); }
  },
};
