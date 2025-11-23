import { pgTable, uuid, varchar, text, boolean, timestamp } from 'drizzle-orm/pg-core'
import { empresas } from './empresas'
import { sucursales } from './sucursales'

export const cajas = pgTable('cajas', {
  id: uuid('id').defaultRandom().primaryKey(),
  empresaId: uuid('empresa_id').references(() => empresas.id, { onDelete: 'cascade' }).notNull(),
  sucursalId: uuid('sucursal_id').references(() => sucursales.id, { onDelete: 'cascade' }).notNull(),

  // Información
  nombre: varchar('nombre', { length: 200 }).notNull(), // "Caja 1", "Caja Principal"
  codigo: varchar('codigo', { length: 50 }), // Código único de la caja
  ubicacion: varchar('ubicacion', { length: 200 }), // "Planta baja", "Mostrador 1"

  // Descripción
  descripcion: text('descripcion'),

  // Estado
  activa: boolean('activa').default(true).notNull(),

  // Timestamps
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})
