import { prisma } from '../../lib/prisma';
import type { ProductListInput } from './catalog.schema';

export const catalogRepository = {

  findProducts: async (input: ProductListInput) => {
    const { page, limit, category, brand, price_min, price_max, in_stock, tags, q } = input;
    const offset = (page - 1) * limit;

    const where: any = {
      is_active: true,
      deleted_at: null,
    };

    if (category) where.category = { slug: category };
    if (brand)    where.brand    = { slug: brand };
    if (price_min !== undefined) where.base_price = { ...where.base_price, gte: price_min };
    if (price_max !== undefined) where.base_price = { ...where.base_price, lte: price_max };
    if (q) where.OR = [
      { name:              { contains: q, mode: 'insensitive' } },
      { short_description: { contains: q, mode: 'insensitive' } },
    ];
    if (in_stock) where.product_variant = { some: { is_active: true, stock_qty: { gt: 0 } } };
    if (tags) {
      const tagList = tags.split(',').map(t => t.trim());
      where.product_tag = { some: { tag: { slug: { in: tagList } } } };
    }

    const [items, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip: offset,
        take: limit,
        orderBy: { created_at: 'desc' },
        include: {
          brand:           { select: { name: true, slug: true } },
          category:        { select: { name: true, slug: true } },
          product_image:   { where: { is_primary: true }, take: 1 },
          product_variant: { where: { is_active: true }, select: { stock_qty: true, stock_reserved: true, variant_id: true, price_modifier: true } },
        },
      }),
      prisma.product.count({ where }),
    ]);

    return { items, total, page, limit };
  },

  findProductBySlug: async (slug: string) => {
    return prisma.product.findFirst({
      where: { slug, is_active: true, deleted_at: null },
      include: {
        brand:            { select: { name: true, slug: true, logo_url: true } },
        category:         { select: { name: true, slug: true } },
        product_image:    { orderBy: { sort_order: 'asc' } },
        product_variant:  { where: { is_active: true }, include: { product_attribute: { include: { attribute_type: true } } } },
        product_attribute: { include: { attribute_type: true }, where: { variant_id: null } },
        product_tag:      { include: { tag: true } },
        review:           { where: { status: 'approved' }, orderBy: { created_at: 'desc' }, take: 10,
                            include: { user: { select: { first_name: true, last_name: true } } } },
      },
    });
  },

  findCategories: async () => {
    return prisma.category.findMany({
      where: { is_active: true },
      orderBy: [{ level: 'asc' }, { sort_order: 'asc' }],
      select: {
        category_id: true,
        parent_id:   true,
        name:        true,
        slug:        true,
        icon_url:    true,
        level:       true,
        sort_order:  true,
      },
    });
  },

  findBrands: async () => {
    return prisma.brand.findMany({
      where: { is_active: true },
      orderBy: { name: 'asc' },
      select: { brand_id: true, name: true, slug: true, logo_url: true },
    });
  },

  findVariantById: async (variantId: string) => {
    return prisma.product_variant.findUnique({
      where:   { variant_id: variantId },
      include: {
        product:           { include: { brand: true, category: true } },
        product_image:     true,
        product_attribute: { include: { attribute_type: true } },
      },
    });
  },
};