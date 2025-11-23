import { pgTable, uuid, varchar, text, timestamp, boolean, jsonb } from 'drizzle-orm/pg-core';
import { empresas } from './empresas';

// Configuración de White Label por empresa
export const whitelabelConfig = pgTable('whitelabel_config', {
  id: uuid('id').defaultRandom().primaryKey(),
  empresaId: uuid('empresa_id').references(() => empresas.id, { onDelete: 'cascade' }).notNull().unique(),

  // Branding
  nombreSistema: varchar('nombre_sistema', { length: 200 }), // Nombre personalizado del sistema
  logoUrl: text('logo_url'), // Logo principal
  logoSmallUrl: text('logo_small_url'), // Logo pequeño
  faviconUrl: text('favicon_url'), // Favicon

  // Colores (tema personalizado)
  colorPrimario: varchar('color_primario', { length: 7 }).default('#3b82f6'), // Color principal
  colorSecundario: varchar('color_secundario', { length: 7 }).default('#10b981'), // Color secundario
  colorFondo: varchar('color_fondo', { length: 7 }).default('#ffffff'), // Color de fondo
  colorTexto: varchar('color_texto', { length: 7 }).default('#1e293b'), // Color de texto
  colorSidebar: varchar('color_sidebar', { length: 7 }), // Color del sidebar

  // Tema personalizado completo (CSS variables)
  temaCustom: jsonb('tema_custom').$type<{
    colors?: Record<string, string>;
    fonts?: {
      heading?: string;
      body?: string;
    };
    borderRadius?: string;
  }>(),

  // Dominio personalizado
  dominioCustom: varchar('dominio_custom', { length: 255 }), // ej: erp.miempresa.com
  subdominio: varchar('subdominio', { length: 100 }), // ej: miempresa (para miempresa.erp.com)
  dominioVerificado: boolean('dominio_verificado').default(false),

  // Emails personalizados
  emailRemitente: varchar('email_remitente', { length: 255 }), // From email
  nombreRemitente: varchar('nombre_remitente', { length: 200 }), // From name
  emailRespuesta: varchar('email_respuesta', { length: 255 }), // Reply-to email

  // Templates de email personalizados
  emailTemplates: jsonb('email_templates').$type<{
    welcome?: string;
    invoice?: string;
    receipt?: string;
    passwordReset?: string;
  }>(),

  // Footer personalizado
  textoFooter: text('texto_footer'),
  enlacesFooter: jsonb('enlaces_footer').$type<Array<{
    titulo: string;
    url: string;
  }>>(),

  // Redes sociales
  redesSociales: jsonb('redes_sociales').$type<{
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
    youtube?: string;
  }>(),

  // Información de contacto personalizada
  telefonoSoporte: varchar('telefono_soporte', { length: 50 }),
  emailSoporte: varchar('email_soporte', { length: 255 }),
  horarioAtencion: text('horario_atencion'),

  // Configuración de facturación personalizada
  datosFacturacion: jsonb('datos_facturacion').$type<{
    razonSocial?: string;
    rfc?: string;
    direccion?: string;
    telefono?: string;
    email?: string;
  }>(),

  // Meta tags para SEO
  metaTitle: varchar('meta_title', { length: 100 }),
  metaDescription: text('meta_description'),
  metaKeywords: text('meta_keywords'),

  // Scripts personalizados (analytics, etc)
  scriptsHeader: text('scripts_header'), // Scripts en <head>
  scriptsBody: text('scripts_body'), // Scripts antes de </body>

  // Configuración de idioma y moneda
  idiomaPredeterminado: varchar('idioma_predeterminado', { length: 10 }).default('es-MX'),
  monedaPredeterminada: varchar('moneda_predeterminada', { length: 3 }).default('MXN'),
  zonaHoraria: varchar('zona_horaria', { length: 50 }).default('America/Mexico_City'),

  // Personalización de módulos
  modulosActivos: jsonb('modulos_activos').$type<string[]>(), // Lista de módulos habilitados
  configuracionModulos: jsonb('configuracion_modulos').$type<Record<string, any>>(),

  // Estado
  activo: boolean('activo').default(true),

  // Timestamps
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Dominios personalizados (para empresas con múltiples dominios)
export const dominiosPersonalizados = pgTable('dominios_personalizados', {
  id: uuid('id').defaultRandom().primaryKey(),
  empresaId: uuid('empresa_id').references(() => empresas.id, { onDelete: 'cascade' }).notNull(),

  // Dominio
  dominio: varchar('dominio', { length: 255 }).notNull().unique(),
  tipo: varchar('tipo', { length: 20 }).notNull(), // 'principal', 'alternativo'

  // Verificación
  verificado: boolean('verificado').default(false),
  codigoVerificacion: varchar('codigo_verificacion', { length: 100 }),
  metodoVerificacion: varchar('metodo_verificacion', { length: 50 }), // 'dns', 'file'

  // SSL
  sslActivo: boolean('ssl_activo').default(false),
  sslExpiracion: timestamp('ssl_expiracion'),

  // Redirecciones
  redireccionUrl: text('redireccion_url'),

  // Estado
  activo: boolean('activo').default(true),

  // Timestamps
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Assets personalizados (imágenes, logos, etc.)
export const assetsPersonalizados = pgTable('assets_personalizados', {
  id: uuid('id').defaultRandom().primaryKey(),
  empresaId: uuid('empresa_id').references(() => empresas.id, { onDelete: 'cascade' }).notNull(),

  // Tipo de asset
  tipo: varchar('tipo', { length: 50 }).notNull(), // 'logo', 'favicon', 'banner', 'icon', etc.
  nombre: varchar('nombre', { length: 200 }).notNull(),

  // Archivo
  url: text('url').notNull(),
  urlThumbnail: text('url_thumbnail'),
  tamanoBytes: varchar('tamano_bytes', { length: 20 }),
  mimeType: varchar('mime_type', { length: 100 }),

  // Dimensiones (para imágenes)
  ancho: varchar('ancho', { length: 10 }),
  alto: varchar('alto', { length: 10 }),

  // Metadata
  descripcion: text('descripcion'),
  tags: jsonb('tags').$type<string[]>(),

  // Estado
  activo: boolean('activo').default(true),

  // Timestamps
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Tipos TypeScript
export type WhitelabelConfig = typeof whitelabelConfig.$inferSelect;
export type NuevoWhitelabelConfig = typeof whitelabelConfig.$inferInsert;
export type DominioPersonalizado = typeof dominiosPersonalizados.$inferSelect;
export type NuevoDominioPersonalizado = typeof dominiosPersonalizados.$inferInsert;
export type AssetPersonalizado = typeof assetsPersonalizados.$inferSelect;
export type NuevoAssetPersonalizado = typeof assetsPersonalizados.$inferInsert;
