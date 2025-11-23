import { pgTable, uuid, varchar, text, decimal, timestamp } from 'drizzle-orm/pg-core'
import { empresas } from './empresas'
import { proveedores } from './proveedores'
import { productos } from './productos'
import { sucursales } from './sucursales'
import { usuarios } from './usuarios'

// Órdenes de Compra
export const ordenesCompra = pgTable('ordenes_compra', {
  id: uuid('id').defaultRandom().primaryKey(),
  empresaId: uuid('empresa_id').references(() => empresas.id, { onDelete: 'cascade' }).notNull(),
  proveedorId: uuid('proveedor_id').references(() => proveedores.id).notNull(),
  sucursalId: uuid('sucursal_id').references(() => sucursales.id).notNull(),
  usuarioId: uuid('usuario_id').references(() => usuarios.id),

  // Folio
  folio: varchar('folio', { length: 50 }).notNull(),

  // Fechas
  fechaOrden: timestamp('fecha_orden').defaultNow().notNull(),
  fechaEsperada: timestamp('fecha_esperada'),
  fechaRecepcion: timestamp('fecha_recepcion'),

  // Montos
  subtotal: decimal('subtotal', { precision: 12, scale: 2 }).notNull(),
  descuento: decimal('descuento', { precision: 12, scale: 2 }).default('0'),
  iva: decimal('iva', { precision: 12, scale: 2 }).default('0'),
  total: decimal('total', { precision: 12, scale: 2 }).notNull(),

  // Estado: borrador, enviada, recibida_parcial, recibida, cancelada
  estado: varchar('estado', { length: 50 }).default('borrador').notNull(),

  // Información adicional
  observaciones: text('observaciones'),
  terminosPago: varchar('terminos_pago', { length: 200 }),

  // Timestamps
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// Detalles de Orden de Compra
export const detallesOrdenCompra = pgTable('detalles_orden_compra', {
  id: uuid('id').defaultRandom().primaryKey(),
  ordenCompraId: uuid('orden_compra_id').references(() => ordenesCompra.id, { onDelete: 'cascade' }).notNull(),
  productoId: uuid('producto_id').references(() => productos.id).notNull(),

  // Cantidades
  cantidad: decimal('cantidad', { precision: 12, scale: 2 }).notNull(),
  cantidadRecibida: decimal('cantidad_recibida', { precision: 12, scale: 2 }).default('0'),

  // Precios
  precioUnitario: decimal('precio_unitario', { precision: 12, scale: 6 }).notNull(),
  descuento: decimal('descuento', { precision: 12, scale: 2 }).default('0'),
  subtotal: decimal('subtotal', { precision: 12, scale: 2 }).notNull(),
  iva: decimal('iva', { precision: 12, scale: 2 }).default('0'),
  total: decimal('total', { precision: 12, scale: 2 }).notNull(),

  // Información adicional
  notas: text('notas'),

  // Timestamps
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// Recepciones de Mercancía
export const recepcionesMercancia = pgTable('recepciones_mercancia', {
  id: uuid('id').defaultRandom().primaryKey(),
  empresaId: uuid('empresa_id').references(() => empresas.id, { onDelete: 'cascade' }).notNull(),
  ordenCompraId: uuid('orden_compra_id').references(() => ordenesCompra.id).notNull(),
  sucursalId: uuid('sucursal_id').references(() => sucursales.id).notNull(),
  usuarioId: uuid('usuario_id').references(() => usuarios.id),

  // Folio
  folio: varchar('folio', { length: 50 }).notNull(),

  // Fecha
  fechaRecepcion: timestamp('fecha_recepcion').defaultNow().notNull(),

  // Tipo: total, parcial
  tipoRecepcion: varchar('tipo_recepcion', { length: 20 }).default('total').notNull(),

  // Observaciones
  observaciones: text('observaciones'),
  observacionesDiferencias: text('observaciones_diferencias'),

  // Timestamps
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// Detalles de Recepción
export const detallesRecepcion = pgTable('detalles_recepcion', {
  id: uuid('id').defaultRandom().primaryKey(),
  recepcionId: uuid('recepcion_id').references(() => recepcionesMercancia.id, { onDelete: 'cascade' }).notNull(),
  detalleOrdenId: uuid('detalle_orden_id').references(() => detallesOrdenCompra.id).notNull(),
  productoId: uuid('producto_id').references(() => productos.id).notNull(),

  // Cantidades
  cantidadEsperada: decimal('cantidad_esperada', { precision: 12, scale: 2 }).notNull(),
  cantidadRecibida: decimal('cantidad_recibida', { precision: 12, scale: 2 }).notNull(),
  cantidadDiferencia: decimal('cantidad_diferencia', { precision: 12, scale: 2 }).default('0'),

  // Estado del producto recibido
  estadoProducto: varchar('estado_producto', { length: 50 }).default('bueno').notNull(), // bueno, dañado, defectuoso

  // Notas
  notas: text('notas'),

  // Timestamps
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// Nota: La tabla 'cuentasPorPagar' ahora está en cuentas.ts con una versión mejorada
