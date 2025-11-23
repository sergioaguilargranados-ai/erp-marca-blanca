import { pgTable, text, timestamp, integer, decimal, varchar, boolean, jsonb, index } from 'drizzle-orm/pg-core';
import { empresas } from './empresas';
import { usuarios } from './usuarios';
import { productos } from './productos';
import { clientes } from './clientes';

// Tabla para descuentos y promociones
export const descuentos = pgTable('descuentos', {
  id: text('id').primaryKey(),
  empresaId: text('empresa_id').notNull().references(() => empresas.id, { onDelete: 'cascade' }),
  codigo: varchar('codigo', { length: 50 }).notNull(), // código del cupón/descuento
  nombre: varchar('nombre', { length: 255 }).notNull(),
  descripcion: text('descripcion'),
  tipo: varchar('tipo', { length: 20 }).notNull(), // 'porcentaje', 'monto_fijo', 'envio_gratis'
  valor: decimal('valor', { precision: 10, scale: 2 }).notNull(),
  aplicaA: varchar('aplica_a', { length: 20 }).notNull(), // 'total', 'producto', 'categoria'
  productosIds: jsonb('productos_ids').$type<string[]>(), // IDs de productos específicos
  categoriasIds: jsonb('categorias_ids').$type<string[]>(), // IDs de categorías
  tipoCliente: varchar('tipo_cliente', { length: 50 }), // 'todos', 'mayorista', 'minorista', 'vip'
  clientesIds: jsonb('clientes_ids').$type<string[]>(), // clientes específicos
  montoMinimo: decimal('monto_minimo', { precision: 10, scale: 2 }), // compra mínima
  cantidadMinima: integer('cantidad_minima'), // cantidad mínima de productos
  usosMaximos: integer('usos_maximos'), // usos totales permitidos
  usosCliente: integer('usos_cliente').default(1), // usos por cliente
  usosActuales: integer('usos_actuales').default(0),
  requiereAutorizacion: boolean('requiere_autorizacion').default(false),
  activo: boolean('activo').default(true),
  fechaInicio: timestamp('fecha_inicio').notNull(),
  fechaFin: timestamp('fecha_fin'),
  creadoPor: text('creado_por').references(() => usuarios.id),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => ({
  empresaIdx: index('descuentos_empresa_idx').on(table.empresaId),
  codigoIdx: index('descuentos_codigo_idx').on(table.codigo),
  activoIdx: index('descuentos_activo_idx').on(table.activo),
  fechasIdx: index('descuentos_fechas_idx').on(table.fechaInicio, table.fechaFin),
}));

// Tabla para historial de uso de descuentos
export const usoDescuentos = pgTable('uso_descuentos', {
  id: text('id').primaryKey(),
  descuentoId: text('descuento_id').notNull().references(() => descuentos.id, { onDelete: 'cascade' }),
  empresaId: text('empresa_id').notNull().references(() => empresas.id, { onDelete: 'cascade' }),
  ventaId: text('venta_id'),
  clienteId: text('cliente_id').references(() => clientes.id),
  montoDescuento: decimal('monto_descuento', { precision: 10, scale: 2 }).notNull(),
  autorizadoPor: text('autorizado_por').references(() => usuarios.id),
  aplicadoPor: text('aplicado_por').references(() => usuarios.id),
  createdAt: timestamp('created_at').defaultNow(),
}, (table) => ({
  descuentoIdx: index('uso_descuentos_descuento_idx').on(table.descuentoId),
  empresaIdx: index('uso_descuentos_empresa_idx').on(table.empresaId),
  clienteIdx: index('uso_descuentos_cliente_idx').on(table.clienteId),
}));

// Tabla para programa de lealtad/puntos
export const programaLealtad = pgTable('programa_lealtad', {
  id: text('id').primaryKey(),
  empresaId: text('empresa_id').notNull().references(() => empresas.id, { onDelete: 'cascade' }),
  nombre: varchar('nombre', { length: 255 }).notNull(),
  descripcion: text('descripcion'),
  puntosXPeso: decimal('puntos_x_peso', { precision: 10, scale: 2 }).default('1.00'), // puntos por cada peso gastado
  pesoXPunto: decimal('peso_x_punto', { precision: 10, scale: 2 }).default('1.00'), // pesos por cada punto
  puntosMinimoCanje: integer('puntos_minimo_canje').default(100),
  expiracionDias: integer('expiracion_dias'), // días para que expiren los puntos
  activo: boolean('activo').default(true),
  niveles: jsonb('niveles').$type<{
    nombre: string;
    puntosRequeridos: number;
    descuentoPorcentaje: number;
    beneficios: string[];
  }[]>(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => ({
  empresaIdx: index('programa_lealtad_empresa_idx').on(table.empresaId),
}));

// Tabla para puntos de clientes
export const puntosClientes = pgTable('puntos_clientes', {
  id: text('id').primaryKey(),
  clienteId: text('cliente_id').notNull().references(() => clientes.id, { onDelete: 'cascade' }),
  empresaId: text('empresa_id').notNull().references(() => empresas.id, { onDelete: 'cascade' }),
  puntosDisponibles: integer('puntos_disponibles').default(0),
  puntosAcumulados: integer('puntos_acumulados').default(0),
  puntosCanjeados: integer('puntos_canjeados').default(0),
  nivelActual: varchar('nivel_actual', { length: 50 }),
  ultimaActualizacion: timestamp('ultima_actualizacion').defaultNow(),
  createdAt: timestamp('created_at').defaultNow(),
}, (table) => ({
  clienteIdx: index('puntos_clientes_cliente_idx').on(table.clienteId),
  empresaIdx: index('puntos_clientes_empresa_idx').on(table.empresaId),
}));

// Tabla para movimientos de puntos
export const movimientosPuntos = pgTable('movimientos_puntos', {
  id: text('id').primaryKey(),
  clienteId: text('cliente_id').notNull().references(() => clientes.id, { onDelete: 'cascade' }),
  empresaId: text('empresa_id').notNull().references(() => empresas.id, { onDelete: 'cascade' }),
  tipo: varchar('tipo', { length: 20 }).notNull(), // 'ganancia', 'canje', 'expiracion', 'ajuste'
  puntos: integer('puntos').notNull(),
  saldoAnterior: integer('saldo_anterior').notNull(),
  saldoNuevo: integer('saldo_nuevo').notNull(),
  ventaId: text('venta_id'),
  descripcion: text('descripcion'),
  fechaExpiracion: timestamp('fecha_expiracion'),
  createdAt: timestamp('created_at').defaultNow(),
}, (table) => ({
  clienteIdx: index('movimientos_puntos_cliente_idx').on(table.clienteId),
  fechaIdx: index('movimientos_puntos_fecha_idx').on(table.createdAt),
}));

// Tipos TypeScript
export type Descuento = typeof descuentos.$inferSelect;
export type NuevoDescuento = typeof descuentos.$inferInsert;
export type UsoDescuento = typeof usoDescuentos.$inferSelect;
export type NuevoUsoDescuento = typeof usoDescuentos.$inferInsert;
export type ProgramaLealtad = typeof programaLealtad.$inferSelect;
export type NuevoProgramaLealtad = typeof programaLealtad.$inferInsert;
export type PuntosCliente = typeof puntosClientes.$inferSelect;
export type NuevosPuntosCliente = typeof puntosClientes.$inferInsert;
export type MovimientoPuntos = typeof movimientosPuntos.$inferSelect;
export type NuevoMovimientoPuntos = typeof movimientosPuntos.$inferInsert;
