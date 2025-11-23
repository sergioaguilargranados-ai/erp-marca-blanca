CREATE TABLE "clientes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"empresa_id" uuid NOT NULL,
	"nombre" varchar(300) NOT NULL,
	"email" varchar(200),
	"telefono" varchar(20),
	"direccion" text,
	"rfc" varchar(13),
	"razon_social" varchar(300),
	"regimen_fiscal" varchar(3),
	"uso_cfdi" varchar(3),
	"codigo_postal" varchar(10),
	"tipo" varchar(50) DEFAULT 'minorista' NOT NULL,
	"credito_activo" boolean DEFAULT false NOT NULL,
	"limite_credito" numeric(12, 2),
	"puntos" integer DEFAULT 0 NOT NULL,
	"notas" text,
	"activo" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "detalles_venta" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"venta_id" uuid NOT NULL,
	"producto_id" uuid NOT NULL,
	"nombre_producto" varchar(300) NOT NULL,
	"codigo_barras" varchar(50),
	"sku" varchar(100),
	"cantidad" integer NOT NULL,
	"unidad_medida" varchar(50) NOT NULL,
	"precio_unitario" numeric(12, 2) NOT NULL,
	"precio_original" numeric(12, 2) NOT NULL,
	"descuento" numeric(12, 2) DEFAULT '0' NOT NULL,
	"subtotal" numeric(12, 2) NOT NULL,
	"iva" numeric(12, 2) NOT NULL,
	"total" numeric(12, 2) NOT NULL,
	"aplica_iva" boolean DEFAULT true NOT NULL,
	"tasa_iva" numeric(5, 2) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ventas" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"empresa_id" uuid NOT NULL,
	"sucursal_id" uuid NOT NULL,
	"usuario_id" uuid NOT NULL,
	"cliente_id" uuid,
	"nombre_cliente" varchar(300),
	"folio" varchar(50) NOT NULL,
	"subtotal" numeric(12, 2) NOT NULL,
	"iva" numeric(12, 2) NOT NULL,
	"descuento" numeric(12, 2) DEFAULT '0' NOT NULL,
	"total" numeric(12, 2) NOT NULL,
	"metodo_pago" varchar(50) NOT NULL,
	"desglose_pago" text,
	"monto_pagado" numeric(12, 2),
	"cambio" numeric(12, 2),
	"turno_id" uuid,
	"caja_id" uuid,
	"factura_id" uuid,
	"requiere_factura" varchar(20) DEFAULT 'pendiente' NOT NULL,
	"estado" varchar(20) DEFAULT 'completada' NOT NULL,
	"notas" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"cancelada_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "clientes" ADD CONSTRAINT "clientes_empresa_id_empresas_id_fk" FOREIGN KEY ("empresa_id") REFERENCES "public"."empresas"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "detalles_venta" ADD CONSTRAINT "detalles_venta_venta_id_ventas_id_fk" FOREIGN KEY ("venta_id") REFERENCES "public"."ventas"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "detalles_venta" ADD CONSTRAINT "detalles_venta_producto_id_productos_id_fk" FOREIGN KEY ("producto_id") REFERENCES "public"."productos"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ventas" ADD CONSTRAINT "ventas_empresa_id_empresas_id_fk" FOREIGN KEY ("empresa_id") REFERENCES "public"."empresas"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ventas" ADD CONSTRAINT "ventas_sucursal_id_sucursales_id_fk" FOREIGN KEY ("sucursal_id") REFERENCES "public"."sucursales"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ventas" ADD CONSTRAINT "ventas_usuario_id_usuarios_id_fk" FOREIGN KEY ("usuario_id") REFERENCES "public"."usuarios"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ventas" ADD CONSTRAINT "ventas_cliente_id_clientes_id_fk" FOREIGN KEY ("cliente_id") REFERENCES "public"."clientes"("id") ON DELETE no action ON UPDATE no action;