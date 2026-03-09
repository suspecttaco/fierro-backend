import { productTagsRepository } from './product-tags.repository';
import type { CreateTagInput, AssignTagsInput } from './product-tags.schema';
import { generateSlug } from '../../../util/slug';

export const productTagsService = {
  getAllTags:   ()                                          => productTagsRepository.findAllTags(),
  getByProduct:(productId: string)                         => productTagsRepository.findByProduct(productId),
  createTag:   async (data: CreateTagInput)                => productTagsRepository.createTag(data, data.slug ?? await generateSlug(data.name, 'tag')),
  deleteTag:   (tagId: string)                             => productTagsRepository.deleteTag(tagId),
  assignTags:  (productId: string, data: AssignTagsInput)  => productTagsRepository.assignTags(productId, data.tagIds),
  removeTags:  (productId: string, data: AssignTagsInput)  => productTagsRepository.removeTags(productId, data.tagIds),
};