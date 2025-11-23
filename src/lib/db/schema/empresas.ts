import { pgTable, uuid, varchar, text, timestamp, integer, bigint } from 'drizzle-orm/pg-core'
import { planes } from './planes'

export const empresas = pgTable('empresas', {
  id: uuid('id').defaultRandom().primaryKey(),

  // Identificación
  nombre: varchar('nombre', { length: 200 }).notNull(),
  subdominio: varchar('subdominio', { length: 100 }).unique().notNull(),

  // Plan y estado
  planId: uuid('plan_id').references(() => planes.id),
  estado: varchar('estado', { length: 20 }).default('prueba').notNull(), // 'prueba', 'activa', 'suspendida', 'cancelada'
  fechaInicioPrueba: timestamp('fecha_inicio_prueba'),
  fechaFinPrueba: timestamp('fecha_fin_prueba'),
  fechaActivacion: timestamp('fecha_activacion'),
  fechaSuspension: timestamp('fecha_suspension'),
  fechaCancelacion: timestamp('fecha_cancelacion'),
  motivoCancelacion: text('motivo_cancelacion'),

  // Branding (White Label)
  logoUrl: text('logo_url'),
  colorPrimario: varchar('color_primario', { length: 7 }), // #HEX
  colorSecundario: varchar('color_secundario', { length: 7 }),
  nombreSistema: varchar('nombre_sistema', { length: 100 }),

  // Facturación
  diaCobro: integer('dia_cobro').default(1).notNull(),
  metodoPago: varchar('metodo_pago', { length: 50 }),
  ultimoPago: timestamp('ultimo_pago'),
  proximoPago: timestamp('proximo_pago'),

  // Contacto principal
  nombreContacto: varchar('nombre_contacto', { length: 200 }),
  emailContacto: varchar('email_contacto', { length: 200 }).notNull(),
  telefonoContacto: varchar('telefono_contacto', { length: 20 }),

  // Uso actual (para límites)
  usoSucursales: integer('uso_sucursales').default(0).notNull(),
  usoUsuarios: integer('uso_usuarios').default(0).notNull(),
  usoProductos: integer('uso_productos').default(0).notNull(),
  usoTransaccionesMes: integer('uso_transacciones_mes').default(0).notNull(),
  usoAlmacenamientoMb: bigint('uso_almacenamiento_mb', { mode: 'number' }).default(0).notNull(),

  // Timestamps
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})
