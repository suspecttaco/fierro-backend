import { prisma } from '../../lib/prisma';

export const authRepository = {

  findUserByEmail: async (email: string) => {
    return prisma.user.findUnique({
      where: { email },
      include: {
        user_role_user_role_user_idTouser: { include: { role: true } }
      },
    });
  },

  createUser: async (data: {
    first_name: string;
    last_name: string;
    email: string;
    password_hash: string;
    phone?: string;
  }) => {
    return prisma.user.create({ data });
  },

  findUserById: async (userId: string) => {
    return prisma.user.findUnique({
      where: { user_id: userId },
      include: {
        user_role_user_role_user_idTouser: { include: { role: true } }
      },
    });
  },

  saveRefreshToken: async (userId: string, tokenHash: string, expiresAt: Date) => {
    return prisma.refresh_token.create({
      data: { user_id: userId, token_hash: tokenHash, expires_at: expiresAt },
    });
  },

  findRefreshToken: async (tokenHash: string) => {
    return prisma.refresh_token.findFirst({
      where: { token_hash: tokenHash, revoked_at: null },
    });
  },

  revokeRefreshToken: async (tokenId: string) => {
    return prisma.refresh_token.update({
      where: { refresh_token_id: tokenId },
      data: { revoked_at: new Date() },
    });
  },

  revokeAllUserTokens: async (userId: string) => {
    return prisma.refresh_token.updateMany({
      where: { user_id: userId, revoked_at: null },
      data: { revoked_at: new Date() },
    });
  },

  saveEmailVerificationToken: async (userId: string, token: string, expiresAt: Date) => {
    return prisma.email_verification_token.create({
      data: { user_id: userId, token, expires_at: expiresAt },
    });
  },

  findEmailVerificationToken: async (token: string) => {
    return prisma.email_verification_token.findFirst({
      where: { token, used_at: null },
    });
  },

  markEmailVerified: async (userId: string, tokenId: string) => {
    await prisma.user.update({
      where: { user_id: userId },
      data: { email_verified_at: new Date() },
    });
    await prisma.email_verification_token.update({
      where: { email_verification_token_id: tokenId },
      data: { used_at: new Date() },
    });
  },

  savePasswordResetToken: async (userId: string, token: string, expiresAt: Date) => {
    return prisma.password_reset_token.create({
      data: { user_id: userId, token, expires_at: expiresAt },
    });
  },

  findPasswordResetToken: async (token: string) => {
    return prisma.password_reset_token.findFirst({
      where: { token, used_at: null },
    });
  },

  updatePassword: async (userId: string, passwordHash: string, tokenId: string) => {
    await prisma.user.update({
      where: { user_id: userId },
      data: { password_hash: passwordHash },
    });
    await prisma.password_reset_token.update({
      where: { password_reset_token_id: tokenId },
      data: { used_at: new Date() },
    });
  },

  assignCustomerRole: async (userId: string) => {
    const role = await prisma.role.findFirst({ where: { slug: 'customer' } });
    if (!role) throw new Error('Rol customer no encontrado');
    return prisma.user_role.create({
      data: { user_id: userId, role_id: role.role_id },
    });
  },
};