import { pgTable, uuid, varchar, text, boolean, timestamp } from 'drizzle-orm/pg-core'
import { empresas } from './empresas'

export const roles = pgTable('roles', {
  id: uuid('id').defaultRandom().primaryKey(),
  empresaId: uuid('empresa_id').references(() => empresas.id, { onDelete: 'cascade' }).notNull(),

  // Rol
  nombre: varchar('nombre', { length: 100 }).notNull(),
  descripcion: text('descripcion'),
  esPredefinido: boolean('es_predefinido').default(false).notNull(), // Los 6 roles base

  // Estado
  activo: boolean('activo').default(true).notNull(),

  // Timestamps
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})
