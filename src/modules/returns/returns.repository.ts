import { prisma } from '../../lib/prisma';

export const returnsRepository = {

  findOrderById: async (orderId: string, userId: string) => {
    return prisma.order.findFirst({
      where: { order_id: orderId, user_id: userId },
      include: { order_item: true },
    });
  },

  createReturn: async (data: {
    order_id:       string;
    user_id:        string;
    reason:         string;
    customer_notes?: string;
    items: { order_item_id: string; quantity: number; condition: string; }[];
  }) => {
    const returnNumber = `RET-${Date.now()}`;
    return prisma.return_request.create({
      data: {
        order_id:       data.order_id,
        user_id:        data.user_id,
        reason:         data.reason,
        customer_notes: data.customer_notes,
        return_number:  returnNumber,
        return_item: {
          create: data.items.map(i => ({
            order_item_id: i.order_item_id,
            quantity:      i.quantity,
            condition:     i.condition,
          })),
        },
      },
      include: { return_item: true },
    });
  },

  findReturnsByUser: async (userId: string) => {
    return prisma.return_request.findMany({
      where: { user_id: userId },
      orderBy: { created_at: 'desc' },
      include: { return_item: true },
    });
  },

  findReturnById: async (returnId: string) => {
    return prisma.return_request.findUnique({
      where: { return_id: returnId },
      include: { return_item: true, order: true },
    });
  },

  updateReturnStatus: async (returnId: string, data: {
    status:      string;
    resolution?: string;
    staff_notes?: string;
    handled_by:  string;
    resolved_at?: Date;
  }) => {
    return prisma.return_request.update({
      where: { return_id: returnId },
      data,
    });
  },

  findAllReturns: async (page: number, limit: number) => {
    const offset = (page - 1) * limit;
    const [items, total] = await Promise.all([
      prisma.return_request.findMany({
        orderBy: { created_at: 'desc' },
        skip: offset,
        take: limit,
        include: {
          return_item: true,
          user_return_request_user_idTouser: { select: { first_name: true, last_name: true, email: true } },
        },
      }),
      prisma.return_request.count(),
    ]);
    return { items, total, page, limit };
  },
};