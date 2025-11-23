import { pgTable, uuid, varchar, text, boolean, timestamp } from 'drizzle-orm/pg-core'
import { empresas } from './empresas'
import { roles } from './roles'
import { sucursales } from './sucursales'

export const usuarios = pgTable('usuarios', {
  id: uuid('id').defaultRandom().primaryKey(),
  empresaId: uuid('empresa_id').references(() => empresas.id, { onDelete: 'cascade' }).notNull(),

  // Identificación
  nombre: varchar('nombre', { length: 200 }).notNull(),
  email: varchar('email', { length: 200 }).notNull(),
  telefono: varchar('telefono', { length: 20 }),

  // Autenticación
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  emailVerificado: boolean('email_verificado').default(false).notNull(),
  tokenVerificacion: varchar('token_verificacion', { length: 100 }),
  tokenRecuperacion: varchar('token_recuperacion', { length: 100 }),
  tokenExpiracion: timestamp('token_expiracion'),

  // Rol y sucursales
  rolId: uuid('rol_id').references(() => roles.id),
  sucursalPrincipal: uuid('sucursal_principal').references(() => sucursales.id),

  // Estado
  activo: boolean('activo').default(true).notNull(),
  bloqueado: boolean('bloqueado').default(false).notNull(),
  razonBloqueo: text('razon_bloqueo'),

  // Último acceso
  ultimoLogin: timestamp('ultimo_login'),
  ultimoIp: varchar('ultimo_ip', { length: 45 }),

  // Timestamps
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})
