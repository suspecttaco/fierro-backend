import { Request, Response, NextFunction } from 'express';
import { adminService } from './admin.service';
import {
  CreateProductSchema, UpdateProductSchema,
  CreateVariantSchema, UpdateVariantSchema,
  StockAdjustmentSchema, CreateCategorySchema,
  CreateBrandSchema, UpdateUserSchema,
  AssignRoleSchema,
} from './admin.schema';

export const adminController = {

  // Productos
  createProduct: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const input = CreateProductSchema.parse(req.body);
      const result = await adminService.createProduct(input);
      res.status(201).json(result);
    } catch (err) { next(err); }
  },

  updateProduct: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const input = UpdateProductSchema.parse(req.body);
      const result = await adminService.updateProduct(req.params.id as string, input);
      res.json(result);
    } catch (err) { next(err); }
  },

  deleteProduct: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await adminService.deleteProduct(req.params.id as string);
      res.json(result);
    } catch (err) { next(err); }
  },

  // Variantes
  createVariant: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const input = CreateVariantSchema.parse(req.body);
      const result = await adminService.createVariant(req.params.productId as string, input);
      res.status(201).json(result);
    } catch (err) { next(err); }
  },

  updateVariant: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const input = UpdateVariantSchema.parse(req.body);
      const result = await adminService.updateVariant(req.params.id as string, input);
      res.json(result);
    } catch (err) { next(err); }
  },

  deleteVariant: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await adminService.deleteVariant(req.params.id as string);
      res.json(result);
    } catch (err) { next(err); }
  },

  // Stock
  adjustStock: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const input = StockAdjustmentSchema.parse(req.body);
      const result = await adminService.adjustStock(input, res.locals.user.sub);
      res.json(result);
    } catch (err) { next(err); }
  },

  // Categorías
  createCategory: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const input = CreateCategorySchema.parse(req.body);
      const result = await adminService.createCategory(input);
      res.status(201).json(result);
    } catch (err) { next(err); }
  },

  updateCategory: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const input = CreateCategorySchema.partial().parse(req.body);
      const result = await adminService.updateCategory(req.params.id as string, input);
      res.json(result);
    } catch (err) { next(err); }
  },

  // Marcas
  createBrand: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const input = CreateBrandSchema.parse(req.body);
      const result = await adminService.createBrand(input);
      res.status(201).json(result);
    } catch (err) { next(err); }
  },

  updateBrand: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const input = CreateBrandSchema.partial().parse(req.body);
      const result = await adminService.updateBrand(req.params.id as string, input);
      res.json(result);
    } catch (err) { next(err); }
  },

  // Usuarios
  getUsers: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 20;
      const result = await adminService.getUsers(page, limit);
      res.json(result);
    } catch (err) { next(err); }
  },

  updateUser: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const input = UpdateUserSchema.parse(req.body);
      const result = await adminService.updateUser(req.params.id as string, input);
      res.json(result);
    } catch (err) { next(err); }
  },

  // Reportes
  getSalesReport: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const from = req.query.from as string;
      const to = req.query.to as string;
      if (!from || !to) {
        res.status(400).json({ status: 400, code: 'MISSING_PARAMS', message: 'Se requieren los parámetros from y to' });
        return;
      }
      const result = await adminService.getSalesReport(from, to);
      res.json(result);
    } catch (err) { next(err); }
  },

  assignRole: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const input = AssignRoleSchema.parse(req.body);
      const result = await adminService.assignRole(req.params.id as string, input);
      res.json(result);
    } catch (err) { next(err); }
  },

  getInventory: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 30;
      const stockStatus = req.query.stock_status as string | undefined;
      const result = await adminService.getInventory(page, limit, stockStatus);
      res.json(result);
    } catch (err) { next(err); }
  },

  getStockMovements: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 30;
      const result = await adminService.getStockMovements(req.params.variantId as string, page, limit);
      res.json(result);
    } catch (err) { next(err); }
  },
};