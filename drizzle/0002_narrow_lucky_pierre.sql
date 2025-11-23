CREATE TABLE "categorias_productos" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"empresa_id" uuid NOT NULL,
	"nombre" varchar(200) NOT NULL,
	"descripcion" text,
	"codigo" varchar(50),
	"categoria_padre" uuid,
	"activa" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "productos" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"empresa_id" uuid NOT NULL,
	"nombre" varchar(300) NOT NULL,
	"descripcion" text,
	"sku" varchar(100),
	"codigo_barras" varchar(50),
	"categoria_id" uuid,
	"precio_compra" numeric(12, 2),
	"precio_venta_minorista" numeric(12, 2) NOT NULL,
	"precio_venta_mayorista" numeric(12, 2),
	"precio_venta_especial" numeric(12, 2),
	"unidad_medida" varchar(50) DEFAULT 'PZA' NOT NULL,
	"maneja_inventario" boolean DEFAULT true NOT NULL,
	"stock_minimo" integer DEFAULT 0 NOT NULL,
	"stock_maximo" integer,
	"aplica_iva" boolean DEFAULT true NOT NULL,
	"tasa_iva_especial" numeric(5, 2),
	"imagen_principal" text,
	"imagenes_adicionales" text,
	"peso" numeric(10, 3),
	"dimensiones" varchar(100),
	"activo" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "productos_codigo_barras_unique" UNIQUE("codigo_barras")
);
--> statement-breakpoint
CREATE TABLE "inventario" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"producto_id" uuid NOT NULL,
	"sucursal_id" uuid NOT NULL,
	"cantidad" integer DEFAULT 0 NOT NULL,
	"cantidad_reservada" integer DEFAULT 0 NOT NULL,
	"cantidad_disponible" integer DEFAULT 0 NOT NULL,
	"costo_promedio" numeric(12, 2),
	"ubicacion" varchar(100),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "movimientos_inventario" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"producto_id" uuid NOT NULL,
	"sucursal_id" uuid NOT NULL,
	"tipo" varchar(50) NOT NULL,
	"cantidad" integer NOT NULL,
	"cantidad_anterior" integer NOT NULL,
	"cantidad_nueva" integer NOT NULL,
	"costo_unitario" numeric(12, 2),
	"costo_total" numeric(12, 2),
	"sucursal_origen_id" uuid,
	"sucursal_destino_id" uuid,
	"documento_tipo" varchar(50),
	"documento_id" uuid,
	"observaciones" text,
	"usuario_id" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "categorias_productos" ADD CONSTRAINT "categorias_productos_empresa_id_empresas_id_fk" FOREIGN KEY ("empresa_id") REFERENCES "public"."empresas"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "categorias_productos" ADD CONSTRAINT "categorias_productos_categoria_padre_categorias_productos_id_fk" FOREIGN KEY ("categoria_padre") REFERENCES "public"."categorias_productos"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "productos" ADD CONSTRAINT "productos_empresa_id_empresas_id_fk" FOREIGN KEY ("empresa_id") REFERENCES "public"."empresas"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "productos" ADD CONSTRAINT "productos_categoria_id_categorias_productos_id_fk" FOREIGN KEY ("categoria_id") REFERENCES "public"."categorias_productos"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inventario" ADD CONSTRAINT "inventario_producto_id_productos_id_fk" FOREIGN KEY ("producto_id") REFERENCES "public"."productos"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inventario" ADD CONSTRAINT "inventario_sucursal_id_sucursales_id_fk" FOREIGN KEY ("sucursal_id") REFERENCES "public"."sucursales"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "movimientos_inventario" ADD CONSTRAINT "movimientos_inventario_producto_id_productos_id_fk" FOREIGN KEY ("producto_id") REFERENCES "public"."productos"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "movimientos_inventario" ADD CONSTRAINT "movimientos_inventario_sucursal_id_sucursales_id_fk" FOREIGN KEY ("sucursal_id") REFERENCES "public"."sucursales"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "movimientos_inventario" ADD CONSTRAINT "movimientos_inventario_sucursal_origen_id_sucursales_id_fk" FOREIGN KEY ("sucursal_origen_id") REFERENCES "public"."sucursales"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "movimientos_inventario" ADD CONSTRAINT "movimientos_inventario_sucursal_destino_id_sucursales_id_fk" FOREIGN KEY ("sucursal_destino_id") REFERENCES "public"."sucursales"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "movimientos_inventario" ADD CONSTRAINT "movimientos_inventario_usuario_id_usuarios_id_fk" FOREIGN KEY ("usuario_id") REFERENCES "public"."usuarios"("id") ON DELETE no action ON UPDATE no action;