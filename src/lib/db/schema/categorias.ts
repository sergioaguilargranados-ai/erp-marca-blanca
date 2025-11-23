import { pgTable, uuid, varchar, text, boolean, timestamp } from 'drizzle-orm/pg-core'
import { empresas } from './empresas'

export const categorias = pgTable('categorias_productos', {
  id: uuid('id').defaultRandom().primaryKey(),
  empresaId: uuid('empresa_id').references(() => empresas.id, { onDelete: 'cascade' }).notNull(),

  // Información
  nombre: varchar('nombre', { length: 200 }).notNull(),
  descripcion: text('descripcion'),
  codigo: varchar('codigo', { length: 50 }),

  // Jerarquía (categorías padre-hijo)
  categoriaPadre: uuid('categoria_padre').references((): any => categorias.id),

  // Estado
  activa: boolean('activa').default(true).notNull(),

  // Timestamps
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})
