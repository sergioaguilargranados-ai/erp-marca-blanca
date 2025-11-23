# 🚀 Guía de Deploy a Producción - ERP Marca Blanca

## ✅ Pre-requisitos Completados

- [x] Código en GitHub: https://github.com/sergioaguilargranados-ai/erp-marca-blanca
- [x] Base de datos Neon configurada
- [x] 47 versiones del proyecto creadas

## 🎯 Deploy a Netlify (15 minutos)

### Paso 1: Configurar Netlify (5 min)

1. Ir a https://app.netlify.com
2. Click "Add new site" → "Import an existing project"
3. Conectar con GitHub
4. Seleccionar: `sergioaguilargranados-ai/erp-marca-blanca`

### Paso 2: Build Settings

```
Build command: bun run build
Publish directory: .next
Functions directory: netlify/functions
```

### Paso 3: Variables de Entorno (IMPORTANTE)

En **Site settings** → **Environment variables**:

```env
DATABASE_URL=postgresql://neondb_owner:npg_QgZmnHAIUf67@ep-green-sky-afxrsbva-pooler.c-2.us-west-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require

NEXTAUTH_SECRET=genera_con_openssl_rand_base64_32

NEXTAUTH_URL=https://tu-sitio.netlify.app

FACTURAMA_API_URL=https://apisandbox.facturama.mx
FACTURAMA_USERNAME=pruebas
FACTURAMA_PASSWORD=pruebas2011
```

### Paso 4: Generar NEXTAUTH_SECRET

```bash
openssl rand -base64 32
```

### Paso 5: Deploy

1. Click "Deploy site"
2. Esperar 3-5 minutos
3. Copiar la URL asignada
4. Actualizar `NEXTAUTH_URL` con la URL real
5. Redeploy

## 🗄️ Configurar Base de Datos (5 min)

Desde tu terminal local:

```bash
cd erp-marca-blanca

# Aplicar migraciones
bunx drizzle-kit push

# Crear datos demo
bun run db:seed
```

## ✅ Verificación (3 min)

1. Abrir la URL del deploy
2. Ir a `/auth/login`
3. Login: `admin@demo.com` / `demo123`
4. Verificar que carga el dashboard

## 🎉 ¡Listo!

Tu ERP está en producción en:
- https://tu-sitio.netlify.app

---

**Tiempo total:** 20-30 minutos
**Costo:** $0 (Free tier)
