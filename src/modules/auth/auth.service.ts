import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { authRepository } from './auth.repository';
import { signAccessToken, signRefreshToken, verifyAccessToken } from '../../lib/jwt';
import { sanitizeObject } from '../../util/sanitizer';
import type { RegisterInput, LoginInput, ResetPasswordInput } from './auth.schema';

const BCRYPT_ROUNDS = 12;
const ACCESS_TOKEN_EXPIRY_MS  = 15 * 60 * 1000;
const REFRESH_TOKEN_EXPIRY_MS = 7 * 24 * 60 * 60 * 1000;
const EMAIL_TOKEN_EXPIRY_MS   = 24 * 60 * 60 * 1000;
const RESET_TOKEN_EXPIRY_MS   = 30 * 60 * 1000;

export const authService = {

  register: async (input: RegisterInput) => {
    const clean = sanitizeObject(input);
    const existing = await authRepository.findUserByEmail(clean.email);
    if (existing) {
      const err: any = new Error('El email ya está registrado');
      err.statusCode = 409;
      err.code = 'EMAIL_ALREADY_EXISTS';
      throw err;
    }

    const password_hash = await bcrypt.hash(clean.password, BCRYPT_ROUNDS);
    const [first_name, ...rest] = clean.name.trim().split(' ');
    const last_name = rest.join(' ') || '-';

    const user = await authRepository.createUser({
      first_name,
      last_name,
      email: clean.email,
      password_hash,
      phone: clean.phone,
    });

    await authRepository.assignCustomerRole(user.user_id);

    const verifyToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + EMAIL_TOKEN_EXPIRY_MS);
    await authRepository.saveEmailVerificationToken(user.user_id, verifyToken, expiresAt);

    // TODO: enviar email de verificación

    return { message: 'Registro exitoso. Revisa tu email para verificar tu cuenta.' };
  },

  login: async (input: LoginInput) => {
    const user = await authRepository.findUserByEmail(input.email);
    const GENERIC_ERROR = 'Credenciales inválidas';

    if (!user || !user.is_active) {
      const err: any = new Error(GENERIC_ERROR);
      err.statusCode = 401;
      err.code = 'INVALID_CREDENTIALS';
      throw err;
    }

    const valid = await bcrypt.compare(input.password, user.password_hash);
    if (!valid) {
      const err: any = new Error(GENERIC_ERROR);
      err.statusCode = 401;
      err.code = 'INVALID_CREDENTIALS';
      throw err;
    }

    const roles = user.user_role_user_role_user_idTouser;
    const primaryRole = roles[0]?.role?.slug ?? 'customer';

    const accessToken = signAccessToken({
      sub: user.user_id,
      email: user.email,
      role: primaryRole,
    });

    const refreshTokenRaw = crypto.randomBytes(40).toString('hex');
    const refreshTokenHash = crypto.createHash('sha256').update(refreshTokenRaw).digest('hex');
    const expiresAt = new Date(Date.now() + REFRESH_TOKEN_EXPIRY_MS);
    await authRepository.saveRefreshToken(user.user_id, refreshTokenHash, expiresAt);

    return {
      accessToken,
      refreshToken: refreshTokenRaw,
      user: {
        userId: user.user_id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role: primaryRole,
      },
    };
  },

  refresh: async (rawToken: string) => {
    const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
    const stored = await authRepository.findRefreshToken(tokenHash);

    if (!stored || stored.expires_at < new Date()) {
      const err: any = new Error('Token inválido o expirado');
      err.statusCode = 401;
      err.code = 'INVALID_REFRESH_TOKEN';
      throw err;
    }

    await authRepository.revokeRefreshToken(stored.refresh_token_id);

    const user = await authRepository.findUserById(stored.user_id);
    if (!user || !user.is_active) {
      const err: any = new Error('Usuario no encontrado');
      err.statusCode = 401;
      err.code = 'USER_NOT_FOUND';
      throw err;
    }

    const primaryRole = user.user_role_user_role_user_idTouser[0]?.role?.slug ?? 'customer';

    const accessToken = signAccessToken({
      sub: user.user_id,
      email: user.email,
      role: primaryRole,
    });

    const newRawToken = crypto.randomBytes(40).toString('hex');
    const newTokenHash = crypto.createHash('sha256').update(newRawToken).digest('hex');
    const expiresAt = new Date(Date.now() + REFRESH_TOKEN_EXPIRY_MS);
    await authRepository.saveRefreshToken(user.user_id, newTokenHash, expiresAt);

    return {
      accessToken,
      refreshToken: newRawToken,
      user: {
        userId:    user.user_id,
        email:     user.email,
        firstName: user.first_name,
        lastName:  user.last_name,
        role:      primaryRole,
      },
    };
  },

  logout: async (rawToken: string) => {
    const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
    const stored = await authRepository.findRefreshToken(tokenHash);
    if (stored) await authRepository.revokeRefreshToken(stored.refresh_token_id);
  },

  verifyEmail: async (token: string) => {
    const record = await authRepository.findEmailVerificationToken(token);
    if (!record || record.expires_at < new Date()) {
      const err: any = new Error('Token inválido o expirado');
      err.statusCode = 400;
      err.code = 'INVALID_VERIFY_TOKEN';
      throw err;
    }
    await authRepository.markEmailVerified(record.user_id, record.email_verification_token_id);
    return { message: 'Email verificado correctamente.' };
  },

  forgotPassword: async (email: string) => {
    const user = await authRepository.findUserByEmail(email);
    if (user) {
      const token = crypto.randomBytes(32).toString('hex');
      const expiresAt = new Date(Date.now() + RESET_TOKEN_EXPIRY_MS);
      await authRepository.savePasswordResetToken(user.user_id, token, expiresAt);
      // TODO: enviar email con el token
    }
    return { message: 'Si el email existe recibirás instrucciones para restablecer tu contraseña.' };
  },

  resetPassword: async (input: ResetPasswordInput) => {
    const record = await authRepository.findPasswordResetToken(input.token);
    if (!record || record.expires_at < new Date()) {
      const err: any = new Error('Token inválido o expirado');
      err.statusCode = 400;
      err.code = 'INVALID_RESET_TOKEN';
      throw err;
    }
    const password_hash = await bcrypt.hash(input.password, BCRYPT_ROUNDS);
    await authRepository.updatePassword(record.user_id, password_hash, record.password_reset_token_id);
    await authRepository.revokeAllUserTokens(record.user_id);
    return { message: 'Contraseña actualizada correctamente.' };
  },
};