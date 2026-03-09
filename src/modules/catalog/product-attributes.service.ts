import { productAttributesRepository } from './product-attributes.repository';
import type { CreateAttributeTypeInput, SetProductAttributeInput } from './product-attributes.schema';
import { generateSlug } from '../../util/slug';

export const productAttributesService = {
  getAllTypes:       ()                                                    => productAttributesRepository.findAllTypes(),
  getByProduct:     (productId: string)                                   => productAttributesRepository.findByProduct(productId),
  createType:       async (data: CreateAttributeTypeInput)                => productAttributesRepository.createType(data, data.slug ?? await generateSlug(data.name, 'attribute_type')),
  deleteType:       (attrTypeId: string)                                  => productAttributesRepository.deleteType(attrTypeId),
  setAttribute:     (productId: string, data: SetProductAttributeInput)   => productAttributesRepository.upsertAttribute(productId, data),
  deleteAttribute:  (productAttrId: string)                               => productAttributesRepository.deleteAttribute(productAttrId),
};