import { pgTable, uuid, varchar, text, integer, decimal, timestamp } from 'drizzle-orm/pg-core'
import { productos } from './productos'
import { sucursales } from './sucursales'
import { usuarios } from './usuarios'

export const movimientosInventario = pgTable('movimientos_inventario', {
  id: uuid('id').defaultRandom().primaryKey(),
  productoId: uuid('producto_id').references(() => productos.id, { onDelete: 'cascade' }).notNull(),
  sucursalId: uuid('sucursal_id').references(() => sucursales.id, { onDelete: 'cascade' }).notNull(),

  // Tipo de movimiento
  tipo: varchar('tipo', { length: 50 }).notNull(), // 'entrada', 'salida', 'transferencia', 'ajuste', 'venta', 'compra'

  // Cantidad
  cantidad: integer('cantidad').notNull(),
  cantidadAnterior: integer('cantidad_anterior').notNull(),
  cantidadNueva: integer('cantidad_nueva').notNull(),

  // Costo
  costoUnitario: decimal('costo_unitario', { precision: 12, scale: 2 }),
  costoTotal: decimal('costo_total', { precision: 12, scale: 2 }),

  // Transferencia (si aplica)
  sucursalOrigenId: uuid('sucursal_origen_id').references(() => sucursales.id),
  sucursalDestinoId: uuid('sucursal_destino_id').references(() => sucursales.id),

  // Referencia a documento (venta, compra, etc.)
  documentoTipo: varchar('documento_tipo', { length: 50 }),
  documentoId: uuid('documento_id'),

  // Observaciones
  observaciones: text('observaciones'),

  // Usuario que realizó el movimiento
  usuarioId: uuid('usuario_id').references(() => usuarios.id),

  // Timestamp
  createdAt: timestamp('created_at').defaultNow().notNull(),
})
