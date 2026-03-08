import { Request, Response, NextFunction } from 'express';
import { notificationsService } from './notifications.service';
import { UpdatePreferenceSchema } from './notifications.schema';

export const notificationsController = {

  getNotifications: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page  = Number(req.query.page)  || 1;
      const limit = Number(req.query.limit) || 20;
      const result = await notificationsService.getNotifications(res.locals.user.sub, page, limit);
      res.json(result);
    } catch (err) { next(err); }
  },

  markAsRead: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await notificationsService.markAsRead(req.params.id as string, res.locals.user.sub);
      res.json(result);
    } catch (err) { next(err); }
  },

  markAllAsRead: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await notificationsService.markAllAsRead(res.locals.user.sub);
      res.json(result);
    } catch (err) { next(err); }
  },

  getPreferences: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await notificationsService.getPreferences(res.locals.user.sub);
      res.json(result);
    } catch (err) { next(err); }
  },

  updatePreference: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const input = UpdatePreferenceSchema.parse(req.body);
      const result = await notificationsService.updatePreference(input, res.locals.user.sub);
      res.json(result);
    } catch (err) { next(err); }
  },
};