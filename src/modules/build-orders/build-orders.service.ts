import { buildOrdersRepository } from './build-orders.repository';
import { buildsRepository } from '../builds/builds.repository';
import { AppError } from '../../util/errors';
import type {
  CreateBuildOrderInput,
  UpdateBuildOrderStatusInput,
  SetAssemblyFeeInput,
  AddObservationInput,
  ListBuildOrdersInput,
} from './build-orders.schema';

function generateOrderNumber(): string {
  const ts = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `BO-${ts}-${rand}`;
}

export const buildOrdersService = {

  createOrder: async (input: CreateBuildOrderInput, userId: string) => {
    const build = await buildsRepository.findBuildById(input.buildId);
    if (!build) throw new AppError('Build no encontrado', 404, 'BUILD_NOT_FOUND');
    if (build.user_id !== userId) throw new AppError('No autorizado', 403, 'FORBIDDEN');
    if (build.status === 'incompatible') {
      throw new AppError(
        'El build tiene incompatibilidades. Revisa la compatibilidad antes de crear el encargo.',
        422, 'BUILD_INCOMPATIBLE',
      );
    }

    const orderNumber = generateOrderNumber();
    const componentsTotal = Number(build.total_price);

    return buildOrdersRepository.create({
      build_id: input.buildId,
      user_id: userId,
      order_number: orderNumber,
      components_total: componentsTotal,
      notes: input.notes,
    });
  },

  getMyOrders: async (userId: string, params: ListBuildOrdersInput) => {
    const { items, total } = await buildOrdersRepository.findByUser(
      userId, params.page, params.limit, params.status,
    );
    return {
      data: items,
      pagination: { page: params.page, limit: params.limit, total, totalPages: Math.ceil(total / params.limit) },
    };
  },

  getOrderById: async (buildOrderId: string, userId: string) => {
    const order = await buildOrdersRepository.findById(buildOrderId);
    if (!order) throw new AppError('Encargo no encontrado', 404, 'BUILD_ORDER_NOT_FOUND');
    if (order.user_id !== userId) throw new AppError('No autorizado', 403, 'FORBIDDEN');
    return order;
  },

  cancelOrder: async (buildOrderId: string, userId: string) => {
    const order = await buildOrdersRepository.findById(buildOrderId);
    if (!order) throw new AppError('Encargo no encontrado', 404, 'BUILD_ORDER_NOT_FOUND');
    if (order.user_id !== userId) throw new AppError('No autorizado', 403, 'FORBIDDEN');
    const cancellableStatuses = ['pending', 'reviewing', 'awaiting_client'];
    if (!cancellableStatuses.includes(order.status)) {
      throw new AppError(
        `No se puede cancelar un encargo en estado "${order.status}"`,
        422, 'INVALID_STATUS_TRANSITION',
      );
    }
    return buildOrdersRepository.cancel(buildOrderId);
  },

  // ── Admin ────────────────────────────────────────────────────────────────

  getAllOrders: async (params: ListBuildOrdersInput) => {
    const { items, total } = await buildOrdersRepository.findAll(
      params.page, params.limit, params.status,
    );
    return {
      data: items,
      pagination: { page: params.page, limit: params.limit, total, totalPages: Math.ceil(total / params.limit) },
    };
  },

  adminGetOrderById: async (buildOrderId: string) => {
    const order = await buildOrdersRepository.findById(buildOrderId);
    if (!order) throw new AppError('Encargo no encontrado', 404, 'BUILD_ORDER_NOT_FOUND');
    return order;
  },

  updateStatus: async (buildOrderId: string, input: UpdateBuildOrderStatusInput, adminId: string) => {
    const order = await buildOrdersRepository.findById(buildOrderId);
    if (!order) throw new AppError('Encargo no encontrado', 404, 'BUILD_ORDER_NOT_FOUND');

    await buildOrdersRepository.updateStatus(buildOrderId, input.status);

    const obsMessage = input.observation
      ?? `Estado cambiado a "${input.status}"`;

    await buildOrdersRepository.addObservation({
      build_order_id: buildOrderId,
      author_id: adminId,
      type: input.observationType ?? 'status_change',
      message: obsMessage,
    });

    return buildOrdersRepository.findById(buildOrderId);
  },

  setAssemblyFee: async (buildOrderId: string, input: SetAssemblyFeeInput, adminId: string) => {
    const order = await buildOrdersRepository.findById(buildOrderId);
    if (!order) throw new AppError('Encargo no encontrado', 404, 'BUILD_ORDER_NOT_FOUND');

    await buildOrdersRepository.updateFee(
      buildOrderId,
      input.assemblyFee,
      Number(order.components_total),
    );

    await buildOrdersRepository.addObservation({
      build_order_id: buildOrderId,
      author_id: adminId,
      type: 'fee_update',
      message: input.note ?? `Cuota de armado actualizada a $${input.assemblyFee} MXN`,
    });

    return buildOrdersRepository.findById(buildOrderId);
  },

  addObservation: async (buildOrderId: string, input: AddObservationInput, authorId: string) => {
    const order = await buildOrdersRepository.findById(buildOrderId);
    if (!order) throw new AppError('Encargo no encontrado', 404, 'BUILD_ORDER_NOT_FOUND');

    if (input.type === 'awaiting_client' && order.status !== 'awaiting_client') {
      await buildOrdersRepository.updateStatus(buildOrderId, 'awaiting_client');
    }

    return buildOrdersRepository.addObservation({
      build_order_id: buildOrderId,
      author_id: authorId,
      type: input.type,
      message: input.message,
    });
  },
};
