import { prisma } from '../../../lib/prisma';
import type { CreateAttributeTypeInput, SetProductAttributeInput } from './product-attributes.schema';

export const productAttributesRepository = {

  findAllTypes: async () => {
    return prisma.attribute_type.findMany({ orderBy: { name: 'asc' } });
  },

  createType: async (data: CreateAttributeTypeInput, slug: string) => {
    return prisma.attribute_type.create({
      data: {
        name:       data.name,
        slug,
        data_type:  data.dataType,
        unit:       data.unit,
        filterable: data.filterable,
        comparable: data.comparable,
      },
    });
  },

  deleteType: async (attrTypeId: string) => {
    return prisma.attribute_type.delete({ where: { attr_type_id: attrTypeId } });
  },

  findByProduct: async (productId: string) => {
    return prisma.product_attribute.findMany({
      where:   { product_id: productId },
      include: { attribute_type: true },
    });
  },

  upsertAttribute: async (productId: string, data: SetProductAttributeInput) => {
    return prisma.product_attribute.create({
      data: {
        product_id:   productId,
        attr_type_id: data.attrTypeId,
        variant_id:   data.variantId,
        value_text:   data.valueText,
        value_num:    data.valueNum,
      },
    });
  },

  deleteAttribute: async (productAttrId: string) => {
    return prisma.product_attribute.delete({ where: { product_attr_id: productAttrId } });
  },
};