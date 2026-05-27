import { z } from 'zod';

export const BUILD_ORDER_STATUSES = [
  'pending',        // recién creado, esperando revisión
  'reviewing',      // staff revisando el encargo
  'awaiting_client',// esperando respuesta del cliente (incompatibilidad, sin stock, etc.)
  'approved',       // aprobado, adquiriendo componentes
  'assembling',     // armado en proceso
  'testing',        // pruebas de la PC
  'ready',          // lista para entrega
  'delivered',      // entregada al cliente
  'on_hold',        // en pausa por problema (sin stock, incompatibilidad)
  'cancelled',      // cancelada
] as const;

export const OBSERVATION_TYPES = [
  'note',           // nota general del staff
  'no_stock',       // componente sin existencia
  'incompatibility',// problema de compatibilidad detectado
  'awaiting_client',// se requiere decisión/respuesta del cliente
  'client_response',// respuesta del cliente
  'status_change',  // registro de cambio de estado
  'fee_update',     // actualización de cuota de armado
] as const;

export const CreateBuildOrderSchema = z.object({
  buildId:  z.string().uuid(),
  notes:    z.string().max(1000).optional(),
});

export const UpdateBuildOrderStatusSchema = z.object({
  status:      z.enum(BUILD_ORDER_STATUSES),
  observation: z.string().min(1).max(2000).optional(),
  observationType: z.enum(OBSERVATION_TYPES).default('status_change'),
});

export const SetAssemblyFeeSchema = z.object({
  assemblyFee: z.number().min(0),
  note:        z.string().max(500).optional(),
});

export const AddObservationSchema = z.object({
  type:    z.enum(OBSERVATION_TYPES),
  message: z.string().min(1).max(2000),
});

export const ListBuildOrdersSchema = z.object({
  page:   z.coerce.number().int().min(1).default(1),
  limit:  z.coerce.number().int().min(1).max(50).default(20),
  status: z.enum(BUILD_ORDER_STATUSES).optional(),
});

export type CreateBuildOrderInput      = z.infer<typeof CreateBuildOrderSchema>;
export type UpdateBuildOrderStatusInput = z.infer<typeof UpdateBuildOrderStatusSchema>;
export type SetAssemblyFeeInput        = z.infer<typeof SetAssemblyFeeSchema>;
export type AddObservationInput        = z.infer<typeof AddObservationSchema>;
export type ListBuildOrdersInput       = z.infer<typeof ListBuildOrdersSchema>;
