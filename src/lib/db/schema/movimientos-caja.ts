import { pgTable, uuid, varchar, decimal, text, timestamp } from 'drizzle-orm/pg-core'
import { turnos } from './turnos'
import { usuarios } from './usuarios'

export const movimientosCaja = pgTable('movimientos_caja', {
  id: uuid('id').defaultRandom().primaryKey(),
  turnoId: uuid('turno_id').references(() => turnos.id, { onDelete: 'cascade' }).notNull(),

  // Tipo de movimiento
  tipo: varchar('tipo', { length: 50 }).notNull(), // ingreso, retiro

  // Monto
  monto: decimal('monto', { precision: 12, scale: 2 }).notNull(),

  // Concepto
  concepto: varchar('concepto', { length: 200 }).notNull(),
  observaciones: text('observaciones'),

  // Usuario que realizó el movimiento
  usuarioId: uuid('usuario_id').references(() => usuarios.id),

  // Autorización (para retiros grandes)
  requiereAutorizacion: varchar('requiere_autorizacion', { length: 20 }).default('no').notNull(),
  autorizadoPor: uuid('autorizado_por').references(() => usuarios.id),

  // Timestamp
  createdAt: timestamp('created_at').defaultNow().notNull(),
})
