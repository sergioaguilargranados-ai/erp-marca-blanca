import { pgTable, uuid, varchar, text, timestamp, boolean, decimal } from 'drizzle-orm/pg-core'
import { empresas } from './empresas'
import { sucursales } from './sucursales'

export const empleados = pgTable('empleados', {
  id: uuid('id').defaultRandom().primaryKey(),
  empresaId: uuid('empresa_id').references(() => empresas.id, { onDelete: 'cascade' }).notNull(),
  sucursalId: uuid('sucursal_id').references(() => sucursales.id),

  // Información personal
  nombre: varchar('nombre', { length: 200 }).notNull(),
  apellidoPaterno: varchar('apellido_paterno', { length: 100 }),
  apellidoMaterno: varchar('apellido_materno', { length: 100 }),
  email: varchar('email', { length: 200 }),
  telefono: varchar('telefono', { length: 20 }),

  // Datos laborales
  numeroEmpleado: varchar('numero_empleado', { length: 50 }),
  puesto: varchar('puesto', { length: 100 }),
  departamento: varchar('departamento', { length: 100 }),
  salario: decimal('salario', { precision: 12, scale: 2 }),
  fechaIngreso: timestamp('fecha_ingreso'),

  // Estado
  activo: boolean('activo').default(true).notNull(),
  notas: text('notas'),

  // Timestamps
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})
