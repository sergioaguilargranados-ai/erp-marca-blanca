import { pgTable, uuid, varchar, text, boolean, timestamp, decimal } from 'drizzle-orm/pg-core'
import { empresas } from './empresas'

export const sucursales = pgTable('sucursales', {
  id: uuid('id').defaultRandom().primaryKey(),
  empresaId: uuid('empresa_id').references(() => empresas.id, { onDelete: 'cascade' }).notNull(),

  // Identificación
  nombre: varchar('nombre', { length: 200 }).notNull(),
  codigo: varchar('codigo', { length: 20 }),

  // Ubicación
  direccion: text('direccion'),
  ciudad: varchar('ciudad', { length: 100 }),
  estado: varchar('estado', { length: 100 }),
  codigoPostal: varchar('codigo_postal', { length: 10 }),
  pais: varchar('pais', { length: 3 }).default('MEX').notNull(),

  // Contacto
  telefono: varchar('telefono', { length: 20 }),
  email: varchar('email', { length: 200 }),

  // Configuración
  moneda: varchar('moneda', { length: 3 }).default('MXN').notNull(),
  tasaIva: decimal('tasa_iva', { precision: 5, scale: 2 }).default('16.00').notNull(),

  // Datos fiscales
  rfc: varchar('rfc', { length: 13 }),
  razonSocial: varchar('razon_social', { length: 200 }),
  regimenFiscal: varchar('regimen_fiscal', { length: 3 }), // Clave SAT

  // Estado
  activa: boolean('activa').default(true).notNull(),

  // Timestamps
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})
