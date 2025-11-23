# 🚀 Guía de Inicio Rápido - ERP Marca Blanca

## ⚡ 3 Formas de Empezar AHORA MISMO

Elige la opción que mejor se adapte a tus necesidades:

---

## 📋 Opción 1: Solo Explorar (2 minutos)

**¿Qué obtienes?**
- Ver toda la interfaz y diseño
- Navegar por todas las páginas
- Probar componentes y efectos
- SIN datos, solo UI

**Pasos:**

```bash
# 1. Abrir terminal en el proyecto
cd erp-marca-blanca

# 2. Iniciar servidor
bun run dev

# 3. Abrir navegador
# http://localhost:3000
```

**¡Listo!** Ya puedes explorar la UI completa del ERP.

**Páginas para visitar:**
- `/` - Landing page
- `/admin` - Panel super admin
- `/movil/pdv` - PDV móvil con scanner
- `/movil/inventario` - Inventario móvil

---

## 🎯 Opción 2: Con Datos Demo (10 minutos)

**¿Qué obtienes?**
- Datos de ejemplo pre-cargados
- Usuario admin funcional
- 3 planes de suscripción
- 6 roles predefinidos
- 50+ permisos configurados

**Pasos:**

```bash
cd erp-marca-blanca

# 1. Instalar dependencias (si no lo hiciste)
bun install

# 2. Aplicar migraciones a la base de datos
bun run db:push

# 3. Crear datos de ejemplo
bun run db:seed

# 4. Iniciar servidor
bun run dev
```

**Credenciales de acceso:**
```
Email: admin@demo.com
Password: demo123
Subdominio: demo
```

**¡Listo para usar!**

**Lo que puedes hacer:**
- ✅ Login con usuario admin
- ✅ Crear productos
- ✅ Gestionar inventario
- ✅ Hacer ventas
- ✅ Ver reportes
- ✅ Configurar la empresa
- ✅ Gestionar usuarios y roles

---

## 🌐 Opción 3: Deploy a Producción (30 minutos)

**¿Qué obtienes?**
- URL pública en internet
- HTTPS automático
- Deploy continuo
- Listo para clientes reales

**Prerequisitos:**
- Cuenta GitHub
- Cuenta Netlify (gratis)
- Database URL de Neon (ya tienes)

**Pasos Detallados:**

### 1. Subir a GitHub (5 min)

```bash
cd erp-marca-blanca

# Si aún no tienes repo
git init
git add .
git commit -m "feat: ERP marca blanca production ready"

# Crear repo en GitHub.com y luego:
git remote add origin https://github.com/tu-usuario/erp-marca-blanca.git
git push -u origin main
```

### 2. Configurar Netlify (10 min)

1. Ve a https://netlify.com
2. Click en "Add new site" → "Import an existing project"
3. Conecta con GitHub
4. Selecciona tu repositorio `erp-marca-blanca`
5. Configuración:
   - **Build command:** `bun run build`
   - **Publish directory:** `.next`
   - **Base directory:** (dejar vacío)

### 3. Environment Variables (10 min)

En Netlify → Site settings → Environment variables, agrega:

```env
# Database
DATABASE_URL=tu_neon_database_url

# Auth
NEXTAUTH_SECRET=genera_un_secret_aleatorio_largo
NEXTAUTH_URL=https://tu-sitio.netlify.app

# Facturama (Sandbox)
FACTURAMA_API_URL=https://apisandbox.facturama.mx
FACTURAMA_USERNAME=pruebas
FACTURAMA_PASSWORD=pruebas2011

# Stripe (Test - opcional)
STRIPE_SECRET_KEY=sk_test_tu_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_tu_key
```

**Generar NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

### 4. Deploy (5 min)

1. Click en "Deploy site"
2. Esperar 2-3 minutos
3. ¡Tu sitio está online!

### 5. Inicializar BD en Producción

```bash
# Ejecutar migrations (una sola vez)
# Desde tu local:
bunx drizzle-kit push

# Crear datos iniciales (una sola vez)
bun run db:seed
```

**¡Listo! Tu ERP está en producción** 🎉

**URL de acceso:** `https://tu-sitio.netlify.app`

---

## 🛠️ Comandos Útiles

```bash
# Desarrollo
bun run dev              # Iniciar servidor local
bun run build            # Build para producción
bun run start            # Iniciar build de producción

# Base de Datos
bun run db:push          # Aplicar migrations
bun run db:studio        # Abrir GUI de DB (puerto 4983)
bun run db:seed          # Crear datos demo
bun run db:generate      # Generar nuevas migrations

# Calidad
bun run lint             # Linter y type checking
bun run format           # Formatear código

# Testing
bun run test             # Tests E2E
bun run test:ui          # Tests con UI
bun run test:debug       # Debug tests

# Análisis
bun run analyze          # Analizar bundle size
```

---

## 🎨 Features para Probar

### 1. Dark Mode 🌙
- Click en el ícono de sol/luna en el header
- 3 modos: Light, Dark, System
- Persiste en localStorage

### 2. Scanner de Códigos 📱
**URL:** `/movil/pdv`

- Click en botón "Scanner"
- Permitir acceso a cámara
- Escanear código de barras
- O usar input manual

### 3. Font Size Control 🔤
- Botones +/- para ajustar tamaño
- 4 niveles: Small, Normal, Large, Extra-Large
- Persiste en localStorage

### 4. PDV Móvil 💳
**URL:** `/movil/pdv`

- Búsqueda de productos
- Agregar al carrito
- Seleccionar método de pago
- Procesar venta

### 5. Inventario Móvil 📦
**URL:** `/movil/inventario`

- Ver lista de productos
- Buscar con scanner
- Alertas de stock bajo
- Barras de progreso visuales

### 6. Admin Dashboard 👑
**URL:** `/admin`

- Panel super admin
- Métricas en tiempo real
- Empresas pendientes
- Actividad reciente

---

## 📚 Páginas Principales

### Super Admin
- `/admin` - Dashboard
- `/admin/empresas` - Gestión de empresas
- `/admin/planes` - Planes de suscripción

### Empresa (Tenant)
- `/dashboard` - Dashboard de empresa
- `/productos` - Catálogo de productos
- `/inventario` - Control de inventario
- `/ventas` - Historial de ventas
- `/pdv` - Punto de venta desktop
- `/clientes` - Gestión de clientes
- `/reportes` - Reportes y analytics
- `/facturacion` - CFDI y facturación
- `/configuracion` - Configuración

### Móvil
- `/movil/pdv` - PDV táctil
- `/movil/inventario` - Inventario móvil

---

## 🔑 Credenciales de Prueba

### Usuario Demo (después de seed)
```
Email: admin@demo.com
Password: demo123
Empresa: demo
```

### Facturama Sandbox
```
URL: https://apisandbox.facturama.mx
Usuario: pruebas
Password: pruebas2011
```

### Stripe Test
```
Tarjeta: 4242 4242 4242 4242
CVC: cualquier 3 dígitos
Fecha: cualquier fecha futura
```

---

## 🆘 Solución de Problemas

### El servidor no inicia
```bash
# Limpiar cache y reinstalar
rm -rf node_modules .next
bun install
bun run dev
```

### Error de base de datos
```bash
# Verificar .env
cat .env | grep DATABASE_URL

# Verificar conexión
bun run db:studio
```

### Migrations no se aplican
```bash
# Forzar push
bunx drizzle-kit push --force

# O generar nuevas
bunx drizzle-kit generate
bunx drizzle-kit push
```

### Build falla en Netlify
1. Verificar que todas las env vars están configuradas
2. Verificar que DATABASE_URL es correcta
3. Check logs en Netlify Deploy log

### Página en blanco
1. Abrir DevTools Console (F12)
2. Ver errores
3. Verificar que el servidor está corriendo
4. Limpiar cache del navegador

---

## 💡 Tips Pro

### 1. Usar Drizzle Studio
```bash
bun run db:studio
# Abre http://localhost:4983
# GUI visual para ver/editar datos
```

### 2. Hot Reload
El servidor usa Turbopack, los cambios se reflejan instantáneamente.

### 3. TypeScript Errors
```bash
# Ver todos los errores
bunx tsc --noEmit

# Fix automático (algunos)
bun run format
```

### 4. Probar en Móvil
```bash
# Iniciar servidor
bun run dev

# Obtener IP local
ifconfig | grep inet

# Acceder desde móvil
# http://TU_IP:3000
```

### 5. Performance
```bash
# Analizar bundle
bun run analyze

# Ver reporte
# Se abre automáticamente en navegador
```

---

## 📊 Próximos Pasos Sugeridos

### Después de Explorar
1. ✅ Revisar componentes en `src/components/`
2. ✅ Ver páginas en `src/app/`
3. ✅ Leer esquemas de BD en `src/lib/db/schema/`
4. ✅ Explorar la documentación en archivos `.md`

### Para Personalizar
1. Cambiar colores en `tailwind.config.ts`
2. Editar logo y branding
3. Configurar white label per empresa
4. Personalizar emails
5. Ajustar planes de suscripción

### Para Producción
1. Crear cuentas en servicios (Stripe, Facturama)
2. Configurar dominio custom
3. Setup monitoring (Sentry)
4. Configurar analytics
5. Email marketing (opcional)

---

## 🎯 ¿Qué Hacer Ahora?

**Si tienes 5 minutos:**
→ Opción 1: Solo explorar

**Si tienes 15 minutos:**
→ Opción 2: Con datos demo

**Si tienes 30 minutos:**
→ Opción 3: Deploy a producción

**Si tienes 1 hora:**
→ Explorar todo el código y personalizar

---

## 🌟 Funcionalidades Destacadas

- ✅ **Multi-tenant** con subdominios
- ✅ **Dark mode** completo
- ✅ **PWA** instalable
- ✅ **Scanner** de códigos
- ✅ **Accesibilidad** WCAG 2.1 AA
- ✅ **Facturación** CFDI 4.0
- ✅ **E-commerce** API
- ✅ **Tests** E2E
- ✅ **CI/CD** automatizado
- ✅ **Documentación** exhaustiva

---

## 📞 Necesitas Ayuda?

**Documentación:**
- `README.md` - Visión general
- `INSTALLATION.md` - Instalación detallada
- `DEPLOYMENT-GUIDE.md` - Deploy paso a paso
- `ACCESSIBILITY.md` - Accesibilidad
- `.same/RESUMEN-FINAL-PROYECTO.md` - Resumen completo

**Recursos:**
- Same.new: https://same.new
- Same Docs: https://docs.same.new
- Same Support: support@same.new

---

**¡Éxito con tu ERP!** 🚀

**Versión:** v2.3.0
**Última actualización:** Noviembre 23, 2025
