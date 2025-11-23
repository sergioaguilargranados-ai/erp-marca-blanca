import { pgTable, uuid, varchar, integer, text, timestamp } from 'drizzle-orm/pg-core'
import { productos } from './productos'
import { sucursales } from './sucursales'
import { usuarios } from './usuarios'

export const transferencias = pgTable('transferencias', {
  id: uuid('id').defaultRandom().primaryKey(),

  // Producto y cantidad
  productoId: uuid('producto_id').references(() => productos.id, { onDelete: 'cascade' }).notNull(),
  cantidad: integer('cantidad').notNull(),

  // Sucursales origen y destino
  sucursalOrigenId: uuid('sucursal_origen_id').references(() => sucursales.id, { onDelete: 'cascade' }).notNull(),
  sucursalDestinoId: uuid('sucursal_destino_id').references(() => sucursales.id, { onDelete: 'cascade' }).notNull(),

  // Estado del proceso
  estado: varchar('estado', { length: 50 }).default('solicitada').notNull(), // solicitada, aprobada, en_transito, recibida, rechazada, cancelada

  // Usuarios involucrados
  usuarioSolicitanteId: uuid('usuario_solicitante_id').references(() => usuarios.id),
  usuarioAprobadorId: uuid('usuario_aprobador_id').references(() => usuarios.id),
  usuarioEnvioId: uuid('usuario_envio_id').references(() => usuarios.id),
  usuarioRecepcionId: uuid('usuario_recepcion_id').references(() => usuarios.id),

  // Motivo y observaciones
  motivo: text('motivo'),
  observaciones: text('observaciones'),
  motivoRechazo: text('motivo_rechazo'),

  // Fechas del proceso
  fechaSolicitud: timestamp('fecha_solicitud').defaultNow().notNull(),
  fechaAprobacion: timestamp('fecha_aprobacion'),
  fechaEnvio: timestamp('fecha_envio'),
  fechaRecepcion: timestamp('fecha_recepcion'),

  // Timestamps
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})
