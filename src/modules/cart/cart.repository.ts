import { prisma } from '../../lib/prisma';

export const cartRepository = {

  findActiveCart: async (userId?: string, sessionToken?: string) => {
    const where: any = { expires_at: { gt: new Date() } };
    if (userId)       where.user_id       = userId;
    else if (sessionToken) where.session_token = sessionToken;
    else return null;

    return prisma.cart.findFirst({
      where,
      include: {
        cart_item: {
          include: {
            product_variant: {
              include: {
                product: {
                  select: { name: true, slug: true, product_image: { where: { is_primary: true }, take: 1 } }
                }
              }
            }
          }
        }
      }
    });
  },

  createCart: async (userId?: string, sessionToken?: string) => {
    return prisma.cart.create({
      data: {
        user_id:       userId       ?? null,
        session_token: sessionToken ?? null,
        expires_at:    new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
      include: {
        cart_item: {
            include: {
                product_variant: {
                    include: {
                        product: {
                            select: { name: true, slug: true, product_image: { where: { is_primary: true }, take: 1} }
                        }
                    }
                }
            }
        }
      }
    });
  },

  findVariant: async (variantId: string) => {
    return prisma.product_variant.findUnique({
      where: { variant_id: variantId, is_active: true },
      select: { variant_id: true, stock_qty: true, stock_reserved: true, price_modifier: true,
                product: { select: { base_price: true } } },
    });
  },

  findCartItem: async (cartId: string, variantId: string) => {
    return prisma.cart_item.findUnique({
      where: { cart_id_variant_id: { cart_id: cartId, variant_id: variantId } },
    });
  },

  addItem: async (cartId: string, variantId: string, quantity: number, unitPrice: number) => {
    return prisma.cart_item.upsert({
      where: { cart_id_variant_id: { cart_id: cartId, variant_id: variantId } },
      update: { quantity: { increment: quantity } },
      create: { cart_id: cartId, variant_id: variantId, quantity, unit_price: unitPrice },
    });
  },

  updateItem: async (cartItemId: string, quantity: number) => {
    return prisma.cart_item.update({
      where: { cart_item_id: cartItemId },
      data:  { quantity },
    });
  },

  deleteItem: async (cartItemId: string) => {
    return prisma.cart_item.delete({ where: { cart_item_id: cartItemId } });
  },

  findCartItemById: async (cartItemId: string) => {
    return prisma.cart_item.findUnique({ where: { cart_item_id: cartItemId } });
  },

  findCoupon: async (code: string) => {
    return prisma.coupon.findUnique({
      where: { code, is_active: true },
    });
  },
};