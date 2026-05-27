import { Request, Response, NextFunction } from 'express';
import { buildsService } from './builds.service';
import { buildsAiService } from './builds.ai';
import { CreateBuildSchema, AddBuildItemSchema, UpdateBuildSchema, CreateAiSessionSchema, AiChatSchema } from './builds.schema';

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function requireUUID(value: unknown, name: string, res: Response): value is string {
  if (typeof value !== 'string' || !UUID_RE.test(value)) {
    res.status(400).json({ status: 400, code: 'INVALID_ID', message: `El parámetro "${name}" no es un UUID válido.` });
    return false;
  }
  return true;
}

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
      if (!requireUUID(req.params.id, 'id', res)) return;
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

  removeItemByRoleSlug: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await buildsService.removeItemByRoleSlug(req.params.id as string, req.params.roleSlug as string, res.locals.user.sub);
      res.json(result);
    } catch (err) { next(err); }
  },

  updateBuild: async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!requireUUID(req.params.id, 'id', res)) return;
      const input = UpdateBuildSchema.parse(req.body);
      const result = await buildsService.updateBuild(req.params.id as string, input, res.locals.user.sub);
      res.json(result);
    } catch (err) { next(err); }
  },

  deleteBuild: async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!requireUUID(req.params.id, 'id', res)) return;
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

  // ── IA ────────────────────────────────────────────────────────────────────

  createAiSession: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const input = CreateAiSessionSchema.parse(req.body);
      const result = await buildsAiService.createSession(req.params.id as string, res.locals.user.sub, input.title);
      res.status(201).json(result);
    } catch (err) { next(err); }
  },

  getAiSessions: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await buildsAiService.getSessions(req.params.id as string, res.locals.user.sub);
      res.json(result);
    } catch (err) { next(err); }
  },

  getAiMessages: async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!requireUUID(req.params.sessionId, 'sessionId', res)) return;
      const result = await buildsAiService.getMessages(req.params.sessionId as string, res.locals.user.sub);
      res.json(result);
    } catch (err) { next(err); }
  },

  deleteAiSession: async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!requireUUID(req.params.sessionId, 'sessionId', res)) return;
      const result = await buildsAiService.deleteSession(req.params.sessionId as string, res.locals.user.sub);
      res.json(result);
    } catch (err) { next(err); }
  },

  aiChat: async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!requireUUID(req.params.id, 'id', res)) return;
      if (!requireUUID(req.params.sessionId, 'sessionId', res)) return;
      const { message } = AiChatSchema.parse(req.body);
      await buildsAiService.chat(req.params.id as string, req.params.sessionId as string, res.locals.user.sub, message, res);
    } catch (err) { next(err); }
  },

  aiSuggest: async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!requireUUID(req.params.id, 'id', res)) return;
      const result = await buildsAiService.suggest(req.params.id as string, res.locals.user.sub);
      res.json(result);
    } catch (err) { next(err); }
  },
};