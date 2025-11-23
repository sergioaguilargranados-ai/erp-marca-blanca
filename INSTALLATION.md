# 📚 Guía de Instalación - ERP Marca Blanca

Esta guía te llevará paso a paso para instalar y configurar el sistema ERP Marca Blanca en tu entorno local o en producción.

## Tabla de Contenidos

1. [Requisitos del Sistema](#requisitos-del-sistema)
2. [Instalación Local](#instalación-local)
3. [Configuración de Base de Datos](#configuración-de-base-de-datos)
4. [Variables de Entorno](#variables-de-entorno)
5. [Primer Usuario](#primer-usuario)
6. [Configuración de Facturación](#configuración-de-facturación)
7. [Despliegue en Producción](#despliegue-en-producción)
8. [Solución de Problemas](#solución-de-problemas)

## Requisitos del Sistema

### Requerimientos Mínimos

- **Node.js** 18.17.0 o superior (o **Bun** 1.0+)
- **PostgreSQL** 14+ o cuenta en Neon Database
- **Git** 2.30+
- **RAM** 4GB mínimo (8GB recomendado)
- **Disco** 2GB libres para node_modules y build

### Herramientas Opcionales

- **Docker** para contenedorización
- **VS Code** con extensiones TypeScript y ESLint
- **Postman** o **Thunder Client** para pruebas de API

## Instalación Local

### 1. Clonar el Repositorio

```bash
# HTTPS
git clone https://github.com/tu-usuario/erp-marca-blanca.git

# SSH
git clone git@github.com:tu-usuario/erp-marca-blanca.git

# Entrar al directorio
cd erp-marca-blanca
```

### 2. Instalar Dependencias

#### Opción A: Con Bun (Recomendado - Más Rápido)

```bash
# Instalar Bun si no lo tienes
curl -fsSL https://bun.sh/install | bash

# Instalar dependencias
bun install
```

#### Opción B: Con npm

```bash
npm install
```

#### Opción C: Con pnpm

```bash
pnpm install
```

### 3. Verificar Instalación

```bash
# Con Bun
bun run --version

# Con npm
npm run --version
```

## Configuración de Base de Datos

### Opción A: PostgreSQL Local

#### 1. Instalar PostgreSQL

**macOS (con Homebrew):**
```bash
brew install postgresql@14
brew services start postgresql@14
```

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

**Windows:**
- Descargar instalador desde [postgresql.org](https://www.postgresql.org/download/windows/)

#### 2. Crear Base de Datos

```bash
# Conectar a PostgreSQL
psql -U postgres

# Crear database
CREATE DATABASE erp_marca_blanca;

# Crear usuario (opcional)
CREATE USER erp_user WITH ENCRYPTED PASSWORD 'tu_password_segura';
GRANT ALL PRIVILEGES ON DATABASE erp_marca_blanca TO erp_user;

# Salir
\q
```

#### 3. Obtener Connection String

```
postgresql://erp_user:tu_password_segura@localhost:5432/erp_marca_blanca
```

### Opción B: Neon Database (Cloud - Recomendado)

1. Ir a [neon.tech](https://neon.tech)
2. Crear cuenta gratuita
3. Crear nuevo proyecto
4. Copiar connection string
5. Usar connection string en `.env`

```
postgresql://user:password@ep-xyz.region.aws.neon.tech/neondb?sslmode=require
```

## Variables de Entorno

### 1. Crear Archivo .env

```bash
# En la raíz del proyecto
touch .env
```

### 2. Configurar Variables

```env
# ==========================================
# DATABASE
# ==========================================
DATABASE_URL="postgresql://user:password@host:5432/database"

# ==========================================
# NEXTAUTH
# ==========================================
# Generar con: openssl rand -base64 32
NEXTAUTH_SECRET="tu-secret-key-muy-segura-aqui"
NEXTAUTH_URL="http://localhost:3000"

# ==========================================
# FACTURAMA (OPCIONAL)
# ==========================================
# Para Sandbox (pruebas)
FACTURAMA_API_URL="https://apisandbox.facturama.mx"
FACTURAMA_USER="tu-usuario-pruebas"
FACTURAMA_PASSWORD="tu-password-pruebas"

# Para Producción
# FACTURAMA_API_URL="https://api.facturama.mx"
# FACTURAMA_USER="tu-usuario-real"
# FACTURAMA_PASSWORD="tu-password-real"

# ==========================================
# OPCIONAL: EMAILS
# ==========================================
# SMTP_HOST="smtp.gmail.com"
# SMTP_PORT="587"
# SMTP_USER="tu-email@gmail.com"
# SMTP_PASSWORD="tu-app-password"

# ==========================================
# OPCIONAL: STORAGE
# ==========================================
# AWS_ACCESS_KEY_ID="..."
# AWS_SECRET_ACCESS_KEY="..."
# AWS_REGION="us-east-1"
# AWS_BUCKET="erp-documentos"
```

### 3. Generar NEXTAUTH_SECRET

```bash
# En terminal
openssl rand -base64 32

# O usar generador online
# https://generate-secret.vercel.app/32
```

## Configuración de la Base de Datos

### 1. Aplicar Schema

```bash
# Con Bun
bun run db:push

# Con npm
npm run db:push
```

### 2. Verificar Tablas

```bash
# Abrir Drizzle Studio
bun run db:studio

# O conectar con psql
psql $DATABASE_URL
\dt
```

Deberías ver tablas como:
- `empresas`
- `usuarios`
- `productos`
- `ventas`
- `facturas`
- `proveedores`
- `empleados`
- etc.

## Primer Usuario

### Opción A: Desde la Aplicación

1. Iniciar servidor de desarrollo:
```bash
bun run dev
```

2. Abrir navegador en `http://localhost:3000`

3. Ir a `/admin/setup` (si está habilitado)

4. Crear primer super admin

### Opción B: Manualmente en Base de Datos

```sql
-- Conectar a la base de datos
psql $DATABASE_URL

-- Insertar usuario super admin
INSERT INTO usuarios (
  id,
  email,
  nombre,
  password,
  es_super_admin,
  email_verificado,
  activo,
  created_at
) VALUES (
  gen_random_uuid(),
  'admin@tudominio.com',
  'Super Admin',
  '$2a$10$ejemplo_hash_bcrypt', -- Generar con bcrypt
  true,
  true,
  true,
  NOW()
);
```

Para generar el hash de password:

```javascript
// En Node.js o Bun REPL
const bcrypt = require('bcryptjs');
const hash = bcrypt.hashSync('tu_password', 10);
console.log(hash);
```

## Configuración de Facturación

### 1. Obtener Certificados SAT

1. Ingresar al portal del SAT
2. Descargar certificados (.cer y .key)
3. Guardar en lugar seguro

### 2. Cuenta en Facturama

#### Modo Sandbox (Pruebas)

1. Ir a [Facturama](https://www.facturama.mx/)
2. Crear cuenta de pruebas
3. Obtener credenciales de API

#### Modo Producción

1. Contratar plan en Facturama
2. Configurar certificados SAT
3. Obtener credenciales de producción

### 3. Configurar en el Sistema

1. Iniciar sesión como super admin
2. Ir a **Empresas** > Seleccionar empresa
3. Ir a **Facturación** > **Configuración**
4. Subir certificados (.cer y .key)
5. Ingresar credenciales de Facturama
6. Guardar configuración

## Iniciar en Desarrollo

```bash
# Con Bun
bun run dev

# Con npm
npm run dev
```

La aplicación estará disponible en:
- **Frontend:** http://localhost:3000
- **Admin Panel:** http://localhost:3000/admin

## Despliegue en Producción

### Opción 1: Netlify

#### 1. Conectar Repositorio

1. Ir a [netlify.com](https://netlify.com)
2. **New site from Git**
3. Conectar repositorio

#### 2. Configurar Build

```
Build command: bun run build
Publish directory: .next
```

#### 3. Variables de Entorno

Agregar en **Site settings** > **Environment variables**:
- `DATABASE_URL`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL` (URL de producción)
- `FACTURAMA_API_URL`
- `FACTURAMA_USER`
- `FACTURAMA_PASSWORD`

#### 4. Deploy

Click en **Deploy site**

### Opción 2: Vercel

```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel

# Deploy a producción
vercel --prod
```

### Opción 3: Docker

```bash
# Build imagen
docker build -t erp-marca-blanca .

# Run container
docker run -p 3000:3000 \
  -e DATABASE_URL="..." \
  -e NEXTAUTH_SECRET="..." \
  -e NEXTAUTH_URL="https://tudominio.com" \
  erp-marca-blanca
```

### Opción 4: VPS (Ubuntu)

```bash
# 1. Instalar Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# 2. Instalar Bun
curl -fsSL https://bun.sh/install | bash

# 3. Clonar repositorio
git clone tu-repo.git
cd erp-marca-blanca

# 4. Instalar dependencias
bun install

# 5. Build
bun run build

# 6. Usar PM2 para mantener proceso
npm install -g pm2
pm2 start "bun run start" --name erp
pm2 save
pm2 startup
```

## Solución de Problemas

### Error: Cannot find module

```bash
# Limpiar node_modules y reinstalar
rm -rf node_modules
rm bun.lockb  # o package-lock.json
bun install
```

### Error de Base de Datos

```bash
# Verificar conexión
psql $DATABASE_URL

# Reintentar push del schema
bun run db:push

# Ver logs detallados
bun run dev
```

### Puerto 3000 ocupado

```bash
# Cambiar puerto
PORT=3001 bun run dev

# O matar proceso
lsof -ti:3000 | xargs kill -9
```

### Error de TypeScript

```bash
# Limpiar caché y rebuildar
rm -rf .next
bun run build
```

### Performance lento

```bash
# Verificar uso de recursos
top
htop

# Optimizar base de datos
psql $DATABASE_URL
VACUUM ANALYZE;
```

### Error de CORS

Verificar configuración de `NEXTAUTH_URL` en `.env`:
```env
# Desarrollo
NEXTAUTH_URL="http://localhost:3000"

# Producción
NEXTAUTH_URL="https://tudominio.com"
```

## Verificar Instalación

### Checklist

- [ ] Node.js/Bun instalado correctamente
- [ ] Base de datos creada y accesible
- [ ] Variables de entorno configuradas
- [ ] Schema de BD aplicado exitosamente
- [ ] Servidor de desarrollo inicia sin errores
- [ ] Puedes acceder a http://localhost:3000
- [ ] Primer usuario creado
- [ ] Login funciona correctamente

### Tests Básicos

```bash
# Test de build
bun run build

# Test de lint
bun run lint

# Verificar tipos
bunx tsc --noEmit
```

## Siguiente Pasos

1. ✅ Configurar primer plan de suscripción
2. ✅ Crear primera empresa de prueba
3. ✅ Configurar sucursales
4. ✅ Crear roles y permisos
5. ✅ Agregar productos al catálogo
6. ✅ Configurar facturación electrónica
7. ✅ Realizar primera venta de prueba
8. ✅ Generar primera factura

## Soporte

Si tienes problemas durante la instalación:

- **Documentación:** README.md
- **Issues:** GitHub Issues
- **Email:** soporte@tudominio.com

---

**Última actualización:** Noviembre 2025
**Versión:** 1.0.0
