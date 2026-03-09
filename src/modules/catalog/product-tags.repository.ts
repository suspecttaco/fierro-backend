import { prisma } from '../../lib/prisma';
import type { CreateTagInput } from './product-tags.schema';

export const productTagsRepository = {

  findAllTags: async () => {
    return prisma.tag.findMany({ orderBy: { name: 'asc' } });
  },

  createTag: async (data: CreateTagInput, slug: string) => {
    return prisma.tag.create({
      data: { name: data.name, slug },
    });
  },

  deleteTag: async (tagId: string) => {
    return prisma.tag.delete({ where: { tag_id: tagId } });
  },

  findByProduct: async (productId: string) => {
    return prisma.product_tag.findMany({
      where:   { product_id: productId },
      include: { tag: true },
    });
  },

  assignTags: async (productId: string, tagIds: string[]) => {
    const data = tagIds.map(tag_id => ({ product_id: productId, tag_id }));
    return prisma.product_tag.createMany({ data, skipDuplicates: true });
  },

  removeTags: async (productId: string, tagIds: string[]) => {
    return prisma.product_tag.deleteMany({
      where: { product_id: productId, tag_id: { in: tagIds } },
    });
  },
};