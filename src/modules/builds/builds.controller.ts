import { Request, Response, NextFunction } from 'express';
import { buildsService } from './builds.service';
import { CreateBuildSchema, AddBuildItemSchema, UpdateBuildSchema } from './builds.schema';

export const buildsController = {

  getGroups: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await buildsService.getGroups();
      res.json(result);
    } catch (err) { next(err); }
  },

  createBuild: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const input = CreateBuildSchema.parse(req.body);
      const result = await buildsService.createBuild(input, res.locals.user.sub);
      res.status(201).json(result);
    } catch (err) { next(err); }
  },

  getBuildById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await buildsService.getBuildById(req.params.id as string, res.locals.user?.sub);
      res.json(result);
    } catch (err) { next(err); }
  },

  getBuildsByUser: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await buildsService.getBuildsByUser(res.locals.user.sub);
      res.json(result);
    } catch (err) { next(err); }
  },

  getPublicBuilds: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page  = Number(req.query.page)  || 1;
      const limit = Number(req.query.limit) || 20;
      const result = await buildsService.getPublicBuilds(page, limit);
      res.json(result);
    } catch (err) { next(err); }
  },

  getBuildByShareToken: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await buildsService.getBuildByShareToken(req.params.token as string);
      res.json(result);
    } catch (err) { next(err); }
  },

  addItem: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const input = AddBuildItemSchema.parse(req.body);
      const result = await buildsService.addItem(req.params.id as string, input, res.locals.user.sub);
      res.status(201).json(result);
    } catch (err) { next(err); }
  },

  removeItem: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await buildsService.removeItem(req.params.id as string, req.params.itemId as string, res.locals.user.sub);
      res.json(result);
    } catch (err) { next(err); }
  },

  updateBuild: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const input = UpdateBuildSchema.parse(req.body);
      const result = await buildsService.updateBuild(req.params.id as string, input, res.locals.user.sub);
      res.json(result);
    } catch (err) { next(err); }
  },

  deleteBuild: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await buildsService.deleteBuild(req.params.id as string, res.locals.user.sub);
      res.json(result);
    } catch (err) { next(err); }
  },

  generateShareToken: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await buildsService.generateShareToken(req.params.id as string, res.locals.user.sub);
      res.json(result);
    } catch (err) { next(err); }
  },

  checkCompatibility: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await buildsService.checkCompatibility(req.params.id as string, res.locals.user.sub);
      res.json(result);
    } catch (err) { next(err); }
  },
};