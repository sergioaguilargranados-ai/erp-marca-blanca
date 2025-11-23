import { pgTable, uuid, varchar, text, timestamp, boolean } from 'drizzle-orm/pg-core'
import { empresas } from './empresas'
import { usuarios } from './usuarios'

export const notificaciones = pgTable('notificaciones', {
  id: uuid('id').defaultRandom().primaryKey(),
  empresaId: uuid('empresa_id').references(() => empresas.id, { onDelete: 'cascade' }).notNull(),
  usuarioId: uuid('usuario_id').references(() => usuarios.id, { onDelete: 'cascade' }).notNull(),

  // Tipo de notificación
  tipo: varchar('tipo', { length: 50 }).notNull(), // venta, inventario, factura, pago, etc.

  // Contenido
  titulo: varchar('titulo', { length: 200 }).notNull(),
  mensaje: text('mensaje').notNull(),

  // Metadata
  entidadTipo: varchar('entidad_tipo', { length: 50 }), // venta, producto, factura, etc.
  entidadId: uuid('entidad_id'), // ID de la entidad relacionada

  // URL de acción
  accionUrl: text('accion_url'),
  accionTexto: varchar('accion_texto', { length: 100 }),

  // Estado
  leida: boolean('leida').default(false).notNull(),
  archivada: boolean('archivada').default(false).notNull(),

  // Prioridad
  prioridad: varchar('prioridad', { length: 20 }).default('normal').notNull(), // baja, normal, alta, urgente

  // Timestamps
  fechaLeida: timestamp('fecha_leida'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const preferenciaNotificaciones = pgTable('preferencia_notificaciones', {
  id: uuid('id').defaultRandom().primaryKey(),
  usuarioId: uuid('usuario_id').references(() => usuarios.id, { onDelete: 'cascade' }).notNull().unique(),

  // Canales
  emailEnabled: boolean('email_enabled').default(true).notNull(),
  pushEnabled: boolean('push_enabled').default(true).notNull(),
  inAppEnabled: boolean('in_app_enabled').default(true).notNull(),

  // Tipos de notificaciones
  notifVentas: boolean('notif_ventas').default(true).notNull(),
  notifInventario: boolean('notif_inventario').default(true).notNull(),
  notifFacturas: boolean('notif_facturas').default(true).notNull(),
  notifPagos: boolean('notif_pagos').default(true).notNull(),
  notifSistema: boolean('notif_sistema').default(true).notNull(),

  // Timestamps
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const apiKeys = pgTable('api_keys', {
  id: uuid('id').defaultRandom().primaryKey(),
  empresaId: uuid('empresa_id').references(() => empresas.id, { onDelete: 'cascade' }).notNull(),

  // Key
  nombre: varchar('nombre', { length: 200 }).notNull(),
  key: varchar('key', { length: 100 }).notNull().unique(), // Hash de la API key
  keyPrefix: varchar('key_prefix', { length: 20 }).notNull(), // Primeros caracteres visibles

  // Permisos
  permisos: text('permisos'), // JSON con permisos permitidos

  // Rate limiting
  requestsPorMinuto: varchar('requests_por_minuto', { length: 10 }).default('60'),

  // Estado
  activa: boolean('activa').default(true).notNull(),

  // Uso
  ultimoUso: timestamp('ultimo_uso'),
  totalRequests: varchar('total_requests', { length: 20 }).default('0'),

  // Timestamps
  expiraEn: timestamp('expira_en'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const auditoria = pgTable('auditoria', {
  id: uuid('id').defaultRandom().primaryKey(),
  empresaId: uuid('empresa_id').references(() => empresas.id, { onDelete: 'cascade' }).notNull(),
  usuarioId: uuid('usuario_id').references(() => usuarios.id),

  // Acción
  accion: varchar('accion', { length: 100 }).notNull(), // crear, actualizar, eliminar, login, etc.
  modulo: varchar('modulo', { length: 100 }).notNull(), // productos, ventas, usuarios, etc.

  // Entidad afectada
  entidadTipo: varchar('entidad_tipo', { length: 50 }),
  entidadId: uuid('entidad_id'),

  // Datos
  datosAnteriores: text('datos_anteriores'), // JSON
  datosNuevos: text('datos_nuevos'), // JSON

  // Metadata
  ip: varchar('ip', { length: 50 }),
  userAgent: text('user_agent'),

  // Timestamp
  createdAt: timestamp('created_at').defaultNow().notNull(),
})
