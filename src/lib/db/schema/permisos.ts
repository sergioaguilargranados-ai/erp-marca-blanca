import { pgTable, uuid, varchar, boolean, timestamp } from 'drizzle-orm/pg-core'
import { roles } from './roles'

export const permisos = pgTable('permisos', {
  id: uuid('id').defaultRandom().primaryKey(),
  rolId: uuid('rol_id').references(() => roles.id, { onDelete: 'cascade' }).notNull(),

  // Módulo y acción
  modulo: varchar('modulo', { length: 50 }).notNull(), // 'productos', 'ventas', 'inventario', etc.
  accion: varchar('accion', { length: 20 }).notNull(), // 'crear', 'leer', 'actualizar', 'eliminar'
  permitido: boolean('permitido').default(false).notNull(),

  // Timestamp
  createdAt: timestamp('created_at').defaultNow().notNull(),
})
