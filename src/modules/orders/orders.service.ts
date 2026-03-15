import { ordersRepository } from './orders.repository';
import type { CheckoutInput, UpdateOrderStatusInput } from './orders.schema';

export const ordersService = {

  checkout: async (input: CheckoutInput, userId: string) => {
    // Verificar idempotency key
    const existing = await ordersRepository.findIdempotencyKey(input.idempotencyKey, userId);
    if (existing) return ordersRepository.findOrderById(existing.order_id);

    // Verificar carrito
    const cart = await ordersRepository.findCartByUser(userId);
    if (!cart || cart.cart_item.length === 0) {
      const err: any = new Error('Carrito vacío');
      err.statusCode = 400;
      err.code = 'CART_EMPTY';
      throw err;
    }

    // Verificar dirección pertenece al usuario
    const address = await ordersRepository.findAddressByUser(input.addressId, userId);
    if (!address) {
      const err: any = new Error('Dirección no encontrada');
      err.statusCode = 404;
      err.code = 'ADDRESS_NOT_FOUND';
      throw err;
    }

    // Llamar procedure — él calcula totales, descuenta stock y crea la orden
    await ordersRepository.placeOrder(cart.cart_id, userId, input.addressId, input.couponId);

    // Obtener la orden recién creada
    const order = await ordersRepository.findLastOrderByUser(userId);
    if (!order) {
      const err: any = new Error('Error al crear la orden');
      err.statusCode = 500;
      err.code = 'ORDER_CREATION_FAILED';
      throw err;
    }

    // Guardar idempotency key en notes
    await ordersRepository.saveIdempotencyKey(order.order_id, input.idempotencyKey);

    // Actualizar método de pago
    await ordersRepository.updatePaymentMethod(order.order_id, input.paymentMethod ?? 'card');

    return order;
  },

  getOrders: async (userId: string, page = 1, limit = 20) => {
    const { items, total } = await ordersRepository.findOrdersByUser(userId, page, limit);
    return {
      data: items.map(o => ({
        orderId: o.order_id,
        orderNumber: o.order_number,
        status: o.status,
        total: o.total,
        itemCount: o.order_item.reduce((sum, i) => sum + i.quantity, 0),
        createdAt: o.created_at,
      })),
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  },

  getOrderById: async (orderId: string, userId: string, isAdmin = false) => {
    const order = await ordersRepository.findOrderById(orderId);
    if (!order) {
      const err: any = new Error('Orden no encontrada');
      err.statusCode = 404;
      err.code = 'ORDER_NOT_FOUND';
      throw err;
    }

    if (!isAdmin && order.user_id !== userId) {
      const err: any = new Error('No autorizado');
      err.statusCode = 403;
      err.code = 'FORBIDDEN';
      throw err;
    }

    return order;
  },

  cancelOrder: async (orderId: string, userId: string, isAdmin = false) => {
    const order = await ordersRepository.findOrderById(orderId);
    if (!order) {
      const err: any = new Error('Orden no encontrada');
      err.statusCode = 404;
      err.code = 'ORDER_NOT_FOUND';
      throw err;
    }

    if (!isAdmin && order.user_id !== userId) {
      const err: any = new Error('No autorizado');
      err.statusCode = 403;
      err.code = 'FORBIDDEN';
      throw err;
    }

    if (!['pending', 'confirmed'].includes(order.status)) {
      const err: any = new Error('La orden no puede cancelarse en su estado actual');
      err.statusCode = 409;
      err.code = 'ORDER_CANNOT_CANCEL';
      throw err;
    }

    await ordersRepository.cancelOrder(orderId);
    return { message: 'Orden cancelada correctamente.' };
  },

  getAllOrders: async (page = 1, limit = 20) => {
    const { items, total } = await ordersRepository.findAllOrders(page, limit);
    return {
      data: items,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  },

  updateOrderStatus: async (orderId: string, input: UpdateOrderStatusInput) => {
    const order = await ordersRepository.findOrderById(orderId);
    if (!order) {
      const err: any = new Error('Orden no encontrada');
      err.statusCode = 404;
      err.code = 'ORDER_NOT_FOUND';
      throw err;
    }
    return ordersRepository.updateOrderStatus(orderId, input.status);
  },
};