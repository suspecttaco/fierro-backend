import { prisma } from '../../lib/prisma';

export const ordersRepository = {

  findCartByUser: async (userId: string) => {
    return prisma.cart.findFirst({
      where: { user_id: userId, expires_at: { gt: new Date() } },
      include: { cart_item: true },
    });
  },

  findAddressByUser: async (addressId: string, userId: string) => {
    return prisma.address.findFirst({
      where: { address_id: addressId, user_id: userId },
    });
  },

  placeOrder: async (cartId: string, userId: string, addressId: string, couponId?: string) => {
    await prisma.$executeRaw`
      CALL app.sp_place_order(
        ${cartId}::uuid,
        ${userId}::uuid,
        ${addressId}::uuid,
        ${couponId ?? null}::uuid
      )
    `;
  },

  findLastOrderByUser: async (userId: string) => {
    return prisma.order.findFirst({
      where: { user_id: userId },
      orderBy: { created_at: 'desc' },
      include: {
        order_item: {
          include: {
            product_variant: {
              include: { product: { select: { name: true, slug: true } } }
            }
          }
        },
        address: true,
        payment: true,
      },
    });
  },

  findOrdersByUser: async (userId: string, page: number, limit: number) => {
    const offset = (page - 1) * limit;
    const [items, total] = await Promise.all([
      prisma.order.findMany({
        where: { user_id: userId },
        orderBy: { created_at: 'desc' },
        skip: offset,
        take: limit,
        select: {
          order_id: true, order_number: true, status: true,
          total: true, created_at: true,
          order_item: { select: { quantity: true } },
        },
      }),
      prisma.order.count({ where: { user_id: userId } }),
    ]);
    return { items, total, page, limit };
  },

  findOrderById: async (orderId: string) => {
    return prisma.order.findUnique({
      where: { order_id: orderId },
      include: {
        order_item: {
          include: {
            product_variant: {
              include: { product: { select: { name: true, slug: true } } }
            }
          }
        },
        address: true,
        payment: true,
        coupon:  true,
      },
    });
  },

  cancelOrder: async (orderId: string) => {
    await prisma.$executeRaw`CALL app.sp_cancel_order(${orderId}::uuid)`;
  },

  findAllOrders: async (page: number, limit: number) => {
    const offset = (page - 1) * limit;
    const [items, total] = await Promise.all([
      prisma.order.findMany({
        orderBy: { created_at: 'desc' },
        skip: offset,
        take: limit,
        include: {
          user: { select: { first_name: true, last_name: true, email: true } },
          order_item: { select: { quantity: true } },
        },
      }),
      prisma.order.count(),
    ]);
    return { items, total, page, limit };
  },

  updateOrderStatus: async (orderId: string, status: string) => {
    return prisma.order.update({
      where: { order_id: orderId },
      data:  { status, updated_at: new Date() },
    });
  },

  findIdempotencyKey: async (key: string, userId: string) => {
    return prisma.order.findFirst({
      where: { user_id: userId, notes: { contains: `idempotency:${key}` } },
    });
  },

  saveIdempotencyKey: async (orderId: string, key: string) => {
    return prisma.order.update({
      where: { order_id: orderId },
      data:  { notes: `idempotency:${key}` },
    });
  },
};