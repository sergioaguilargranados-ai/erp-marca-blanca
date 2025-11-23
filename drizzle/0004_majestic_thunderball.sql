CREATE TABLE "transferencias" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"producto_id" uuid NOT NULL,
	"cantidad" integer NOT NULL,
	"sucursal_origen_id" uuid NOT NULL,
	"sucursal_destino_id" uuid NOT NULL,
	"estado" varchar(50) DEFAULT 'solicitada' NOT NULL,
	"usuario_solicitante_id" uuid,
	"usuario_aprobador_id" uuid,
	"usuario_envio_id" uuid,
	"usuario_recepcion_id" uuid,
	"motivo" text,
	"observaciones" text,
	"motivo_rechazo" text,
	"fecha_solicitud" timestamp DEFAULT now() NOT NULL,
	"fecha_aprobacion" timestamp,
	"fecha_envio" timestamp,
	"fecha_recepcion" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "cajas" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"empresa_id" uuid NOT NULL,
	"sucursal_id" uuid NOT NULL,
	"nombre" varchar(200) NOT NULL,
	"codigo" varchar(50),
	"ubicacion" varchar(200),
	"descripcion" text,
	"activa" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "turnos" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"caja_id" uuid NOT NULL,
	"usuario_id" uuid NOT NULL,
	"tipo_turno" varchar(50) NOT NULL,
	"fondo_inicial" numeric(12, 2) NOT NULL,
	"ventas_efectivo" numeric(12, 2) DEFAULT '0',
	"ventas_tarjeta" numeric(12, 2) DEFAULT '0',
	"ventas_transferencia" numeric(12, 2) DEFAULT '0',
	"total_ventas" numeric(12, 2) DEFAULT '0',
	"ingresos_adicionales" numeric(12, 2) DEFAULT '0',
	"retiros" numeric(12, 2) DEFAULT '0',
	"efectivo_contado" numeric(12, 2),
	"efectivo_esperado" numeric(12, 2),
	"diferencia" numeric(12, 2),
	"denominaciones" text,
	"estado" varchar(50) DEFAULT 'abierto' NOT NULL,
	"observaciones_apertura" text,
	"observaciones_cierre" text,
	"fecha_apertura" timestamp DEFAULT now() NOT NULL,
	"fecha_cierre" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "movimientos_caja" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"turno_id" uuid NOT NULL,
	"tipo" varchar(50) NOT NULL,
	"monto" numeric(12, 2) NOT NULL,
	"concepto" varchar(200) NOT NULL,
	"observaciones" text,
	"usuario_id" uuid,
	"requiere_autorizacion" varchar(20) DEFAULT 'no' NOT NULL,
	"autorizado_por" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "configuracion_facturacion" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"empresa_id" uuid NOT NULL,
	"rfc" varchar(13) NOT NULL,
	"razon_social" varchar(300) NOT NULL,
	"regimen_fiscal" varchar(10) NOT NULL,
	"codigo_postal" varchar(10) NOT NULL,
	"certificado_path" text,
	"llave_privada_path" text,
	"password_llave_privada" text,
	"certificado_vigente" boolean DEFAULT false,
	"certificado_expira" timestamp,
	"serie_default" varchar(25) DEFAULT 'A',
	"folio_inicial" varchar(40) DEFAULT '1',
	"folio_actual" varchar(40) DEFAULT '1',
	"pac_proveedor" varchar(50) DEFAULT 'facturama',
	"pac_usuario" varchar(200),
	"pac_password" text,
	"pac_api_key" text,
	"pac_modo_sandbox" boolean DEFAULT true,
	"logo_url" text,
	"email_envio_automatico" boolean DEFAULT false,
	"email_asunto" varchar(200),
	"email_mensaje" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "configuracion_facturacion_empresa_id_unique" UNIQUE("empresa_id")
);
--> statement-breakpoint
CREATE TABLE "detalles_factura" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"factura_id" uuid NOT NULL,
	"clave_prod_serv" varchar(10) NOT NULL,
	"no_identificacion" varchar(100),
	"cantidad" numeric(12, 2) NOT NULL,
	"clave_unidad" varchar(10) NOT NULL,
	"unidad" varchar(50),
	"descripcion" text NOT NULL,
	"valor_unitario" numeric(12, 6) NOT NULL,
	"importe" numeric(12, 2) NOT NULL,
	"descuento" numeric(12, 2) DEFAULT '0',
	"objeto_imp" varchar(10) DEFAULT '02' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "facturas" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"empresa_id" uuid NOT NULL,
	"sucursal_id" uuid NOT NULL,
	"venta_id" uuid,
	"cliente_id" uuid NOT NULL,
	"receptor_rfc" varchar(13) NOT NULL,
	"receptor_nombre" varchar(300) NOT NULL,
	"receptor_regimen_fiscal" varchar(10) NOT NULL,
	"receptor_uso_cfdi" varchar(10) NOT NULL,
	"receptor_codigo_postal" varchar(10) NOT NULL,
	"serie" varchar(25),
	"folio" varchar(40) NOT NULL,
	"folio_fiscal" varchar(100),
	"fecha" timestamp DEFAULT now() NOT NULL,
	"fecha_timbrado" timestamp,
	"fecha_cancelacion" timestamp,
	"moneda" varchar(3) DEFAULT 'MXN' NOT NULL,
	"tipo_cambio" numeric(12, 6) DEFAULT '1',
	"forma_pago" varchar(10) NOT NULL,
	"metodo_pago" varchar(10) DEFAULT 'PUE' NOT NULL,
	"lugar_expedicion" varchar(10) NOT NULL,
	"subtotal" numeric(12, 2) NOT NULL,
	"descuento" numeric(12, 2) DEFAULT '0',
	"total" numeric(12, 2) NOT NULL,
	"total_impuestos_trasladados" numeric(12, 2) DEFAULT '0',
	"total_impuestos_retenidos" numeric(12, 2) DEFAULT '0',
	"estado" varchar(50) DEFAULT 'borrador' NOT NULL,
	"certificado_sat" text,
	"sello_digital" text,
	"sello_cfdi" text,
	"cadena_original" text,
	"xml_url" text,
	"pdf_url" text,
	"observaciones" text,
	"motivo_cancelacion" text,
	"usuario_id" uuid,
	"cancelado_por" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "impuestos_factura" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"detalle_factura_id" uuid NOT NULL,
	"tipo_impuesto" varchar(20) NOT NULL,
	"impuesto" varchar(10) NOT NULL,
	"tipo_factor" varchar(10) NOT NULL,
	"tasa_o_cuota" numeric(8, 6),
	"base" numeric(12, 2) NOT NULL,
	"importe" numeric(12, 2),
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "proveedores" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"empresa_id" uuid NOT NULL,
	"nombre" varchar(200) NOT NULL,
	"nombre_comercial" varchar(200),
	"rfc" varchar(13),
	"razon_social" varchar(300),
	"regimen_fiscal" varchar(10),
	"uso_cfdi" varchar(10),
	"calle" varchar(200),
	"numero_exterior" varchar(20),
	"numero_interior" varchar(20),
	"colonia" varchar(100),
	"ciudad" varchar(100),
	"estado" varchar(100),
	"codigo_postal" varchar(10),
	"pais" varchar(100) DEFAULT 'México',
	"telefono" varchar(20),
	"email" varchar(200),
	"sitio_web" varchar(300),
	"nombre_contacto" varchar(200),
	"telefono_contacto" varchar(20),
	"email_contacto" varchar(200),
	"dias_credito" varchar(10) DEFAULT '0',
	"limite_credito" varchar(20) DEFAULT '0',
	"descuento_default" varchar(10) DEFAULT '0',
	"notas" text,
	"cuenta_bancaria" varchar(50),
	"banco" varchar(100),
	"activo" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "cuentas_por_pagar" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"empresa_id" uuid NOT NULL,
	"proveedor_id" uuid NOT NULL,
	"orden_compra_id" uuid,
	"folio_factura_proveedor" varchar(100),
	"fecha_factura" timestamp DEFAULT now() NOT NULL,
	"fecha_vencimiento" timestamp NOT NULL,
	"fecha_pago" timestamp,
	"subtotal" numeric(12, 2) NOT NULL,
	"iva" numeric(12, 2) DEFAULT '0',
	"total" numeric(12, 2) NOT NULL,
	"monto_pagado" numeric(12, 2) DEFAULT '0',
	"saldo_pendiente" numeric(12, 2) NOT NULL,
	"estado" varchar(50) DEFAULT 'pendiente' NOT NULL,
	"metodo_pago" varchar(50),
	"referencia_pago" varchar(100),
	"observaciones" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "detalles_orden_compra" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"orden_compra_id" uuid NOT NULL,
	"producto_id" uuid NOT NULL,
	"cantidad" numeric(12, 2) NOT NULL,
	"cantidad_recibida" numeric(12, 2) DEFAULT '0',
	"precio_unitario" numeric(12, 6) NOT NULL,
	"descuento" numeric(12, 2) DEFAULT '0',
	"subtotal" numeric(12, 2) NOT NULL,
	"iva" numeric(12, 2) DEFAULT '0',
	"total" numeric(12, 2) NOT NULL,
	"notas" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "detalles_recepcion" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"recepcion_id" uuid NOT NULL,
	"detalle_orden_id" uuid NOT NULL,
	"producto_id" uuid NOT NULL,
	"cantidad_esperada" numeric(12, 2) NOT NULL,
	"cantidad_recibida" numeric(12, 2) NOT NULL,
	"cantidad_diferencia" numeric(12, 2) DEFAULT '0',
	"estado_producto" varchar(50) DEFAULT 'bueno' NOT NULL,
	"notas" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ordenes_compra" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"empresa_id" uuid NOT NULL,
	"proveedor_id" uuid NOT NULL,
	"sucursal_id" uuid NOT NULL,
	"usuario_id" uuid,
	"folio" varchar(50) NOT NULL,
	"fecha_orden" timestamp DEFAULT now() NOT NULL,
	"fecha_esperada" timestamp,
	"fecha_recepcion" timestamp,
	"subtotal" numeric(12, 2) NOT NULL,
	"descuento" numeric(12, 2) DEFAULT '0',
	"iva" numeric(12, 2) DEFAULT '0',
	"total" numeric(12, 2) NOT NULL,
	"estado" varchar(50) DEFAULT 'borrador' NOT NULL,
	"observaciones" text,
	"terminos_pago" varchar(200),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "recepciones_mercancia" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"empresa_id" uuid NOT NULL,
	"orden_compra_id" uuid NOT NULL,
	"sucursal_id" uuid NOT NULL,
	"usuario_id" uuid,
	"folio" varchar(50) NOT NULL,
	"fecha_recepcion" timestamp DEFAULT now() NOT NULL,
	"tipo_recepcion" varchar(20) DEFAULT 'total' NOT NULL,
	"observaciones" text,
	"observaciones_diferencias" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "empleados" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"empresa_id" uuid NOT NULL,
	"sucursal_id" uuid,
	"nombre" varchar(200) NOT NULL,
	"apellido_paterno" varchar(100),
	"apellido_materno" varchar(100),
	"email" varchar(200),
	"telefono" varchar(20),
	"numero_empleado" varchar(50),
	"puesto" varchar(100),
	"departamento" varchar(100),
	"salario" numeric(12, 2),
	"fecha_ingreso" timestamp,
	"activo" boolean DEFAULT true NOT NULL,
	"notas" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "api_keys" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"empresa_id" uuid NOT NULL,
	"nombre" varchar(200) NOT NULL,
	"key" varchar(100) NOT NULL,
	"key_prefix" varchar(20) NOT NULL,
	"permisos" text,
	"requests_por_minuto" varchar(10) DEFAULT '60',
	"activa" boolean DEFAULT true NOT NULL,
	"ultimo_uso" timestamp,
	"total_requests" varchar(20) DEFAULT '0',
	"expira_en" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "api_keys_key_unique" UNIQUE("key")
);
--> statement-breakpoint
CREATE TABLE "auditoria" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"empresa_id" uuid NOT NULL,
	"usuario_id" uuid,
	"accion" varchar(100) NOT NULL,
	"modulo" varchar(100) NOT NULL,
	"entidad_tipo" varchar(50),
	"entidad_id" uuid,
	"datos_anteriores" text,
	"datos_nuevos" text,
	"ip" varchar(50),
	"user_agent" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "notificaciones" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"empresa_id" uuid NOT NULL,
	"usuario_id" uuid NOT NULL,
	"tipo" varchar(50) NOT NULL,
	"titulo" varchar(200) NOT NULL,
	"mensaje" text NOT NULL,
	"entidad_tipo" varchar(50),
	"entidad_id" uuid,
	"accion_url" text,
	"accion_texto" varchar(100),
	"leida" boolean DEFAULT false NOT NULL,
	"archivada" boolean DEFAULT false NOT NULL,
	"prioridad" varchar(20) DEFAULT 'normal' NOT NULL,
	"fecha_leida" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "preferencia_notificaciones" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"usuario_id" uuid NOT NULL,
	"email_enabled" boolean DEFAULT true NOT NULL,
	"push_enabled" boolean DEFAULT true NOT NULL,
	"in_app_enabled" boolean DEFAULT true NOT NULL,
	"notif_ventas" boolean DEFAULT true NOT NULL,
	"notif_inventario" boolean DEFAULT true NOT NULL,
	"notif_facturas" boolean DEFAULT true NOT NULL,
	"notif_pagos" boolean DEFAULT true NOT NULL,
	"notif_sistema" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "preferencia_notificaciones_usuario_id_unique" UNIQUE("usuario_id")
);
--> statement-breakpoint
CREATE TABLE "historial_reportes" (
	"id" text PRIMARY KEY NOT NULL,
	"reporte_id" text,
	"empresa_id" text NOT NULL,
	"tipo" varchar(50) NOT NULL,
	"parametros" jsonb,
	"estado" varchar(20) NOT NULL,
	"url_archivo" text,
	"tamano_bytes" integer,
	"tiempo_generacion_ms" integer,
	"error" text,
	"generado_por" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "metricas_cache" (
	"id" text PRIMARY KEY NOT NULL,
	"empresa_id" text NOT NULL,
	"sucursal_id" text,
	"tipo" varchar(50) NOT NULL,
	"periodo" varchar(20) NOT NULL,
	"fecha" timestamp NOT NULL,
	"metricas" jsonb NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "reportes_programados" (
	"id" text PRIMARY KEY NOT NULL,
	"empresa_id" text NOT NULL,
	"nombre" varchar(255) NOT NULL,
	"tipo" varchar(50) NOT NULL,
	"frecuencia" varchar(50) NOT NULL,
	"destinatarios" jsonb NOT NULL,
	"filtros" jsonb,
	"formato" varchar(20) DEFAULT 'pdf',
	"activo" boolean DEFAULT true,
	"ultima_ejecucion" timestamp,
	"proxima_ejecucion" timestamp,
	"creado_por" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "descuentos" (
	"id" text PRIMARY KEY NOT NULL,
	"empresa_id" text NOT NULL,
	"codigo" varchar(50) NOT NULL,
	"nombre" varchar(255) NOT NULL,
	"descripcion" text,
	"tipo" varchar(20) NOT NULL,
	"valor" numeric(10, 2) NOT NULL,
	"aplica_a" varchar(20) NOT NULL,
	"productos_ids" jsonb,
	"categorias_ids" jsonb,
	"tipo_cliente" varchar(50),
	"clientes_ids" jsonb,
	"monto_minimo" numeric(10, 2),
	"cantidad_minima" integer,
	"usos_maximos" integer,
	"usos_cliente" integer DEFAULT 1,
	"usos_actuales" integer DEFAULT 0,
	"requiere_autorizacion" boolean DEFAULT false,
	"activo" boolean DEFAULT true,
	"fecha_inicio" timestamp NOT NULL,
	"fecha_fin" timestamp,
	"creado_por" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "movimientos_puntos" (
	"id" text PRIMARY KEY NOT NULL,
	"cliente_id" text NOT NULL,
	"empresa_id" text NOT NULL,
	"tipo" varchar(20) NOT NULL,
	"puntos" integer NOT NULL,
	"saldo_anterior" integer NOT NULL,
	"saldo_nuevo" integer NOT NULL,
	"venta_id" text,
	"descripcion" text,
	"fecha_expiracion" timestamp,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "programa_lealtad" (
	"id" text PRIMARY KEY NOT NULL,
	"empresa_id" text NOT NULL,
	"nombre" varchar(255) NOT NULL,
	"descripcion" text,
	"puntos_x_peso" numeric(10, 2) DEFAULT '1.00',
	"peso_x_punto" numeric(10, 2) DEFAULT '1.00',
	"puntos_minimo_canje" integer DEFAULT 100,
	"expiracion_dias" integer,
	"activo" boolean DEFAULT true,
	"niveles" jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "puntos_clientes" (
	"id" text PRIMARY KEY NOT NULL,
	"cliente_id" text NOT NULL,
	"empresa_id" text NOT NULL,
	"puntos_disponibles" integer DEFAULT 0,
	"puntos_acumulados" integer DEFAULT 0,
	"puntos_canjeados" integer DEFAULT 0,
	"nivel_actual" varchar(50),
	"ultima_actualizacion" timestamp DEFAULT now(),
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "uso_descuentos" (
	"id" text PRIMARY KEY NOT NULL,
	"descuento_id" text NOT NULL,
	"empresa_id" text NOT NULL,
	"venta_id" text,
	"cliente_id" text,
	"monto_descuento" numeric(10, 2) NOT NULL,
	"autorizado_por" text,
	"aplicado_por" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "cuentas_por_cobrar" (
	"id" text PRIMARY KEY NOT NULL,
	"empresa_id" text NOT NULL,
	"cliente_id" text NOT NULL,
	"venta_id" text,
	"factura_id" text,
	"folio" varchar(50),
	"monto_total" numeric(12, 2) NOT NULL,
	"monto_pagado" numeric(12, 2) DEFAULT '0',
	"saldo" numeric(12, 2) NOT NULL,
	"estado" varchar(20) NOT NULL,
	"fecha_emision" timestamp NOT NULL,
	"fecha_vencimiento" timestamp NOT NULL,
	"dias_credito" integer DEFAULT 0,
	"dias_vencidos" integer DEFAULT 0,
	"descripcion" text,
	"notas" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "facturacion_servicio" (
	"id" text PRIMARY KEY NOT NULL,
	"empresa_id" text NOT NULL,
	"plan_id" text,
	"periodo" varchar(20) NOT NULL,
	"fecha_inicio" timestamp NOT NULL,
	"fecha_fin" timestamp NOT NULL,
	"subtotal" numeric(10, 2) NOT NULL,
	"iva" numeric(10, 2) NOT NULL,
	"total" numeric(10, 2) NOT NULL,
	"estado" varchar(20) NOT NULL,
	"metodo_pago" varchar(50),
	"stripe_invoice_id" varchar(255),
	"stripe_payment_intent_id" varchar(255),
	"url_factura_pdf" text,
	"url_factura_xml" text,
	"fecha_pago" timestamp,
	"fecha_vencimiento" timestamp NOT NULL,
	"intentos_cobro" integer DEFAULT 0,
	"proximo_intento" timestamp,
	"notas" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "pagos_cuentas_cobrar" (
	"id" text PRIMARY KEY NOT NULL,
	"cuenta_id" text NOT NULL,
	"empresa_id" text NOT NULL,
	"monto" numeric(10, 2) NOT NULL,
	"metodo_pago" varchar(50) NOT NULL,
	"referencia" varchar(100),
	"notas" text,
	"registrado_por" text,
	"fecha_pago" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "pagos_cuentas_pagar" (
	"id" text PRIMARY KEY NOT NULL,
	"cuenta_id" text NOT NULL,
	"empresa_id" text NOT NULL,
	"monto" numeric(10, 2) NOT NULL,
	"metodo_pago" varchar(50) NOT NULL,
	"referencia" varchar(100),
	"notas" text,
	"registrado_por" text,
	"fecha_pago" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "recordatorios_pago" (
	"id" text PRIMARY KEY NOT NULL,
	"empresa_id" text NOT NULL,
	"factura_id" text,
	"tipo" varchar(20) NOT NULL,
	"dias_antes" integer,
	"enviado" boolean DEFAULT false,
	"fecha_envio" timestamp,
	"email" varchar(255),
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "transacciones_servicio" (
	"id" text PRIMARY KEY NOT NULL,
	"factura_id" text NOT NULL,
	"empresa_id" text NOT NULL,
	"monto" numeric(10, 2) NOT NULL,
	"estado" varchar(20) NOT NULL,
	"metodo_pago" varchar(50) NOT NULL,
	"stripe_charge_id" varchar(255),
	"stripe_payment_method_id" varchar(255),
	"mensaje_error" text,
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "transferencias" ADD CONSTRAINT "transferencias_producto_id_productos_id_fk" FOREIGN KEY ("producto_id") REFERENCES "public"."productos"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transferencias" ADD CONSTRAINT "transferencias_sucursal_origen_id_sucursales_id_fk" FOREIGN KEY ("sucursal_origen_id") REFERENCES "public"."sucursales"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transferencias" ADD CONSTRAINT "transferencias_sucursal_destino_id_sucursales_id_fk" FOREIGN KEY ("sucursal_destino_id") REFERENCES "public"."sucursales"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transferencias" ADD CONSTRAINT "transferencias_usuario_solicitante_id_usuarios_id_fk" FOREIGN KEY ("usuario_solicitante_id") REFERENCES "public"."usuarios"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transferencias" ADD CONSTRAINT "transferencias_usuario_aprobador_id_usuarios_id_fk" FOREIGN KEY ("usuario_aprobador_id") REFERENCES "public"."usuarios"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transferencias" ADD CONSTRAINT "transferencias_usuario_envio_id_usuarios_id_fk" FOREIGN KEY ("usuario_envio_id") REFERENCES "public"."usuarios"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transferencias" ADD CONSTRAINT "transferencias_usuario_recepcion_id_usuarios_id_fk" FOREIGN KEY ("usuario_recepcion_id") REFERENCES "public"."usuarios"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cajas" ADD CONSTRAINT "cajas_empresa_id_empresas_id_fk" FOREIGN KEY ("empresa_id") REFERENCES "public"."empresas"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cajas" ADD CONSTRAINT "cajas_sucursal_id_sucursales_id_fk" FOREIGN KEY ("sucursal_id") REFERENCES "public"."sucursales"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "turnos" ADD CONSTRAINT "turnos_caja_id_cajas_id_fk" FOREIGN KEY ("caja_id") REFERENCES "public"."cajas"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "turnos" ADD CONSTRAINT "turnos_usuario_id_usuarios_id_fk" FOREIGN KEY ("usuario_id") REFERENCES "public"."usuarios"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "movimientos_caja" ADD CONSTRAINT "movimientos_caja_turno_id_turnos_id_fk" FOREIGN KEY ("turno_id") REFERENCES "public"."turnos"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "movimientos_caja" ADD CONSTRAINT "movimientos_caja_usuario_id_usuarios_id_fk" FOREIGN KEY ("usuario_id") REFERENCES "public"."usuarios"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "movimientos_caja" ADD CONSTRAINT "movimientos_caja_autorizado_por_usuarios_id_fk" FOREIGN KEY ("autorizado_por") REFERENCES "public"."usuarios"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "configuracion_facturacion" ADD CONSTRAINT "configuracion_facturacion_empresa_id_empresas_id_fk" FOREIGN KEY ("empresa_id") REFERENCES "public"."empresas"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "detalles_factura" ADD CONSTRAINT "detalles_factura_factura_id_facturas_id_fk" FOREIGN KEY ("factura_id") REFERENCES "public"."facturas"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "facturas" ADD CONSTRAINT "facturas_empresa_id_empresas_id_fk" FOREIGN KEY ("empresa_id") REFERENCES "public"."empresas"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "facturas" ADD CONSTRAINT "facturas_sucursal_id_sucursales_id_fk" FOREIGN KEY ("sucursal_id") REFERENCES "public"."sucursales"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "facturas" ADD CONSTRAINT "facturas_venta_id_ventas_id_fk" FOREIGN KEY ("venta_id") REFERENCES "public"."ventas"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "facturas" ADD CONSTRAINT "facturas_cliente_id_clientes_id_fk" FOREIGN KEY ("cliente_id") REFERENCES "public"."clientes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "facturas" ADD CONSTRAINT "facturas_usuario_id_usuarios_id_fk" FOREIGN KEY ("usuario_id") REFERENCES "public"."usuarios"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "facturas" ADD CONSTRAINT "facturas_cancelado_por_usuarios_id_fk" FOREIGN KEY ("cancelado_por") REFERENCES "public"."usuarios"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "impuestos_factura" ADD CONSTRAINT "impuestos_factura_detalle_factura_id_detalles_factura_id_fk" FOREIGN KEY ("detalle_factura_id") REFERENCES "public"."detalles_factura"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "proveedores" ADD CONSTRAINT "proveedores_empresa_id_empresas_id_fk" FOREIGN KEY ("empresa_id") REFERENCES "public"."empresas"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cuentas_por_pagar" ADD CONSTRAINT "cuentas_por_pagar_empresa_id_empresas_id_fk" FOREIGN KEY ("empresa_id") REFERENCES "public"."empresas"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cuentas_por_pagar" ADD CONSTRAINT "cuentas_por_pagar_proveedor_id_proveedores_id_fk" FOREIGN KEY ("proveedor_id") REFERENCES "public"."proveedores"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cuentas_por_pagar" ADD CONSTRAINT "cuentas_por_pagar_orden_compra_id_ordenes_compra_id_fk" FOREIGN KEY ("orden_compra_id") REFERENCES "public"."ordenes_compra"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "detalles_orden_compra" ADD CONSTRAINT "detalles_orden_compra_orden_compra_id_ordenes_compra_id_fk" FOREIGN KEY ("orden_compra_id") REFERENCES "public"."ordenes_compra"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "detalles_orden_compra" ADD CONSTRAINT "detalles_orden_compra_producto_id_productos_id_fk" FOREIGN KEY ("producto_id") REFERENCES "public"."productos"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "detalles_recepcion" ADD CONSTRAINT "detalles_recepcion_recepcion_id_recepciones_mercancia_id_fk" FOREIGN KEY ("recepcion_id") REFERENCES "public"."recepciones_mercancia"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "detalles_recepcion" ADD CONSTRAINT "detalles_recepcion_detalle_orden_id_detalles_orden_compra_id_fk" FOREIGN KEY ("detalle_orden_id") REFERENCES "public"."detalles_orden_compra"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "detalles_recepcion" ADD CONSTRAINT "detalles_recepcion_producto_id_productos_id_fk" FOREIGN KEY ("producto_id") REFERENCES "public"."productos"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ordenes_compra" ADD CONSTRAINT "ordenes_compra_empresa_id_empresas_id_fk" FOREIGN KEY ("empresa_id") REFERENCES "public"."empresas"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ordenes_compra" ADD CONSTRAINT "ordenes_compra_proveedor_id_proveedores_id_fk" FOREIGN KEY ("proveedor_id") REFERENCES "public"."proveedores"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ordenes_compra" ADD CONSTRAINT "ordenes_compra_sucursal_id_sucursales_id_fk" FOREIGN KEY ("sucursal_id") REFERENCES "public"."sucursales"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ordenes_compra" ADD CONSTRAINT "ordenes_compra_usuario_id_usuarios_id_fk" FOREIGN KEY ("usuario_id") REFERENCES "public"."usuarios"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recepciones_mercancia" ADD CONSTRAINT "recepciones_mercancia_empresa_id_empresas_id_fk" FOREIGN KEY ("empresa_id") REFERENCES "public"."empresas"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recepciones_mercancia" ADD CONSTRAINT "recepciones_mercancia_orden_compra_id_ordenes_compra_id_fk" FOREIGN KEY ("orden_compra_id") REFERENCES "public"."ordenes_compra"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recepciones_mercancia" ADD CONSTRAINT "recepciones_mercancia_sucursal_id_sucursales_id_fk" FOREIGN KEY ("sucursal_id") REFERENCES "public"."sucursales"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recepciones_mercancia" ADD CONSTRAINT "recepciones_mercancia_usuario_id_usuarios_id_fk" FOREIGN KEY ("usuario_id") REFERENCES "public"."usuarios"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "empleados" ADD CONSTRAINT "empleados_empresa_id_empresas_id_fk" FOREIGN KEY ("empresa_id") REFERENCES "public"."empresas"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "empleados" ADD CONSTRAINT "empleados_sucursal_id_sucursales_id_fk" FOREIGN KEY ("sucursal_id") REFERENCES "public"."sucursales"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "api_keys" ADD CONSTRAINT "api_keys_empresa_id_empresas_id_fk" FOREIGN KEY ("empresa_id") REFERENCES "public"."empresas"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "auditoria" ADD CONSTRAINT "auditoria_empresa_id_empresas_id_fk" FOREIGN KEY ("empresa_id") REFERENCES "public"."empresas"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "auditoria" ADD CONSTRAINT "auditoria_usuario_id_usuarios_id_fk" FOREIGN KEY ("usuario_id") REFERENCES "public"."usuarios"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notificaciones" ADD CONSTRAINT "notificaciones_empresa_id_empresas_id_fk" FOREIGN KEY ("empresa_id") REFERENCES "public"."empresas"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notificaciones" ADD CONSTRAINT "notificaciones_usuario_id_usuarios_id_fk" FOREIGN KEY ("usuario_id") REFERENCES "public"."usuarios"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "preferencia_notificaciones" ADD CONSTRAINT "preferencia_notificaciones_usuario_id_usuarios_id_fk" FOREIGN KEY ("usuario_id") REFERENCES "public"."usuarios"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "historial_reportes" ADD CONSTRAINT "historial_reportes_reporte_id_reportes_programados_id_fk" FOREIGN KEY ("reporte_id") REFERENCES "public"."reportes_programados"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "historial_reportes" ADD CONSTRAINT "historial_reportes_empresa_id_empresas_id_fk" FOREIGN KEY ("empresa_id") REFERENCES "public"."empresas"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "historial_reportes" ADD CONSTRAINT "historial_reportes_generado_por_usuarios_id_fk" FOREIGN KEY ("generado_por") REFERENCES "public"."usuarios"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "metricas_cache" ADD CONSTRAINT "metricas_cache_empresa_id_empresas_id_fk" FOREIGN KEY ("empresa_id") REFERENCES "public"."empresas"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reportes_programados" ADD CONSTRAINT "reportes_programados_empresa_id_empresas_id_fk" FOREIGN KEY ("empresa_id") REFERENCES "public"."empresas"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reportes_programados" ADD CONSTRAINT "reportes_programados_creado_por_usuarios_id_fk" FOREIGN KEY ("creado_por") REFERENCES "public"."usuarios"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "descuentos" ADD CONSTRAINT "descuentos_empresa_id_empresas_id_fk" FOREIGN KEY ("empresa_id") REFERENCES "public"."empresas"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "descuentos" ADD CONSTRAINT "descuentos_creado_por_usuarios_id_fk" FOREIGN KEY ("creado_por") REFERENCES "public"."usuarios"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "movimientos_puntos" ADD CONSTRAINT "movimientos_puntos_cliente_id_clientes_id_fk" FOREIGN KEY ("cliente_id") REFERENCES "public"."clientes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "movimientos_puntos" ADD CONSTRAINT "movimientos_puntos_empresa_id_empresas_id_fk" FOREIGN KEY ("empresa_id") REFERENCES "public"."empresas"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "programa_lealtad" ADD CONSTRAINT "programa_lealtad_empresa_id_empresas_id_fk" FOREIGN KEY ("empresa_id") REFERENCES "public"."empresas"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "puntos_clientes" ADD CONSTRAINT "puntos_clientes_cliente_id_clientes_id_fk" FOREIGN KEY ("cliente_id") REFERENCES "public"."clientes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "puntos_clientes" ADD CONSTRAINT "puntos_clientes_empresa_id_empresas_id_fk" FOREIGN KEY ("empresa_id") REFERENCES "public"."empresas"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "uso_descuentos" ADD CONSTRAINT "uso_descuentos_descuento_id_descuentos_id_fk" FOREIGN KEY ("descuento_id") REFERENCES "public"."descuentos"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "uso_descuentos" ADD CONSTRAINT "uso_descuentos_empresa_id_empresas_id_fk" FOREIGN KEY ("empresa_id") REFERENCES "public"."empresas"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "uso_descuentos" ADD CONSTRAINT "uso_descuentos_cliente_id_clientes_id_fk" FOREIGN KEY ("cliente_id") REFERENCES "public"."clientes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "uso_descuentos" ADD CONSTRAINT "uso_descuentos_autorizado_por_usuarios_id_fk" FOREIGN KEY ("autorizado_por") REFERENCES "public"."usuarios"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "uso_descuentos" ADD CONSTRAINT "uso_descuentos_aplicado_por_usuarios_id_fk" FOREIGN KEY ("aplicado_por") REFERENCES "public"."usuarios"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cuentas_por_cobrar" ADD CONSTRAINT "cuentas_por_cobrar_empresa_id_empresas_id_fk" FOREIGN KEY ("empresa_id") REFERENCES "public"."empresas"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cuentas_por_cobrar" ADD CONSTRAINT "cuentas_por_cobrar_cliente_id_clientes_id_fk" FOREIGN KEY ("cliente_id") REFERENCES "public"."clientes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "facturacion_servicio" ADD CONSTRAINT "facturacion_servicio_empresa_id_empresas_id_fk" FOREIGN KEY ("empresa_id") REFERENCES "public"."empresas"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pagos_cuentas_cobrar" ADD CONSTRAINT "pagos_cuentas_cobrar_cuenta_id_cuentas_por_cobrar_id_fk" FOREIGN KEY ("cuenta_id") REFERENCES "public"."cuentas_por_cobrar"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pagos_cuentas_cobrar" ADD CONSTRAINT "pagos_cuentas_cobrar_empresa_id_empresas_id_fk" FOREIGN KEY ("empresa_id") REFERENCES "public"."empresas"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pagos_cuentas_cobrar" ADD CONSTRAINT "pagos_cuentas_cobrar_registrado_por_usuarios_id_fk" FOREIGN KEY ("registrado_por") REFERENCES "public"."usuarios"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pagos_cuentas_pagar" ADD CONSTRAINT "pagos_cuentas_pagar_cuenta_id_cuentas_por_pagar_id_fk" FOREIGN KEY ("cuenta_id") REFERENCES "public"."cuentas_por_pagar"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pagos_cuentas_pagar" ADD CONSTRAINT "pagos_cuentas_pagar_empresa_id_empresas_id_fk" FOREIGN KEY ("empresa_id") REFERENCES "public"."empresas"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pagos_cuentas_pagar" ADD CONSTRAINT "pagos_cuentas_pagar_registrado_por_usuarios_id_fk" FOREIGN KEY ("registrado_por") REFERENCES "public"."usuarios"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recordatorios_pago" ADD CONSTRAINT "recordatorios_pago_empresa_id_empresas_id_fk" FOREIGN KEY ("empresa_id") REFERENCES "public"."empresas"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recordatorios_pago" ADD CONSTRAINT "recordatorios_pago_factura_id_facturacion_servicio_id_fk" FOREIGN KEY ("factura_id") REFERENCES "public"."facturacion_servicio"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transacciones_servicio" ADD CONSTRAINT "transacciones_servicio_factura_id_facturacion_servicio_id_fk" FOREIGN KEY ("factura_id") REFERENCES "public"."facturacion_servicio"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transacciones_servicio" ADD CONSTRAINT "transacciones_servicio_empresa_id_empresas_id_fk" FOREIGN KEY ("empresa_id") REFERENCES "public"."empresas"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "historial_reportes_empresa_idx" ON "historial_reportes" USING btree ("empresa_id");--> statement-breakpoint
CREATE INDEX "historial_reportes_fecha_idx" ON "historial_reportes" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "metricas_cache_empresa_fecha_idx" ON "metricas_cache" USING btree ("empresa_id","fecha");--> statement-breakpoint
CREATE INDEX "metricas_cache_tipo_idx" ON "metricas_cache" USING btree ("tipo");--> statement-breakpoint
CREATE INDEX "reportes_programados_empresa_idx" ON "reportes_programados" USING btree ("empresa_id");--> statement-breakpoint
CREATE INDEX "reportes_programados_tipo_idx" ON "reportes_programados" USING btree ("tipo");--> statement-breakpoint
CREATE INDEX "descuentos_empresa_idx" ON "descuentos" USING btree ("empresa_id");--> statement-breakpoint
CREATE INDEX "descuentos_codigo_idx" ON "descuentos" USING btree ("codigo");--> statement-breakpoint
CREATE INDEX "descuentos_activo_idx" ON "descuentos" USING btree ("activo");--> statement-breakpoint
CREATE INDEX "descuentos_fechas_idx" ON "descuentos" USING btree ("fecha_inicio","fecha_fin");--> statement-breakpoint
CREATE INDEX "movimientos_puntos_cliente_idx" ON "movimientos_puntos" USING btree ("cliente_id");--> statement-breakpoint
CREATE INDEX "movimientos_puntos_fecha_idx" ON "movimientos_puntos" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "programa_lealtad_empresa_idx" ON "programa_lealtad" USING btree ("empresa_id");--> statement-breakpoint
CREATE INDEX "puntos_clientes_cliente_idx" ON "puntos_clientes" USING btree ("cliente_id");--> statement-breakpoint
CREATE INDEX "puntos_clientes_empresa_idx" ON "puntos_clientes" USING btree ("empresa_id");--> statement-breakpoint
CREATE INDEX "uso_descuentos_descuento_idx" ON "uso_descuentos" USING btree ("descuento_id");--> statement-breakpoint
CREATE INDEX "uso_descuentos_empresa_idx" ON "uso_descuentos" USING btree ("empresa_id");--> statement-breakpoint
CREATE INDEX "uso_descuentos_cliente_idx" ON "uso_descuentos" USING btree ("cliente_id");--> statement-breakpoint
CREATE INDEX "cuentas_cobrar_empresa_idx" ON "cuentas_por_cobrar" USING btree ("empresa_id");--> statement-breakpoint
CREATE INDEX "cuentas_cobrar_cliente_idx" ON "cuentas_por_cobrar" USING btree ("cliente_id");--> statement-breakpoint
CREATE INDEX "cuentas_cobrar_estado_idx" ON "cuentas_por_cobrar" USING btree ("estado");--> statement-breakpoint
CREATE INDEX "cuentas_cobrar_vencimiento_idx" ON "cuentas_por_cobrar" USING btree ("fecha_vencimiento");--> statement-breakpoint
CREATE INDEX "facturacion_servicio_empresa_idx" ON "facturacion_servicio" USING btree ("empresa_id");--> statement-breakpoint
CREATE INDEX "facturacion_servicio_estado_idx" ON "facturacion_servicio" USING btree ("estado");--> statement-breakpoint
CREATE INDEX "facturacion_servicio_vencimiento_idx" ON "facturacion_servicio" USING btree ("fecha_vencimiento");--> statement-breakpoint
CREATE INDEX "pagos_cuentas_cobrar_cuenta_idx" ON "pagos_cuentas_cobrar" USING btree ("cuenta_id");--> statement-breakpoint
CREATE INDEX "pagos_cuentas_cobrar_fecha_idx" ON "pagos_cuentas_cobrar" USING btree ("fecha_pago");--> statement-breakpoint
CREATE INDEX "pagos_cuentas_pagar_cuenta_idx" ON "pagos_cuentas_pagar" USING btree ("cuenta_id");--> statement-breakpoint
CREATE INDEX "pagos_cuentas_pagar_fecha_idx" ON "pagos_cuentas_pagar" USING btree ("fecha_pago");--> statement-breakpoint
CREATE INDEX "recordatorios_pago_empresa_idx" ON "recordatorios_pago" USING btree ("empresa_id");--> statement-breakpoint
CREATE INDEX "recordatorios_pago_enviado_idx" ON "recordatorios_pago" USING btree ("enviado");--> statement-breakpoint
CREATE INDEX "transacciones_servicio_factura_idx" ON "transacciones_servicio" USING btree ("factura_id");--> statement-breakpoint
CREATE INDEX "transacciones_servicio_estado_idx" ON "transacciones_servicio" USING btree ("estado");