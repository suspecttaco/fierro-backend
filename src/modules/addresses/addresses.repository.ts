import { prisma } from '../../lib/prisma';
import type { CreateAddressInput, UpdateAddressInput } from './addresses.schema';

export const addressesRepository = {

  findByUser: async (userId: string) => {
    return prisma.address.findMany({
      where:   { user_id: userId },
      orderBy: [{ is_default: 'desc' }, { created_at: 'desc' }],
    });
  },

  findById: async (addressId: string, userId: string) => {
    return prisma.address.findFirst({
      where: { address_id: addressId, user_id: userId },
    });
  },

  create: async (userId: string, data: CreateAddressInput) => {
    return prisma.$transaction(async (tx) => {
      if (data.isDefault) {
        await tx.address.updateMany({
          where: { user_id: userId },
          data:  { is_default: false },
        });
      }
      return tx.address.create({
        data: {
          user_id:        userId,
          alias:          data.alias,
          recipient_name: data.recipientName,
          street_line1:   data.streetLine1,
          street_line2:   data.streetLine2,
          city:           data.city,
          state:          data.state,
          zip_code:       data.zipCode,
          country:        data.country,
          phone:          data.phone,
          is_default:     data.isDefault ?? false,
        },
      });
    });
  },

  update: async (addressId: string, userId: string, data: UpdateAddressInput) => {
    return prisma.$transaction(async (tx) => {
      if (data.isDefault) {
        await tx.address.updateMany({
          where: { user_id: userId },
          data:  { is_default: false },
        });
      }
      return tx.address.update({
        where: { address_id: addressId },
        data: {
          alias:          data.alias,
          recipient_name: data.recipientName,
          street_line1:   data.streetLine1,
          street_line2:   data.streetLine2,
          city:           data.city,
          state:          data.state,
          zip_code:       data.zipCode,
          country:        data.country,
          phone:          data.phone,
          is_default:     data.isDefault,
        },
      });
    });
  },

  delete: async (addressId: string, userId: string) => {
    return prisma.address.deleteMany({
      where: { address_id: addressId, user_id: userId },
    });
  },

  setDefault: async (addressId: string, userId: string) => {
    return prisma.$transaction(async (tx) => {
      await tx.address.updateMany({
        where: { user_id: userId },
        data:  { is_default: false },
      });
      return tx.address.update({
        where: { address_id: addressId },
        data:  { is_default: true },
      });
    });
  },
};