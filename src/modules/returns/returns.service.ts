import { returnsRepository } from './returns.repository';
import type { CreateReturnInput, UpdateReturnStatusInput } from './returns.schema';

export const returnsService = {

  createReturn: async (input: CreateReturnInput, userId: string) => {
    const order = await returnsRepository.findOrderById(input.orderId, userId);
    if (!order) {
      const err: any = new Error('Orden no encontrada');
      err.statusCode = 404;
      err.code = 'ORDER_NOT_FOUND';
      throw err;
    }

    if (!['delivered'].includes(order.status)) {
      const err: any = new Error('Solo se pueden devolver órdenes entregadas');
      err.statusCode = 409;
      err.code = 'ORDER_NOT_DELIVERED';
      throw err;
    }

    const orderItemIds = order.order_item.map(i => i.order_item_id);
    const invalidItems = input.items.filter(i => !orderItemIds.includes(i.orderItemId));
    if (invalidItems.length > 0) {
      const err: any = new Error('Algunos items no pertenecen a esta orden');
      err.statusCode = 400;
      err.code = 'INVALID_ORDER_ITEMS';
      throw err;
    }

    return returnsRepository.createReturn({
      order_id:       input.orderId,
      user_id:        userId,
      reason:         input.reason,
      customer_notes: input.customerNotes,
      items:          input.items.map(i => ({
        order_item_id: i.orderItemId,
        quantity:      i.quantity,
        condition:     i.condition,
      })),
    });
  },

  getReturns: async (userId: string) => {
    return returnsRepository.findReturnsByUser(userId);
  },

  getReturnById: async (returnId: string, userId: string, isAdmin = false) => {
    const ret = await returnsRepository.findReturnById(returnId);
    if (!ret) {
      const err: any = new Error('Devolución no encontrada');
      err.statusCode = 404;
      err.code = 'RETURN_NOT_FOUND';
      throw err;
    }
    if (!isAdmin && ret.user_id !== userId) {
      const err: any = new Error('No autorizado');
      err.statusCode = 403;
      err.code = 'FORBIDDEN';
      throw err;
    }
    return ret;
  },

  updateReturnStatus: async (returnId: string, input: UpdateReturnStatusInput, adminId: string) => {
    const ret = await returnsRepository.findReturnById(returnId);
    if (!ret) {
      const err: any = new Error('Devolución no encontrada');
      err.statusCode = 404;
      err.code = 'RETURN_NOT_FOUND';
      throw err;
    }
    return returnsRepository.updateReturnStatus(returnId, {
      status:      input.status,
      resolution:  input.resolution,
      staff_notes: input.staffNotes,
      handled_by:  adminId,
      resolved_at: ['approved', 'rejected', 'completed'].includes(input.status) ? new Date() : undefined,
    });
  },

  getAllReturns: async (page = 1, limit = 20) => {
    const { items, total } = await returnsRepository.findAllReturns(page, limit);
    return {
      data: items,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  },
};