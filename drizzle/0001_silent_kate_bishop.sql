CREATE TABLE "sucursales" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"empresa_id" uuid NOT NULL,
	"nombre" varchar(200) NOT NULL,
	"codigo" varchar(20),
	"direccion" text,
	"ciudad" varchar(100),
	"estado" varchar(100),
	"codigo_postal" varchar(10),
	"pais" varchar(3) DEFAULT 'MEX' NOT NULL,
	"telefono" varchar(20),
	"email" varchar(200),
	"moneda" varchar(3) DEFAULT 'MXN' NOT NULL,
	"tasa_iva" numeric(5, 2) DEFAULT '16.00' NOT NULL,
	"rfc" varchar(13),
	"razon_social" varchar(200),
	"regimen_fiscal" varchar(3),
	"activa" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "roles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"empresa_id" uuid NOT NULL,
	"nombre" varchar(100) NOT NULL,
	"descripcion" text,
	"es_predefinido" boolean DEFAULT false NOT NULL,
	"activo" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "permisos" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"rol_id" uuid NOT NULL,
	"modulo" varchar(50) NOT NULL,
	"accion" varchar(20) NOT NULL,
	"permitido" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "usuarios" ADD COLUMN "rol_id" uuid;--> statement-breakpoint
ALTER TABLE "usuarios" ADD COLUMN "sucursal_principal" uuid;--> statement-breakpoint
ALTER TABLE "sucursales" ADD CONSTRAINT "sucursales_empresa_id_empresas_id_fk" FOREIGN KEY ("empresa_id") REFERENCES "public"."empresas"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "roles" ADD CONSTRAINT "roles_empresa_id_empresas_id_fk" FOREIGN KEY ("empresa_id") REFERENCES "public"."empresas"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "permisos" ADD CONSTRAINT "permisos_rol_id_roles_id_fk" FOREIGN KEY ("rol_id") REFERENCES "public"."roles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "usuarios" ADD CONSTRAINT "usuarios_rol_id_roles_id_fk" FOREIGN KEY ("rol_id") REFERENCES "public"."roles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "usuarios" ADD CONSTRAINT "usuarios_sucursal_principal_sucursales_id_fk" FOREIGN KEY ("sucursal_principal") REFERENCES "public"."sucursales"("id") ON DELETE no action ON UPDATE no action;