import { prisma } from '../../lib/prisma';
import type { AddProductImageInput, UpdateProductImageInput } from './product-images.schema';

export const productImagesRepository = {

  findByProduct: async (productId: string) => {
    return prisma.product_image.findMany({
      where:   { product_id: productId },
      orderBy: [{ is_primary: 'desc' }, { sort_order: 'asc' }],
    });
  },

  add: async (productId: string, data: AddProductImageInput) => {
    return prisma.$transaction(async (tx) => {
      if (data.isPrimary) {
        await tx.product_image.updateMany({
          where: { product_id: productId },
          data:  { is_primary: false },
        });
      }
      return tx.product_image.create({
        data: {
          product_id: productId,
          variant_id: data.variantId,
          url:        data.url,
          alt_text:   data.altText,
          sort_order: data.sortOrder,
          is_primary: data.isPrimary,
        },
      });
    });
  },

  update: async (imageId: string, productId: string, data: UpdateProductImageInput) => {
    return prisma.$transaction(async (tx) => {
      if (data.isPrimary) {
        await tx.product_image.updateMany({
          where: { product_id: productId },
          data:  { is_primary: false },
        });
      }
      return tx.product_image.update({
        where: { image_id: imageId },
        data: {
          url:        data.url,
          alt_text:   data.altText,
          sort_order: data.sortOrder,
          is_primary: data.isPrimary,
          variant_id: data.variantId,
        },
      });
    });
  },

  delete: async (imageId: string) => {
    return prisma.product_image.delete({ where: { image_id: imageId } });
  },
};