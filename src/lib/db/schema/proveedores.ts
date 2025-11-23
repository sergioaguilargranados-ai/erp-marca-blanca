import { pgTable, uuid, varchar, text, boolean, timestamp } from 'drizzle-orm/pg-core'
import { empresas } from './empresas'

export const proveedores = pgTable('proveedores', {
  id: uuid('id').defaultRandom().primaryKey(),
  empresaId: uuid('empresa_id').references(() => empresas.id, { onDelete: 'cascade' }).notNull(),

  // Información básica
  nombre: varchar('nombre', { length: 200 }).notNull(),
  nombreComercial: varchar('nombre_comercial', { length: 200 }),

  // Datos fiscales
  rfc: varchar('rfc', { length: 13 }),
  razonSocial: varchar('razon_social', { length: 300 }),
  regimenFiscal: varchar('regimen_fiscal', { length: 10 }),
  usoCfdi: varchar('uso_cfdi', { length: 10 }),

  // Dirección
  calle: varchar('calle', { length: 200 }),
  numeroExterior: varchar('numero_exterior', { length: 20 }),
  numeroInterior: varchar('numero_interior', { length: 20 }),
  colonia: varchar('colonia', { length: 100 }),
  ciudad: varchar('ciudad', { length: 100 }),
  estado: varchar('estado', { length: 100 }),
  codigoPostal: varchar('codigo_postal', { length: 10 }),
  pais: varchar('pais', { length: 100 }).default('México'),

  // Contacto
  telefono: varchar('telefono', { length: 20 }),
  email: varchar('email', { length: 200 }),
  sitioWeb: varchar('sitio_web', { length: 300 }),
  nombreContacto: varchar('nombre_contacto', { length: 200 }),
  telefonoContacto: varchar('telefono_contacto', { length: 20 }),
  emailContacto: varchar('email_contacto', { length: 200 }),

  // Datos comerciales
  diasCredito: varchar('dias_credito', { length: 10 }).default('0'), // Días de crédito
  limiteCredito: varchar('limite_credito', { length: 20 }).default('0'), // Límite de crédito
  descuentoDefault: varchar('descuento_default', { length: 10 }).default('0'), // % descuento

  // Información adicional
  notas: text('notas'),
  cuentaBancaria: varchar('cuenta_bancaria', { length: 50 }),
  banco: varchar('banco', { length: 100 }),

  // Estado
  activo: boolean('activo').default(true).notNull(),

  // Timestamps
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})
