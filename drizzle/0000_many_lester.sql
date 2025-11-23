CREATE TABLE "planes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"nombre" varchar(100) NOT NULL,
	"descripcion" text,
	"precio_mensual" numeric(10, 2),
	"precio_anual" numeric(10, 2),
	"moneda" varchar(3) DEFAULT 'MXN' NOT NULL,
	"max_sucursales" integer NOT NULL,
	"max_usuarios" integer,
	"max_productos" integer,
	"max_transacciones_mes" integer,
	"max_almacenamiento_gb" integer,
	"activo" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "empresas" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"nombre" varchar(200) NOT NULL,
	"subdominio" varchar(100) NOT NULL,
	"plan_id" uuid,
	"estado" varchar(20) DEFAULT 'prueba' NOT NULL,
	"fecha_inicio_prueba" timestamp,
	"fecha_fin_prueba" timestamp,
	"fecha_activacion" timestamp,
	"fecha_suspension" timestamp,
	"fecha_cancelacion" timestamp,
	"motivo_cancelacion" text,
	"logo_url" text,
	"color_primario" varchar(7),
	"color_secundario" varchar(7),
	"nombre_sistema" varchar(100),
	"dia_cobro" integer DEFAULT 1 NOT NULL,
	"metodo_pago" varchar(50),
	"ultimo_pago" timestamp,
	"proximo_pago" timestamp,
	"nombre_contacto" varchar(200),
	"email_contacto" varchar(200) NOT NULL,
	"telefono_contacto" varchar(20),
	"uso_sucursales" integer DEFAULT 0 NOT NULL,
	"uso_usuarios" integer DEFAULT 0 NOT NULL,
	"uso_productos" integer DEFAULT 0 NOT NULL,
	"uso_transacciones_mes" integer DEFAULT 0 NOT NULL,
	"uso_almacenamiento_mb" bigint DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "empresas_subdominio_unique" UNIQUE("subdominio")
);
--> statement-breakpoint
CREATE TABLE "usuarios" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"empresa_id" uuid NOT NULL,
	"nombre" varchar(200) NOT NULL,
	"email" varchar(200) NOT NULL,
	"telefono" varchar(20),
	"password_hash" varchar(255) NOT NULL,
	"email_verificado" boolean DEFAULT false NOT NULL,
	"token_verificacion" varchar(100),
	"token_recuperacion" varchar(100),
	"token_expiracion" timestamp,
	"activo" boolean DEFAULT true NOT NULL,
	"bloqueado" boolean DEFAULT false NOT NULL,
	"razon_bloqueo" text,
	"ultimo_login" timestamp,
	"ultimo_ip" varchar(45),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "empresas" ADD CONSTRAINT "empresas_plan_id_planes_id_fk" FOREIGN KEY ("plan_id") REFERENCES "public"."planes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "usuarios" ADD CONSTRAINT "usuarios_empresa_id_empresas_id_fk" FOREIGN KEY ("empresa_id") REFERENCES "public"."empresas"("id") ON DELETE cascade ON UPDATE no action;