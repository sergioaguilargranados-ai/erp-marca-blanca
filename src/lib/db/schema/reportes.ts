import { pgTable, text, timestamp, integer, decimal, varchar, boolean, jsonb, index } from 'drizzle-orm/pg-core';
import { empresas } from './empresas';
import { usuarios } from './usuarios';

// Tabla para reportes programados
export const reportesProgramados = pgTable('reportes_programados', {
  id: text('id').primaryKey(),
  empresaId: text('empresa_id').notNull().references(() => empresas.id, { onDelete: 'cascade' }),
  nombre: varchar('nombre', { length: 255 }).notNull(),
  tipo: varchar('tipo', { length: 50 }).notNull(), // 'ventas', 'inventario', 'facturacion', 'rentabilidad', etc
  frecuencia: varchar('frecuencia', { length: 50 }).notNull(), // 'diario', 'semanal', 'mensual'
  destinatarios: jsonb('destinatarios').$type<string[]>().notNull(), // emails
  filtros: jsonb('filtros').$type<Record<string, any>>(), // filtros personalizados
  formato: varchar('formato', { length: 20 }).default('pdf'), // 'pdf', 'excel', 'csv'
  activo: boolean('activo').default(true),
  ultimaEjecucion: timestamp('ultima_ejecucion'),
  proximaEjecucion: timestamp('proxima_ejecucion'),
  creadoPor: text('creado_por').references(() => usuarios.id),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => ({
  empresaIdx: index('reportes_programados_empresa_idx').on(table.empresaId),
  tipoIdx: index('reportes_programados_tipo_idx').on(table.tipo),
}));

// Tabla para historial de ejecución de reportes
export const historialReportes = pgTable('historial_reportes', {
  id: text('id').primaryKey(),
  reporteId: text('reporte_id').references(() => reportesProgramados.id, { onDelete: 'cascade' }),
  empresaId: text('empresa_id').notNull().references(() => empresas.id, { onDelete: 'cascade' }),
  tipo: varchar('tipo', { length: 50 }).notNull(),
  parametros: jsonb('parametros').$type<Record<string, any>>(),
  estado: varchar('estado', { length: 20 }).notNull(), // 'generando', 'completado', 'error'
  urlArchivo: text('url_archivo'),
  tamanoBytes: integer('tamano_bytes'),
  tiempoGeneracion: integer('tiempo_generacion_ms'),
  error: text('error'),
  generadoPor: text('generado_por').references(() => usuarios.id),
  createdAt: timestamp('created_at').defaultNow(),
}, (table) => ({
  empresaIdx: index('historial_reportes_empresa_idx').on(table.empresaId),
  fechaIdx: index('historial_reportes_fecha_idx').on(table.createdAt),
}));

// Tabla para métricas y KPIs pre-calculados (para dashboards rápidos)
export const metricasCache = pgTable('metricas_cache', {
  id: text('id').primaryKey(),
  empresaId: text('empresa_id').notNull().references(() => empresas.id, { onDelete: 'cascade' }),
  sucursalId: text('sucursal_id'),
  tipo: varchar('tipo', { length: 50 }).notNull(), // 'ventas_dia', 'inventario_valor', 'facturacion_mes', etc
  periodo: varchar('periodo', { length: 20 }).notNull(), // 'dia', 'semana', 'mes', 'año'
  fecha: timestamp('fecha').notNull(),
  metricas: jsonb('metricas').$type<Record<string, any>>().notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => ({
  empresaFechaIdx: index('metricas_cache_empresa_fecha_idx').on(table.empresaId, table.fecha),
  tipoIdx: index('metricas_cache_tipo_idx').on(table.tipo),
}));

// Nota: La tabla 'auditoria' está definida en notificaciones.ts

// Tipos TypeScript
export type ReporteProgramado = typeof reportesProgramados.$inferSelect;
export type NuevoReporteProgramado = typeof reportesProgramados.$inferInsert;
export type HistorialReporte = typeof historialReportes.$inferSelect;
export type NuevoHistorialReporte = typeof historialReportes.$inferInsert;
export type MetricaCache = typeof metricasCache.$inferSelect;
export type NuevaMetricaCache = typeof metricasCache.$inferInsert;
