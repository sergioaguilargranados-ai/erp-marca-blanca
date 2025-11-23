import { pgTable, uuid, varchar, text, decimal, integer, boolean, timestamp } from 'drizzle-orm/pg-core'

export const planes = pgTable('planes', {
  id: uuid('id').defaultRandom().primaryKey(),
  nombre: varchar('nombre', { length: 100 }).notNull(),
  descripcion: text('descripcion'),
  precioMensual: decimal('precio_mensual', { precision: 10, scale: 2 }),
  precioAnual: decimal('precio_anual', { precision: 10, scale: 2 }),
  moneda: varchar('moneda', { length: 3 }).default('MXN').notNull(),

  // Límites
  maxSucursales: integer('max_sucursales').notNull(),
  maxUsuarios: integer('max_usuarios'),
  maxProductos: integer('max_productos'),
  maxTransaccionesMes: integer('max_transacciones_mes'),
  maxAlmacenamientoGb: integer('max_almacenamiento_gb'),

  // Estado
  activo: boolean('activo').default(true).notNull(),

  // Timestamps
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})
