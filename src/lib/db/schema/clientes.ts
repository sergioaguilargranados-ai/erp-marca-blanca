import { pgTable, uuid, varchar, text, boolean, timestamp, decimal, integer } from 'drizzle-orm/pg-core'
import { empresas } from './empresas'

export const clientes = pgTable('clientes', {
  id: uuid('id').defaultRandom().primaryKey(),
  empresaId: uuid('empresa_id').references(() => empresas.id, { onDelete: 'cascade' }).notNull(),

  // Información básica
  nombre: varchar('nombre', { length: 300 }).notNull(),
  email: varchar('email', { length: 200 }),
  telefono: varchar('telefono', { length: 20 }),
  direccion: text('direccion'),

  // Datos fiscales (para facturación)
  rfc: varchar('rfc', { length: 13 }),
  razonSocial: varchar('razon_social', { length: 300 }),
  regimenFiscal: varchar('regimen_fiscal', { length: 3 }), // Clave SAT
  usoCfdi: varchar('uso_cfdi', { length: 3 }), // Clave SAT (G01, G03, etc.)
  codigoPostal: varchar('codigo_postal', { length: 10 }),

  // Tipo de cliente
  tipo: varchar('tipo', { length: 50 }).default('minorista').notNull(), // minorista, mayorista, especial

  // Crédito (para futuro)
  creditoActivo: boolean('credito_activo').default(false).notNull(),
  limiteCredito: decimal('limite_credito', { precision: 12, scale: 2 }),

  // Programa de lealtad (para futuro)
  puntos: integer('puntos').default(0).notNull(),

  // Notas
  notas: text('notas'),

  // Estado
  activo: boolean('activo').default(true).notNull(),

  // Timestamps
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})
