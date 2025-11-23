import { pgTable, uuid, varchar, decimal, text, timestamp, boolean } from 'drizzle-orm/pg-core'
import { cajas } from './cajas'
import { usuarios } from './usuarios'

export const turnos = pgTable('turnos', {
  id: uuid('id').defaultRandom().primaryKey(),
  cajaId: uuid('caja_id').references(() => cajas.id, { onDelete: 'cascade' }).notNull(),

  // Usuario cajero
  usuarioId: uuid('usuario_id').references(() => usuarios.id).notNull(),

  // Tipo de turno
  tipoTurno: varchar('tipo_turno', { length: 50 }).notNull(), // matutino, vespertino, nocturno

  // Montos de apertura
  fondoInicial: decimal('fondo_inicial', { precision: 12, scale: 2 }).notNull(),

  // Montos calculados al cierre
  ventasEfectivo: decimal('ventas_efectivo', { precision: 12, scale: 2 }).default('0'),
  ventasTarjeta: decimal('ventas_tarjeta', { precision: 12, scale: 2 }).default('0'),
  ventasTransferencia: decimal('ventas_transferencia', { precision: 12, scale: 2 }).default('0'),
  totalVentas: decimal('total_ventas', { precision: 12, scale: 2 }).default('0'),

  // Movimientos de caja
  ingresosAdicionales: decimal('ingresos_adicionales', { precision: 12, scale: 2 }).default('0'),
  retiros: decimal('retiros', { precision: 12, scale: 2 }).default('0'),

  // Conteo físico al cierre
  efectivoContado: decimal('efectivo_contado', { precision: 12, scale: 2 }),

  // Cálculos
  efectivoEsperado: decimal('efectivo_esperado', { precision: 12, scale: 2 }),
  diferencia: decimal('diferencia', { precision: 12, scale: 2 }),

  // Denominaciones (JSON con conteo de billetes y monedas)
  denominaciones: text('denominaciones'), // JSON: { "1000": 5, "500": 10, ... }

  // Estado
  estado: varchar('estado', { length: 50 }).default('abierto').notNull(), // abierto, cerrado

  // Observaciones
  observacionesApertura: text('observaciones_apertura'),
  observacionesCierre: text('observaciones_cierre'),

  // Fechas
  fechaApertura: timestamp('fecha_apertura').defaultNow().notNull(),
  fechaCierre: timestamp('fecha_cierre'),

  // Timestamps
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})
