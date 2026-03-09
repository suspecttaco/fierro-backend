import { productImagesRepository } from './product-images.repository';
import type { AddProductImageInput, UpdateProductImageInput } from './product-images.schema';

export const productImagesService = {
  getByProduct: (productId: string) => productImagesRepository.findByProduct(productId),
  add:    (productId: string, data: AddProductImageInput)                      => productImagesRepository.add(productId, data),
  update: (imageId: string, productId: string, data: UpdateProductImageInput)  => productImagesRepository.update(imageId, productId, data),
  delete: (imageId: string)                                                    => productImagesRepository.delete(imageId),
};