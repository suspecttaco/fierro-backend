import { Request, Response, NextFunction } from 'express';
import { authService } from './auth.service';
import {
  RegisterSchema,
  LoginSchema,
  ForgotPasswordSchema,
  ResetPasswordSchema,
  VerifyEmailSchema,
} from './auth.schema';

const REFRESH_COOKIE = 'refresh_token';
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

export const authController = {

  register: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const input = RegisterSchema.parse(req.body);
      const result = await authService.register(input);
      res.status(201).json(result);
    } catch (err) { next(err); }
  },

  login: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const input = LoginSchema.parse(req.body);
      const { accessToken, refreshToken, user } = await authService.login(input);
      res.cookie(REFRESH_COOKIE, refreshToken, COOKIE_OPTIONS);
      res.json({ accessToken, user });
    } catch (err) { next(err); }
  },

  refresh: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.cookies?.[REFRESH_COOKIE];
      if (!token) {
        res.status(401).json({ status: 401, code: 'NO_REFRESH_TOKEN', message: 'No autenticado' });
        return;
      }
      const { accessToken, refreshToken, user } = await authService.refresh(token);
      res.cookie(REFRESH_COOKIE, refreshToken, COOKIE_OPTIONS);
      res.json({ accessToken, user });
    } catch (err) { next(err); }
  },

  logout: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.cookies?.[REFRESH_COOKIE];
      if (token) await authService.logout(token);
      res.clearCookie(REFRESH_COOKIE);
      res.json({ message: 'Sesión cerrada correctamente.' });
    } catch (err) { next(err); }
  },

  verifyEmail: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { token } = VerifyEmailSchema.parse(req.query);
      const result = await authService.verifyEmail(token);
      res.json(result);
    } catch (err) { next(err); }
  },

  forgotPassword: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email } = ForgotPasswordSchema.parse(req.body);
      const result = await authService.forgotPassword(email);
      res.json(result);
    } catch (err) { next(err); }
  },

  resetPassword: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const input = ResetPasswordSchema.parse(req.body);
      const result = await authService.resetPassword(input);
      res.json(result);
    } catch (err) { next(err); }
  },

  updateProfile: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = res.locals.user.sub;
      const { firstName, lastName, phone } = req.body;
      const result = await authService.updateProfile(userId, { firstName, lastName, phone });
      res.json(result);
    } catch (err) { next(err); }
  },

  changePassword: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = res.locals.user.sub;
      const { currentPassword, newPassword } = req.body;
      if (!currentPassword || !newPassword) {
        res.status(400).json({ message: 'Faltan campos requeridos' });
        return;
      }
      const result = await authService.changePassword(userId, currentPassword, newPassword);
      res.json(result);
    } catch (err) { next(err); }
  },
};