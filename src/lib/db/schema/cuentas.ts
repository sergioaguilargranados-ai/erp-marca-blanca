import { pgTable, text, timestamp, integer, decimal, varchar, boolean, jsonb, index } from 'drizzle-orm/pg-core';
import { empresas } from './empresas';
import { usuarios } from './usuarios';
import { clientes } from './clientes';
import { proveedores } from './proveedores';

// Cuentas por Cobrar (a Clientes)
export const cuentasPorCobrar = pgTable('cuentas_por_cobrar', {
  id: text('id').primaryKey(),
  empresaId: text('empresa_id').notNull().references(() => empresas.id, { onDelete: 'cascade' }),
  clienteId: text('cliente_id').notNull().references(() => clientes.id, { onDelete: 'cascade' }),
  ventaId: text('venta_id'), // referencia a venta si aplica
  facturaId: text('factura_id'), // referencia a factura si aplica
  folio: varchar('folio', { length: 50 }),
  montoTotal: decimal('monto_total', { precision: 12, scale: 2 }).notNull(),
  montoPagado: decimal('monto_pagado', { precision: 12, scale: 2 }).default('0'),
  saldo: decimal('saldo', { precision: 12, scale: 2 }).notNull(),
  estado: varchar('estado', { length: 20 }).notNull(), // 'pendiente', 'parcial', 'pagada', 'vencida', 'cancelada'
  fechaEmision: timestamp('fecha_emision').notNull(),
  fechaVencimiento: timestamp('fecha_vencimiento').notNull(),
  diasCredito: integer('dias_credito').default(0),
  diasVencidos: integer('dias_vencidos').default(0),
  descripcion: text('descripcion'),
  notas: text('notas'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => ({
  empresaIdx: index('cuentas_cobrar_empresa_idx').on(table.empresaId),
  clienteIdx: index('cuentas_cobrar_cliente_idx').on(table.clienteId),
  estadoIdx: index('cuentas_cobrar_estado_idx').on(table.estado),
  vencimientoIdx: index('cuentas_cobrar_vencimiento_idx').on(table.fechaVencimiento),
}));

// Pagos de Cuentas por Cobrar
export const pagosCuentasCobrar = pgTable('pagos_cuentas_cobrar', {
  id: text('id').primaryKey(),
  cuentaId: text('cuenta_id').notNull().references(() => cuentasPorCobrar.id, { onDelete: 'cascade' }),
  empresaId: text('empresa_id').notNull().references(() => empresas.id, { onDelete: 'cascade' }),
  monto: decimal('monto', { precision: 10, scale: 2 }).notNull(),
  metodoPago: varchar('metodo_pago', { length: 50 }).notNull(), // 'efectivo', 'transferencia', 'cheque', etc
  referencia: varchar('referencia', { length: 100 }),
  notas: text('notas'),
  registradoPor: text('registrado_por').references(() => usuarios.id),
  fechaPago: timestamp('fecha_pago').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
}, (table) => ({
  cuentaIdx: index('pagos_cuentas_cobrar_cuenta_idx').on(table.cuentaId),
  fechaIdx: index('pagos_cuentas_cobrar_fecha_idx').on(table.fechaPago),
}));

// Cuentas por Pagar (a Proveedores)
export const cuentasPorPagar = pgTable('cuentas_por_pagar', {
  id: text('id').primaryKey(),
  empresaId: text('empresa_id').notNull().references(() => empresas.id, { onDelete: 'cascade' }),
  proveedorId: text('proveedor_id').notNull().references(() => proveedores.id, { onDelete: 'cascade' }),
  ordenCompraId: text('orden_compra_id'), // referencia a orden de compra
  folio: varchar('folio', { length: 50 }),
  montoTotal: decimal('monto_total', { precision: 12, scale: 2 }).notNull(),
  montoPagado: decimal('monto_pagado', { precision: 12, scale: 2 }).default('0'),
  saldo: decimal('saldo', { precision: 12, scale: 2 }).notNull(),
  estado: varchar('estado', { length: 20 }).notNull(), // 'pendiente', 'parcial', 'pagada', 'vencida', 'cancelada'
  fechaEmision: timestamp('fecha_emision').notNull(),
  fechaVencimiento: timestamp('fecha_vencimiento').notNull(),
  diasCredito: integer('dias_credito').default(0),
  diasVencidos: integer('dias_vencidos').default(0),
  descripcion: text('descripcion'),
  notas: text('notas'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => ({
  empresaIdx: index('cuentas_pagar_empresa_idx').on(table.empresaId),
  proveedorIdx: index('cuentas_pagar_proveedor_idx').on(table.proveedorId),
  estadoIdx: index('cuentas_pagar_estado_idx').on(table.estado),
  vencimientoIdx: index('cuentas_pagar_vencimiento_idx').on(table.fechaVencimiento),
}));

// Pagos de Cuentas por Pagar
export const pagosCuentasPagar = pgTable('pagos_cuentas_pagar', {
  id: text('id').primaryKey(),
  cuentaId: text('cuenta_id').notNull().references(() => cuentasPorPagar.id, { onDelete: 'cascade' }),
  empresaId: text('empresa_id').notNull().references(() => empresas.id, { onDelete: 'cascade' }),
  monto: decimal('monto', { precision: 10, scale: 2 }).notNull(),
  metodoPago: varchar('metodo_pago', { length: 50 }).notNull(),
  referencia: varchar('referencia', { length: 100 }),
  notas: text('notas'),
  registradoPor: text('registrado_por').references(() => usuarios.id),
  fechaPago: timestamp('fecha_pago').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
}, (table) => ({
  cuentaIdx: index('pagos_cuentas_pagar_cuenta_idx').on(table.cuentaId),
  fechaIdx: index('pagos_cuentas_pagar_fecha_idx').on(table.fechaPago),
}));

// Facturación del Servicio (cobro a empresas clientes del SaaS)
export const facturacionServicio = pgTable('facturacion_servicio', {
  id: text('id').primaryKey(),
  empresaId: text('empresa_id').notNull().references(() => empresas.id, { onDelete: 'cascade' }),
  planId: text('plan_id'), // referencia al plan contratado
  periodo: varchar('periodo', { length: 20 }).notNull(), // 'mensual', 'trimestral', 'anual'
  fechaInicio: timestamp('fecha_inicio').notNull(),
  fechaFin: timestamp('fecha_fin').notNull(),
  subtotal: decimal('subtotal', { precision: 10, scale: 2 }).notNull(),
  iva: decimal('iva', { precision: 10, scale: 2 }).notNull(),
  total: decimal('total', { precision: 10, scale: 2 }).notNull(),
  estado: varchar('estado', { length: 20 }).notNull(), // 'pendiente', 'pagada', 'vencida', 'cancelada'
  metodoPago: varchar('metodo_pago', { length: 50 }), // 'stripe', 'transferencia', 'efectivo'
  stripeInvoiceId: varchar('stripe_invoice_id', { length: 255 }),
  stripePaymentIntentId: varchar('stripe_payment_intent_id', { length: 255 }),
  urlFacturaPDF: text('url_factura_pdf'),
  urlFacturaXML: text('url_factura_xml'),
  fechaPago: timestamp('fecha_pago'),
  fechaVencimiento: timestamp('fecha_vencimiento').notNull(),
  intentosCobro: integer('intentos_cobro').default(0),
  proximoIntento: timestamp('proximo_intento'),
  notas: text('notas'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => ({
  empresaIdx: index('facturacion_servicio_empresa_idx').on(table.empresaId),
  estadoIdx: index('facturacion_servicio_estado_idx').on(table.estado),
  fechaVencimientoIdx: index('facturacion_servicio_vencimiento_idx').on(table.fechaVencimiento),
}));

// Transacciones de Pago del Servicio
export const transaccionesServicio = pgTable('transacciones_servicio', {
  id: text('id').primaryKey(),
  facturaId: text('factura_id').notNull().references(() => facturacionServicio.id, { onDelete: 'cascade' }),
  empresaId: text('empresa_id').notNull().references(() => empresas.id, { onDelete: 'cascade' }),
  monto: decimal('monto', { precision: 10, scale: 2 }).notNull(),
  estado: varchar('estado', { length: 20 }).notNull(), // 'exitoso', 'fallido', 'pendiente', 'reembolsado'
  metodoPago: varchar('metodo_pago', { length: 50 }).notNull(),
  stripeChargeId: varchar('stripe_charge_id', { length: 255 }),
  stripePaymentMethodId: varchar('stripe_payment_method_id', { length: 255 }),
  mensajeError: text('mensaje_error'),
  metadata: jsonb('metadata').$type<Record<string, any>>(),
  createdAt: timestamp('created_at').defaultNow(),
}, (table) => ({
  facturaIdx: index('transacciones_servicio_factura_idx').on(table.facturaId),
  estadoIdx: index('transacciones_servicio_estado_idx').on(table.estado),
}));

// Recordatorios de Pago
export const recordatoriosPago = pgTable('recordatorios_pago', {
  id: text('id').primaryKey(),
  empresaId: text('empresa_id').notNull().references(() => empresas.id, { onDelete: 'cascade' }),
  facturaId: text('factura_id').references(() => facturacionServicio.id, { onDelete: 'cascade' }),
  tipo: varchar('tipo', { length: 20 }).notNull(), // 'previo', 'vencimiento', 'moroso'
  diasAntes: integer('dias_antes'), // días antes del vencimiento
  enviado: boolean('enviado').default(false),
  fechaEnvio: timestamp('fecha_envio'),
  email: varchar('email', { length: 255 }),
  createdAt: timestamp('created_at').defaultNow(),
}, (table) => ({
  empresaIdx: index('recordatorios_pago_empresa_idx').on(table.empresaId),
  enviadoIdx: index('recordatorios_pago_enviado_idx').on(table.enviado),
}));

// Tipos TypeScript
export type CuentaPorCobrar = typeof cuentasPorCobrar.$inferSelect;
export type NuevaCuentaPorCobrar = typeof cuentasPorCobrar.$inferInsert;
export type PagoCuentaCobrar = typeof pagosCuentasCobrar.$inferSelect;
export type NuevoPagoCuentaCobrar = typeof pagosCuentasCobrar.$inferInsert;

export type CuentaPorPagar = typeof cuentasPorPagar.$inferSelect;
export type NuevaCuentaPorPagar = typeof cuentasPorPagar.$inferInsert;
export type PagoCuentaPagar = typeof pagosCuentasPagar.$inferSelect;
export type NuevoPagoCuentaPagar = typeof pagosCuentasPagar.$inferInsert;

export type FacturacionServicio = typeof facturacionServicio.$inferSelect;
export type NuevaFacturacionServicio = typeof facturacionServicio.$inferInsert;
export type TransaccionServicio = typeof transaccionesServicio.$inferSelect;
export type NuevaTransaccionServicio = typeof transaccionesServicio.$inferInsert;
export type RecordatorioPago = typeof recordatoriosPago.$inferSelect;
export type NuevoRecordatorioPago = typeof recordatoriosPago.$inferInsert;
