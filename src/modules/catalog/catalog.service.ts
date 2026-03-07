import { catalogRepository } from './catalog.repository';
import type { ProductListInput } from './catalog.schema';

export const catalogService = {

  getProducts: async (input: ProductListInput) => {
    const { items, total, page, limit } = await catalogRepository.findProducts(input);

    const products = items.map(p => ({
      productId:    p.product_id,
      name:         p.name,
      slug:         p.slug,
      basePrice:    p.base_price,
      comparePrice: p.compare_price,
      avgRating:    p.avg_rating,
      isFeatured:   p.is_featured,
      brand:        p.brand,
      category:     p.category,
      image:        p.product_image[0]?.url ?? null,
      inStock:      p.product_variant.some(v => (v.stock_qty - v.stock_reserved) > 0),
    }));

    return {
      data: products,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  },

  getProductBySlug: async (slug: string) => {
    const product = await catalogRepository.findProductBySlug(slug);
    if (!product) {
      const err: any = new Error('Producto no encontrado');
      err.statusCode = 404;
      err.code = 'PRODUCT_NOT_FOUND';
      throw err;
    }

    return {
      productId:         product.product_id,
      name:              product.name,
      slug:              product.slug,
      description:       product.description,
      shortDescription:  product.short_description,
      basePrice:         product.base_price,
      comparePrice:      product.compare_price,
      avgRating:         product.avg_rating,
      isFeatured:        product.is_featured,
      brand:             product.brand,
      category:          product.category,
      images:            product.product_image,
      variants:          product.product_variant.map(v => ({
        variantId:     v.variant_id,
        name:          v.name,
        skuVariant:    v.sku_variant,
        priceModifier: v.price_modifier,
        availableStock: v.stock_qty - v.stock_reserved,
        attributes:    v.product_attribute.map(a => ({
          name:  a.attribute_type.name,
          unit:  a.attribute_type.unit,
          value: a.value_text ?? a.value_num,
        })),
      })),
      attributes: product.product_attribute.map(a => ({
        name:  a.attribute_type.name,
        unit:  a.attribute_type.unit,
        value: a.value_text ?? a.value_num,
      })),
      tags:    product.product_tag.map(pt => pt.tag),
      reviews: product.review.map(r => ({
        reviewId:  r.review_id,
        rating:    r.rating,
        title:     r.title,
        body:      r.body,
        createdAt: r.created_at,
        user:      `${r.user.first_name} ${r.user.last_name}`,
      })),
    };
  },

  getCategories: async () => {
    const categories = await catalogRepository.findCategories();
    // construir árbol
    const map = new Map(categories.map(c => [c.category_id, { ...c, children: [] as any[] }]));
    const tree: any[] = [];
    map.forEach(node => {
      if (node.parent_id && map.has(node.parent_id)) {
        map.get(node.parent_id)!.children.push(node);
      } else {
        tree.push(node);
      }
    });
    return tree;
  },

  getBrands: async () => {
    return catalogRepository.findBrands();
  },
};