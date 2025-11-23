import { pgTable, uuid, varchar, text, decimal, timestamp, boolean } from 'drizzle-orm/pg-core'
import { empresas } from './empresas'
import { sucursales } from './sucursales'
import { clientes } from './clientes'
import { ventas } from './ventas'
import { usuarios } from './usuarios'

export const facturas = pgTable('facturas', {
  id: uuid('id').defaultRandom().primaryKey(),
  empresaId: uuid('empresa_id').references(() => empresas.id, { onDelete: 'cascade' }).notNull(),
  sucursalId: uuid('sucursal_id').references(() => sucursales.id, { onDelete: 'cascade' }).notNull(),

  // Relación con venta (si aplica)
  ventaId: uuid('venta_id').references(() => ventas.id),

  // Cliente (receptor)
  clienteId: uuid('cliente_id').references(() => clientes.id).notNull(),
  receptorRfc: varchar('receptor_rfc', { length: 13 }).notNull(),
  receptorNombre: varchar('receptor_nombre', { length: 300 }).notNull(),
  receptorRegimenFiscal: varchar('receptor_regimen_fiscal', { length: 10 }).notNull(),
  receptorUsoCfdi: varchar('receptor_uso_cfdi', { length: 10 }).notNull(),
  receptorCodigoPostal: varchar('receptor_codigo_postal', { length: 10 }).notNull(),

  // Folio y serie
  serie: varchar('serie', { length: 25 }),
  folio: varchar('folio', { length: 40 }).notNull(),
  folioFiscal: varchar('folio_fiscal', { length: 100 }), // UUID del SAT

  // Fechas
  fecha: timestamp('fecha').defaultNow().notNull(),
  fechaTimbrado: timestamp('fecha_timbrado'),
  fechaCancelacion: timestamp('fecha_cancelacion'),

  // Moneda y tipo de cambio
  moneda: varchar('moneda', { length: 3 }).default('MXN').notNull(),
  tipoCambio: decimal('tipo_cambio', { precision: 12, scale: 6 }).default('1'),

  // Forma y método de pago
  formaPago: varchar('forma_pago', { length: 10 }).notNull(), // 01-Efectivo, 03-Transferencia, 04-Tarjeta, etc.
  metodoPago: varchar('metodo_pago', { length: 10 }).default('PUE').notNull(), // PUE-Pago en una sola exhibición, PPD-Pago en parcialidades

  // Lugar de expedición
  lugarExpedicion: varchar('lugar_expedicion', { length: 10 }).notNull(), // Código postal

  // Totales
  subtotal: decimal('subtotal', { precision: 12, scale: 2 }).notNull(),
  descuento: decimal('descuento', { precision: 12, scale: 2 }).default('0'),
  total: decimal('total', { precision: 12, scale: 2 }).notNull(),

  // Impuestos
  totalImpuestosTrasladados: decimal('total_impuestos_trasladados', { precision: 12, scale: 2 }).default('0'),
  totalImpuestosRetenidos: decimal('total_impuestos_retenidos', { precision: 12, scale: 2 }).default('0'),

  // Estado
  estado: varchar('estado', { length: 50 }).default('borrador').notNull(), // borrador, timbrada, cancelada, pendiente_cancelacion

  // Certificado y sello digital
  certificadoSat: text('certificado_sat'),
  selloDigital: text('sello_digital'),
  selloCfdi: text('sello_cfdi'),
  cadenaOriginal: text('cadena_original'),

  // Archivos
  xmlUrl: text('xml_url'),
  pdfUrl: text('pdf_url'),

  // Observaciones y motivos
  observaciones: text('observaciones'),
  motivoCancelacion: text('motivo_cancelacion'),

  // Usuario que genera/cancela
  usuarioId: uuid('usuario_id').references(() => usuarios.id),
  canceladoPor: uuid('cancelado_por').references(() => usuarios.id),

  // Timestamps
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const detallesFactura = pgTable('detalles_factura', {
  id: uuid('id').defaultRandom().primaryKey(),
  facturaId: uuid('factura_id').references(() => facturas.id, { onDelete: 'cascade' }).notNull(),

  // Producto/Servicio
  claveProdServ: varchar('clave_prod_serv', { length: 10 }).notNull(), // Clave SAT del catálogo
  noIdentificacion: varchar('no_identificacion', { length: 100 }), // SKU o código interno
  cantidad: decimal('cantidad', { precision: 12, scale: 2 }).notNull(),
  claveUnidad: varchar('clave_unidad', { length: 10 }).notNull(), // Clave SAT de unidad
  unidad: varchar('unidad', { length: 50 }), // Descripción de la unidad
  descripcion: text('descripcion').notNull(),
  valorUnitario: decimal('valor_unitario', { precision: 12, scale: 6 }).notNull(),
  importe: decimal('importe', { precision: 12, scale: 2 }).notNull(),
  descuento: decimal('descuento', { precision: 12, scale: 2 }).default('0'),

  // Impuestos por concepto
  objetoImp: varchar('objeto_imp', { length: 10 }).default('02').notNull(), // 01-No objeto, 02-Sí objeto, 03-Sí objeto no obligado

  // Timestamps
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const impuestosFactura = pgTable('impuestos_factura', {
  id: uuid('id').defaultRandom().primaryKey(),
  detalleFacturaId: uuid('detalle_factura_id').references(() => detallesFactura.id, { onDelete: 'cascade' }).notNull(),

  // Tipo de impuesto
  tipoImpuesto: varchar('tipo_impuesto', { length: 20 }).notNull(), // traslado, retencion
  impuesto: varchar('impuesto', { length: 10 }).notNull(), // 002-IVA, 001-ISR, etc.
  tipoFactor: varchar('tipo_factor', { length: 10 }).notNull(), // Tasa, Cuota, Exento
  tasaOCuota: decimal('tasa_o_cuota', { precision: 8, scale: 6 }), // 0.160000 para IVA 16%
  base: decimal('base', { precision: 12, scale: 2 }).notNull(),
  importe: decimal('importe', { precision: 12, scale: 2 }),

  // Timestamps
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const configuracionFacturacion = pgTable('configuracion_facturacion', {
  id: uuid('id').defaultRandom().primaryKey(),
  empresaId: uuid('empresa_id').references(() => empresas.id, { onDelete: 'cascade' }).notNull().unique(),

  // Datos fiscales emisor
  rfc: varchar('rfc', { length: 13 }).notNull(),
  razonSocial: varchar('razon_social', { length: 300 }).notNull(),
  regimenFiscal: varchar('regimen_fiscal', { length: 10 }).notNull(),
  codigoPostal: varchar('codigo_postal', { length: 10 }).notNull(),

  // Certificados (CSD)
  certificadoPath: text('certificado_path'), // Path al archivo .cer
  llavePrivadaPath: text('llave_privada_path'), // Path al archivo .key
  passwordLlavePrivada: text('password_llave_privada'), // Encriptado
  certificadoVigente: boolean('certificado_vigente').default(false),
  certificadoExpira: timestamp('certificado_expira'),

  // Configuración de folios
  serieDefault: varchar('serie_default', { length: 25 }).default('A'),
  folioInicial: varchar('folio_inicial', { length: 40 }).default('1'),
  folioActual: varchar('folio_actual', { length: 40 }).default('1'),

  // Configuración de PAC (Facturama, etc.)
  pacProveedor: varchar('pac_proveedor', { length: 50 }).default('facturama'),
  pacUsuario: varchar('pac_usuario', { length: 200 }),
  pacPassword: text('pac_password'), // Encriptado
  pacApiKey: text('pac_api_key'), // Encriptado
  pacModoSandbox: boolean('pac_modo_sandbox').default(true),

  // Logotipo para PDF
  logoUrl: text('logo_url'),

  // Configuración de email
  emailEnvioAutomatico: boolean('email_envio_automatico').default(false),
  emailAsunto: varchar('email_asunto', { length: 200 }),
  emailMensaje: text('email_mensaje'),

  // Timestamps
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})
