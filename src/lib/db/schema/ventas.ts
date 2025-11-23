import { pgTable, uuid, varchar, text, decimal, timestamp, integer, boolean } from 'drizzle-orm/pg-core'
import { empresas } from './empresas'
import { sucursales } from './sucursales'
import { usuarios } from './usuarios'
import { clientes } from './clientes'
import { productos } from './productos'

export const ventas = pgTable('ventas', {
  id: uuid('id').defaultRandom().primaryKey(),
  empresaId: uuid('empresa_id').references(() => empresas.id, { onDelete: 'cascade' }).notNull(),
  sucursalId: uuid('sucursal_id').references(() => sucursales.id, { onDelete: 'cascade' }).notNull(),

  // Usuario que realizó la venta (cajero/vendedor)
  usuarioId: uuid('usuario_id').references(() => usuarios.id).notNull(),

  // Cliente (opcional - puede ser venta a público general)
  clienteId: uuid('cliente_id').references(() => clientes.id),
  nombreCliente: varchar('nombre_cliente', { length: 300 }), // Para ventas sin cliente registrado

  // Número de venta (folio)
  folio: varchar('folio', { length: 50 }).notNull(), // Generado automáticamente

  // Totales
  subtotal: decimal('subtotal', { precision: 12, scale: 2 }).notNull(),
  iva: decimal('iva', { precision: 12, scale: 2 }).notNull(),
  descuento: decimal('descuento', { precision: 12, scale: 2 }).default('0').notNull(),
  total: decimal('total', { precision: 12, scale: 2 }).notNull(),

  // Método de pago
  metodoPago: varchar('metodo_pago', { length: 50 }).notNull(), // efectivo, tarjeta, transferencia, mixto

  // Para pagos mixtos (JSON con desglose)
  desglosePago: text('desglose_pago'), // {efectivo: 100, tarjeta: 50}

  // Para efectivo
  montoPagado: decimal('monto_pagado', { precision: 12, scale: 2 }),
  cambio: decimal('cambio', { precision: 12, scale: 2 }),

  // Referencias
  turnoId: uuid('turno_id'), // Referencia a turno de caja (para futuro)
  cajaId: uuid('caja_id'), // Referencia a caja registradora (para futuro)

  // Facturación
  facturaId: uuid('factura_id'), // Referencia a factura si se facturó
  requiereFactura: varchar('requiere_factura', { length: 20 }).default('pendiente').notNull(), // pendiente, si, no, facturada

  // Estado
  estado: varchar('estado', { length: 20 }).default('completada').notNull(), // completada, cancelada, pendiente

  // Notas
  notas: text('notas'),

  // Timestamp
  createdAt: timestamp('created_at').defaultNow().notNull(),
  canceladaAt: timestamp('cancelada_at'),
})

export const detallesVenta = pgTable('detalles_venta', {
  id: uuid('id').defaultRandom().primaryKey(),
  ventaId: uuid('venta_id').references(() => ventas.id, { onDelete: 'cascade' }).notNull(),
  productoId: uuid('producto_id').references(() => productos.id).notNull(),

  // Información del producto al momento de la venta
  nombreProducto: varchar('nombre_producto', { length: 300 }).notNull(),
  codigoBarras: varchar('codigo_barras', { length: 50 }),
  sku: varchar('sku', { length: 100 }),

  // Cantidades
  cantidad: integer('cantidad').notNull(),
  unidadMedida: varchar('unidad_medida', { length: 50 }).notNull(),

  // Precios
  precioUnitario: decimal('precio_unitario', { precision: 12, scale: 2 }).notNull(),
  precioOriginal: decimal('precio_original', { precision: 12, scale: 2 }).notNull(), // Por si hubo descuento
  descuento: decimal('descuento', { precision: 12, scale: 2 }).default('0').notNull(),
  subtotal: decimal('subtotal', { precision: 12, scale: 2 }).notNull(), // cantidad * precioUnitario
  iva: decimal('iva', { precision: 12, scale: 2 }).notNull(),
  total: decimal('total', { precision: 12, scale: 2 }).notNull(),

  // Impuestos
  aplicaIva: boolean('aplica_iva').default(true).notNull(),
  tasaIva: decimal('tasa_iva', { precision: 5, scale: 2 }).notNull(),

  // Timestamp
  createdAt: timestamp('created_at').defaultNow().notNull(),
})
