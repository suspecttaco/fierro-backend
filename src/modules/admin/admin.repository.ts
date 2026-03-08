import { prisma } from '../../lib/prisma';

export const adminRepository = {

  // Productos
  createProduct: async (data: {
    category_id: string; brand_id: string; sku: string; name: string; slug: string;
    description?: string; short_description?: string; base_price: number;
    compare_price?: number; cost_price?: number; weight_kg?: number;
    is_active: boolean; is_featured: boolean; requires_compatibility_check: boolean;
  }) => {
    return prisma.product.create({ data });
  },

  updateProduct: async (productId: string, data: any) => {
    return prisma.product.update({ where: { product_id: productId }, data });
  },

  deleteProduct: async (productId: string) => {
    return prisma.product.update({
      where: { product_id: productId },
      data:  { deleted_at: new Date(), is_active: false },
    });
  },

  // Variantes
  createVariant: async (productId: string, data: {
    sku_variant: string; name: string; price_modifier: number;
    stock_qty: number; is_active: boolean; barcode?: string;
  }) => {
    return prisma.product_variant.create({ data: { ...data, product_id: productId } });
  },

  updateVariant: async (variantId: string, data: any) => {
    return prisma.product_variant.update({ where: { variant_id: variantId }, data });
  },

  deleteVariant: async (variantId: string) => {
    return prisma.product_variant.update({
      where: { variant_id: variantId },
      data:  { is_active: false },
    });
  },

  // Stock
  adjustStock: async (data: {
    variant_id: string; quantity: number; type: string;
    notes?: string; created_by: string;
  }) => {
    const variant = await prisma.product_variant.findUnique({ where: { variant_id: data.variant_id } });
    if (!variant) throw new Error('Variante no encontrada');

    const stockBefore = variant.stock_qty;
    const stockAfter  = stockBefore + data.quantity;

    if (stockAfter < 0) {
      const err: any = new Error('Stock insuficiente para este ajuste');
      err.statusCode = 409;
      err.code = 'STOCK_INSUFFICIENT';
      throw err;
    }

    await prisma.product_variant.update({
      where: { variant_id: data.variant_id },
      data:  { stock_qty: stockAfter },
    });

    return prisma.stock_movement.create({
      data: {
        variant_id:   data.variant_id,
        type:         data.type,
        quantity:     data.quantity,
        stock_before: stockBefore,
        stock_after:  stockAfter,
        notes:        data.notes,
        created_by:   data.created_by,
      },
    });
  },

  // Categorías
  createCategory: async (data: {
    parent_id?: string; name: string; slug: string; description?: string;
    icon_url?: string; sort_order: number; is_active: boolean;
  }) => {
    return prisma.category.create({ data });
  },

  updateCategory: async (categoryId: string, data: any) => {
    return prisma.category.update({ where: { category_id: categoryId }, data });
  },

  // Marcas
  createBrand: async (data: {
    name: string; slug: string; logo_url?: string;
    website?: string; country_of_origin?: string; is_active: boolean;
  }) => {
    return prisma.brand.create({ data });
  },

  updateBrand: async (brandId: string, data: any) => {
    return prisma.brand.update({ where: { brand_id: brandId }, data });
  },

  // Usuarios
  findAllUsers: async (page: number, limit: number) => {
    const offset = (page - 1) * limit;
    const [items, total] = await Promise.all([
      prisma.user.findMany({
        orderBy: { created_at: 'desc' },
        skip: offset,
        take: limit,
        select: {
          user_id: true, email: true, first_name: true, last_name: true,
          is_active: true, is_customer: true, email_verified_at: true,
          created_at: true, last_login_at: true,
          user_role_user_role_user_idTouser: { include: { role: true } },
        },
      }),
      prisma.user.count(),
    ]);
    return { items, total, page, limit };
  },

  updateUser: async (userId: string, data: { is_active?: boolean; is_customer?: boolean }) => {
    return prisma.user.update({ where: { user_id: userId }, data });
  },

  // Reportes
  getSalesReport: async (from: Date, to: Date) => {
    return prisma.order.findMany({
      where: { created_at: { gte: from, lte: to }, status: { not: 'cancelled' } },
      select: {
        order_id: true, order_number: true, status: true,
        subtotal: true, tax_amount: true, total: true, created_at: true,
        order_item: { select: { quantity: true, line_total: true } },
      },
      orderBy: { created_at: 'desc' },
    });
  },
};