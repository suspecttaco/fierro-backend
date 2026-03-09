import { addressesRepository } from './addresses.repository';
import type { CreateAddressInput, UpdateAddressInput } from './addresses.schema';
import { AppError } from '../../util/errors';

export const addressesService = {

  getAddresses: async (userId: string) => {
    return addressesRepository.findByUser(userId);
  },

  getById: async (addressId: string, userId: string) => {
    const address = await addressesRepository.findById(addressId, userId);
    if (!address) throw new AppError('Dirección no encontrada.', 404, 'NOT_FOUND');
    return address;
  },

  create: async (data: CreateAddressInput, userId: string) => {
    return addressesRepository.create(userId, data);
  },

  update: async (addressId: string, data: UpdateAddressInput, userId: string) => {
    await addressesService.getById(addressId, userId);
    return addressesRepository.update(addressId, userId, data);
  },

  delete: async (addressId: string, userId: string) => {
    await addressesService.getById(addressId, userId);
    await addressesRepository.delete(addressId, userId);
    return { message: 'Dirección eliminada.' };
  },

  setDefault: async (addressId: string, userId: string) => {
    await addressesService.getById(addressId, userId);
    return addressesRepository.setDefault(addressId, userId);
  },
};