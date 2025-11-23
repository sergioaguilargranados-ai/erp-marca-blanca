import { pgTable, uuid, varchar, text, decimal, boolean, timestamp, integer } from 'drizzle-orm/pg-core'
import { empresas } from './empresas'
import { categorias } from './categorias'

export const productos = pgTable('productos', {
  id: uuid('id').defaultRandom().primaryKey(),
  empresaId: uuid('empresa_id').references(() => empresas.id, { onDelete: 'cascade' }).notNull(),

  // Información básica
  nombre: varchar('nombre', { length: 300 }).notNull(),
  descripcion: text('descripcion'),
  sku: varchar('sku', { length: 100 }),

  // Código de barras (ÚNICO GLOBAL)
  codigoBarras: varchar('codigo_barras', { length: 50 }).unique(),

  // Categoría
  categoriaId: uuid('categoria_id').references(() => categorias.id),

  // Precios
  precioCompra: decimal('precio_compra', { precision: 12, scale: 2 }),
  precioVentaMinorista: decimal('precio_venta_minorista', { precision: 12, scale: 2 }).notNull(),
  precioVentaMayorista: decimal('precio_venta_mayorista', { precision: 12, scale: 2 }),
  precioVentaEspecial: decimal('precio_venta_especial', { precision: 12, scale: 2 }),

  // Unidades
  unidadMedida: varchar('unidad_medida', { length: 50 }).default('PZA').notNull(), // PZA, KG, LT, MT, etc.

  // Control de inventario
  manejainventario: boolean('maneja_inventario').default(true).notNull(),
  stockMinimo: integer('stock_minimo').default(0).notNull(),
  stockMaximo: integer('stock_maximo'),

  // Impuestos
  aplicaIva: boolean('aplica_iva').default(true).notNull(),
  tasaIvaEspecial: decimal('tasa_iva_especial', { precision: 5, scale: 2 }),

  // Imágenes
  imagenPrincipal: text('imagen_principal'),
  imagenesAdicionales: text('imagenes_adicionales'), // JSON array de URLs

  // Características físicas
  peso: decimal('peso', { precision: 10, scale: 3 }),
  dimensiones: varchar('dimensiones', { length: 100 }), // ej: "10x20x30 cm"

  // Estado
  activo: boolean('activo').default(true).notNull(),

  // Timestamps
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})
