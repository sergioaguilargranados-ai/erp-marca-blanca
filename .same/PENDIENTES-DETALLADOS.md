# 📋 Lista Detallada de Pendientes - ERP Marca Blanca

## 🎯 Resumen Ejecutivo

**Total de Pendientes:** 78 tareas
**Puedo Completar:** 52 tareas (67%)
**Requieres Resolver:** 26 tareas (33%)

---

## 🤖 PENDIENTES QUE YO PUEDO COMPLETAR (52 tareas)

### 📱 Sprint 27-28: Funciones Operativas Móvil (14 tareas)

#### PDV Móvil
- [ ] Crear página PDV optimizada para móvil (`/app/movil/pdv/page.tsx`)
- [ ] Diseño responsive específico para pantallas pequeñas
- [ ] Gestos táctiles (swipe, pinch to zoom)
- [ ] Teclado numérico optimizado para touch
- [ ] Botones grandes para tocar fácilmente

#### Scanner de Códigos
- [ ] Componente para acceso a cámara del dispositivo
- [ ] Integración con librería de escaneo (quagga.js o html5-qrcode)
- [ ] Búsqueda automática al escanear
- [ ] Feedback visual/sonoro al escanear
- [ ] Fallback manual si cámara no disponible

#### Inventario Móvil
- [ ] Página de consulta rápida de inventario móvil
- [ ] Búsqueda optimizada para móvil
- [ ] Registro de entradas/salidas desde móvil
- [ ] Formularios adaptados a pantallas pequeñas

#### Otras Funciones Móviles
- [ ] Transferencias entre sucursales desde móvil
- [ ] Captura de fotos de productos con cámara
- [ ] Toma de pedidos optimizada para tablets
- [ ] Layout específico para tablets (10-12 pulgadas)

---

### ✨ Sprint 33: UX/UI Polish - Completar (15 tareas)

#### Dark Mode
- [ ] Implementar dark mode en página de login
- [ ] Dark mode en panel super admin
- [ ] Dark mode en todas las páginas de productos
- [ ] Dark mode en todas las páginas de inventario
- [ ] Dark mode en PDV
- [ ] Dark mode en reportes
- [ ] Dark mode en configuración
- [ ] Toggle de tema persistente en localStorage
- [ ] Icono de sol/luna para cambiar tema
- [ ] Transición suave entre temas

#### Accesibilidad (WCAG 2.1 AA)
- [ ] Agregar labels ARIA en todos los formularios
- [ ] Roles ARIA en componentes interactivos
- [ ] Navegación completa por teclado (Tab order)
- [ ] Focus visible en todos los elementos interactivos
- [ ] Contraste de colores AA (ratio 4.5:1)

---

### 🧪 Sprint 34: Testing y Seguridad (23 tareas)

#### Testing Automatizado
- [ ] Instalar Playwright (`bun add -D @playwright/test`)
- [ ] Configurar Playwright (`playwright.config.ts`)
- [ ] Test E2E: Login y autenticación
- [ ] Test E2E: Crear producto
- [ ] Test E2E: Registrar venta en PDV
- [ ] Test E2E: Generar factura
- [ ] Test E2E: Crear orden de compra
- [ ] Test E2E: Generar reporte
- [ ] Tests de integración para API
- [ ] Tests unitarios para utilidades críticas
- [ ] Setup de CI/CD con GitHub Actions
- [ ] Cobertura de código objetivo: 60%+

#### Optimización de Performance
- [ ] Analizar y optimizar queries lentas de DB
- [ ] Agregar índices faltantes en tablas
- [ ] Implementar React.memo en componentes pesados
- [ ] Lazy loading de módulos pesados
- [ ] Code splitting adicional
- [ ] Optimizar imágenes (Next.js Image)
- [ ] Implementar ISR en páginas estáticas
- [ ] Reducir bundle size
- [ ] Lighthouse audit y correcciones

#### Monitoreo
- [ ] Configurar error tracking básico
- [ ] Implementar logging estructurado
- [ ] Crear dashboard de métricas
- [ ] Configurar alertas básicas

---

## 👤 PENDIENTES QUE TÚ NECESITAS RESOLVER (26 tareas)

### 🔐 Configuraciones y Credenciales (10 tareas)

#### Base de Datos
- [ ] **Crear cuenta en Neon (PostgreSQL)**
  - URL: https://neon.tech
  - Crear database de producción
  - Obtener `DATABASE_URL`
  - Configurar en variables de entorno

#### Facturación (Facturama)
- [ ] **Crear cuenta en Facturama**
  - URL: https://facturama.mx
  - Obtener credenciales de Sandbox
  - Obtener credenciales de Producción
  - Configurar en `.env`:
    ```
    FACTURAMA_API_URL=https://api.facturama.mx
    FACTURAMA_USER=tu-usuario
    FACTURAMA_PASSWORD=tu-password
    ```

- [ ] **Subir certificados SAT (.cer y .key)**
  - Obtener certificados del SAT
  - Configurar en panel de Facturama
  - Probar timbrado en Sandbox

#### Pagos (Stripe)
- [ ] **Crear cuenta en Stripe**
  - URL: https://stripe.com
  - Obtener API keys de Test
  - Obtener API keys de Producción
  - Configurar webhook endpoint
  - Configurar en `.env`:
    ```
    STRIPE_SECRET_KEY=sk_live_...
    STRIPE_WEBHOOK_SECRET=whsec_...
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
    ```

- [ ] **Crear productos/precios en Stripe**
  - Plan Básico
  - Plan Profesional
  - Plan Empresarial

#### Email
- [ ] **Configurar servicio de email**
  - Opción 1: Gmail SMTP (desarrollo)
  - Opción 2: SendGrid (producción recomendado)
  - Opción 3: AWS SES
  - Configurar en `.env`:
    ```
    SMTP_HOST=smtp.gmail.com
    SMTP_PORT=587
    SMTP_USER=tu-email@gmail.com
    SMTP_PASSWORD=tu-app-password
    ```

#### Almacenamiento de Archivos
- [ ] **Configurar storage para imágenes**
  - Opción 1: Cloudinary (recomendado)
  - Opción 2: AWS S3
  - Opción 3: Vercel Blob
  - Obtener credenciales
  - Configurar URLs

#### Monitoreo (Opcional pero recomendado)
- [ ] **Crear cuenta en Sentry**
  - URL: https://sentry.io
  - Obtener DSN
  - Configurar en proyecto
  - Configurar en `.env`:
    ```
    NEXT_PUBLIC_SENTRY_DSN=https://...
    ```

---

### 🚀 Deployment y Producción (8 tareas)

#### Hosting
- [ ] **Decidir plataforma de hosting**
  - Opción 1: Netlify (recomendado, configurado)
  - Opción 2: Vercel (alternativa)
  - Opción 3: VPS propio
  - Crear cuenta y proyecto

- [ ] **Configurar dominio**
  - Comprar dominio (ej: tuempresa.com)
  - Configurar DNS
  - Agregar dominio a plataforma hosting
  - Configurar SSL (automático en Netlify/Vercel)

#### Variables de Entorno en Producción
- [ ] **Configurar todas las variables de entorno**
  - En panel de Netlify/Vercel
  - Copiar desde `.env`
  - Verificar que todas estén presentes
  - Cambiar a credenciales de PRODUCCIÓN

#### CI/CD
- [ ] **Conectar repositorio GitHub**
  - Hacer push del proyecto a GitHub
  - Conectar con Netlify/Vercel
  - Configurar auto-deploy en push a main

#### Database Migration
- [ ] **Ejecutar migraciones en producción**
  - Conectar a DB de producción
  - Ejecutar `bun run db:push`
  - Verificar tablas creadas
  - (Opcional) Seed de datos iniciales

#### Backups
- [ ] **Configurar backups automáticos**
  - En Neon Database (automático)
  - Plan de respaldo adicional
  - Probar restauración

#### DNS y Subdominios
- [ ] **Configurar subdominios para multi-tenant**
  - Wildcard DNS (*.tudominio.com)
  - Verificar propagación
  - Probar acceso por subdominio

---

### 📄 Datos y Contenido (8 tareas)

#### Seed Data
- [ ] **Crear datos iniciales del sistema**
  - Plan Básico con límites
  - Plan Profesional con límites
  - Plan Empresarial con límites
  - Roles predefinidos (6 roles)
  - Permisos por rol

#### White Label Assets
- [ ] **Preparar assets de marca**
  - Logo del ERP (principal)
  - Logo pequeño/icono
  - Favicon
  - Iconos PWA (varios tamaños)
  - Screenshots para PWA

#### Documentación de Usuario
- [ ] **Crear contenido de ayuda**
  - Videos tutoriales (opcional)
  - Guías en PDF
  - FAQs básicas
  - Casos de uso

#### Templates de Email
- [ ] **Diseñar templates de email**
  - Email de bienvenida
  - Email de factura
  - Email de recordatorio
  - Email de password reset

---

## 🎯 PRIORIZACIÓN RECOMENDADA

### ⚡ URGENTE (Hacer primero)

#### Lo que YO hago:
1. ✅ Completar dark mode (1-2 horas)
2. ✅ Tests E2E críticos (2-3 horas)
3. ✅ Optimización de performance (1-2 horas)

#### Lo que TÚ haces:
1. 🔴 Crear cuenta Neon y obtener DATABASE_URL
2. 🔴 Crear cuenta Netlify/Vercel
3. 🔴 Subir proyecto a GitHub
4. 🔴 Configurar variables de entorno básicas

**Tiempo estimado:** 1 día

---

### 🟡 IMPORTANTE (Hacer después)

#### Lo que YO hago:
4. ✅ Accesibilidad básica (2-3 horas)
5. ✅ Logging y monitoreo básico (1-2 horas)
6. ✅ Optimizar queries DB (2-3 horas)

#### Lo que TÚ haces:
5. 🟡 Crear cuenta Stripe y configurar planes
6. 🟡 Crear cuenta Facturama (sandbox)
7. 🟡 Configurar email SMTP
8. 🟡 Deploy inicial a staging

**Tiempo estimado:** 2-3 días

---

### 🟢 OPCIONAL (Hacer si hay tiempo)

#### Lo que YO hago:
7. ✅ Funciones móviles (scanner, PDV móvil)
8. ✅ Tests adicionales
9. ✅ Mejoras de UX

#### Lo que TÚ haces:
9. 🟢 Configurar Cloudinary/storage
10. 🟢 Crear videos tutoriales
11. 🟢 Configurar Sentry
12. 🟢 Backups adicionales

**Tiempo estimado:** 1 semana

---

## 📝 CHECKLIST DE DEPLOYMENT

### Pre-Deploy (TÚ)
- [ ] Cuenta Neon creada ✓
- [ ] DATABASE_URL obtenida ✓
- [ ] Proyecto en GitHub ✓
- [ ] Cuenta Netlify/Vercel creada ✓
- [ ] Dominio comprado (opcional) ✓

### Deploy (YO + TÚ)
- [ ] Variables de entorno configuradas ✓
- [ ] Build exitoso localmente ✓
- [ ] Migraciones ejecutadas ✓
- [ ] Deploy a staging ✓
- [ ] Tests en staging ✓

### Post-Deploy (TÚ)
- [ ] DNS configurado ✓
- [ ] SSL activo ✓
- [ ] Monitoreo activo ✓
- [ ] Backups configurados ✓
- [ ] Stripe webhooks verificados ✓

---

## 🛠️ GUÍA RÁPIDA DE SETUP

### Para que YO pueda completar TODO:

**Paso 1:** Crea estas cuentas y dame las credenciales:

```bash
# 1. Neon Database
DATABASE_URL="postgresql://..."

# 2. Netlify/Vercel
# Solo necesito que me digas cuál elegiste

# 3. Stripe (opcional ahora, puedo usar modo test)
STRIPE_SECRET_KEY_TEST="sk_test_..."

# 4. Facturama (opcional ahora, puedo usar sandbox)
FACTURAMA_SANDBOX_URL="https://apisandbox.facturama.mx"
FACTURAMA_SANDBOX_USER="pruebas"
FACTURAMA_SANDBOX_PASSWORD="pruebas2011"
```

**Paso 2:** Con eso puedo:
- ✅ Completar todos los tests
- ✅ Optimizar performance
- ✅ Implementar dark mode completo
- ✅ Agregar funciones móviles
- ✅ Hacer deploy a staging
- ✅ Dejarlo 100% listo para producción

**Paso 3:** Después TÚ solo necesitas:
- Cambiar a credenciales de producción
- Configurar dominio custom
- Configurar emails reales
- Listo para vender 🚀

---

## 📊 ESTIMACIÓN DE TIEMPOS

### Si TÚ me das las credenciales HOY:

| Tarea | Tiempo |
|-------|--------|
| Dark mode completo | 2 horas |
| Tests E2E críticos | 3 horas |
| Accesibilidad básica | 2 horas |
| Optimización performance | 2 horas |
| Funciones móviles básicas | 4 horas |
| Deploy a staging | 1 hora |
| **TOTAL** | **14 horas** (2 días) |

### Si haces TODO el setup TÚ:

| Tarea | Tiempo |
|-------|--------|
| Crear cuentas | 2 horas |
| Configurar servicios | 3 horas |
| Variables de entorno | 1 hora |
| Deploy manual | 2 horas |
| Troubleshooting | 2-4 horas |
| **TOTAL** | **10-12 horas** (2 días) |

**Recomendación:** Hacerlo juntos es más rápido y seguro.

---

## 🎯 DECISIÓN SIGUIENTE

**¿Qué prefieres?**

### Opción A: Completar YA lo que puedo (sin credenciales)
- ✅ Dark mode
- ✅ Accesibilidad
- ✅ Tests básicos
- ✅ Funciones móviles
- ✅ Optimizaciones

**Tiempo:** 1-2 días
**Resultado:** Sistema 95% completo, falta solo deploy

### Opción B: Dame credenciales y completo TODO
- ✅ Todo lo anterior
- ✅ Deploy a staging
- ✅ Tests de integración reales
- ✅ Configuración completa

**Tiempo:** 2 días
**Resultado:** Sistema 100% en staging, listo para producción

### Opción C: Tú haces setup, yo hago features
- TÚ: Cuentas y configuraciones
- YO: Features y optimizaciones
- Trabajamos en paralelo

**Tiempo:** 1-2 días
**Resultado:** Sistema completo más rápido

---

## 📞 SIGUIENTES PASOS

**Dime qué opción prefieres y empezamos:**

1. **"Opción A"** → Completo features sin credenciales
2. **"Opción B"** → Dame credenciales y lo completo todo
3. **"Opción C"** → Trabajamos en paralelo
4. **"Otra cosa"** → Dime qué necesitas primero

¿Qué eliges? 🚀
