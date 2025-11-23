import { pgTable, uuid, integer, decimal, timestamp, varchar } from 'drizzle-orm/pg-core'
import { productos } from './productos'
import { sucursales } from './sucursales'

export const inventario = pgTable('inventario', {
  id: uuid('id').defaultRandom().primaryKey(),
  productoId: uuid('producto_id').references(() => productos.id, { onDelete: 'cascade' }).notNull(),
  sucursalId: uuid('sucursal_id').references(() => sucursales.id, { onDelete: 'cascade' }).notNull(),

  // Stock
  cantidad: integer('cantidad').default(0).notNull(),
  cantidadReservada: integer('cantidad_reservada').default(0).notNull(), // Para pedidos pendientes
  cantidadDisponible: integer('cantidad_disponible').default(0).notNull(), // cantidad - cantidadReservada

  // Costo promedio
  costoPromedio: decimal('costo_promedio', { precision: 12, scale: 2 }),

  // Ubicación en almacén
  ubicacion: varchar('ubicacion', { length: 100 }),

  // Timestamps
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})
