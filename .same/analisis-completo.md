# 📊 ANÁLISIS COMPLETO - ERP MARCA BLANCA

## 🎯 VISIÓN DEL PROYECTO

Sistema ERP SaaS multi-tenant (marca blanca) para rentar con costo mensual a múltiples empresas.

### Características Principales:
- ✅ Multi-empresa con hasta 99 sucursales cada una
- ✅ Multi-moneda configurable
- ✅ Inventario independiente por sucursal
- ✅ White label completo con subdominios personalizados
- ✅ Panel Super Admin para gestión del servicio
- ✅ Integración con Facturama para facturación electrónica
- ✅ PDV con sistema de turnos y modo offline
- ✅ App móvil para operaciones
- ✅ Integración futura con e-commerce

---

## 🏗️ ARQUITECTURA GENERAL

### Modelo de Negocio (SaaS Multi-Tenant)

```
┌─────────────────────────────────────────────────────────────┐
│                    TU EMPRESA (Proveedor)                    │
│                                                               │
│  Panel Super Admin:                                          │
│  - Gestión de clientes/empresas                             │
│  - Facturación y cobros mensuales                           │
│  - Monitoreo de uso y métricas                              │
│  - Soporte y tickets                                         │
│  - Configuración de planes                                   │
└─────────────────────────────────────────────────────────────┘
                             │
                             │ provee servicio a ↓
                             │
        ┌────────────────────┴────────────────────┐
        │                                         │
┌───────▼──────────┐                  ┌──────────▼────────┐
│  EMPRESA A       │                  │  EMPRESA B        │
│  empresa-a.com   │                  │  empresa-b.com    │
├──────────────────┤                  ├───────────────────┤
│ - Sucursal 1     │                  │ - Sucursal 1      │
│ - Sucursal 2     │                  │ - Sucursal 2      │
│ - Usuarios       │                  │ - Usuarios        │
│ - Inventario     │                  │ - Inventario      │
│ - PDV            │                  │ - PDV             │
│ - Facturación    │                  │ - Facturación     │
└──────────────────┘                  └───────────────────┘
```

### Ecosistema Completo

```
┌─────────────────────────────────────────────────────────────┐
│                        ERP CORE                              │
│                    (Este Proyecto)                           │
│  - Gestión empresarial completa                             │
│  - Inventario, PDV, Facturación                             │
│  - Usuarios y roles                                          │
└─────────────────┬───────────────────────┬───────────────────┘
                  │                       │
                  ▼                       ▼
    ┌─────────────────────┐   ┌─────────────────────┐
    │   E-COMMERCE WEB    │   │    APP MÓVIL        │
    │  (Proyecto Futuro)  │   │  (Funciones Lite)   │
    ├─────────────────────┤   ├─────────────────────┤
    │ - Catálogo público  │   │ - Escaneo códigos   │
    │ - Carrito compras   │   │ - Consulta stock    │
    │ - Checkout          │   │ - Entradas/salidas  │
    │ - Login empleados → │   │ - Transferencias    │
    │   redirige a ERP    │   │ - PDV simplificado  │
    └─────────────────────┘   │ - Modo offline      │
                              └─────────────────────┘
```

---

## 🔑 DECISIONES ARQUITECTÓNICAS CLAVE

### 1. Multi-Tenancy: Estrategia Propuesta

**OPCIÓN RECOMENDADA: Single Database con Row Level Security (RLS)**

**Ventajas:**
- ✅ Más económico (una sola instancia Neon)
- ✅ Fácil mantenimiento y actualizaciones
- ✅ Queries cross-tenant para analytics (tu panel admin)
- ✅ Backups centralizados
- ✅ Escalable hasta miles de empresas

**Implementación:**
```sql
-- Todas las tablas tienen empresa_id
CREATE TABLE productos (
  id UUID PRIMARY KEY,
  empresa_id UUID NOT NULL REFERENCES empresas(id),
  nombre VARCHAR(255),
  ...
);

-- Row Level Security
ALTER TABLE productos ENABLE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation ON productos
  USING (empresa_id = current_setting('app.current_tenant')::uuid);
```

**Identificación de Tenant:**
- Por subdominio: `empresa-a.tudominio.com` → `empresa_id = xxx`
- Middleware de Next.js detecta subdominio y establece contexto

### 2. Subdominios White Label

**Estructura:**
```
super-admin.tudominio.com    → Panel Super Administrativo (TÚ)
empresa-a.tudominio.com      → ERP de Empresa A
empresa-b.tudominio.com      → ERP de Empresa B
api.tudominio.com            → API centralizada (opcional)
```

**Personalización por Empresa:**
```typescript
{
  empresa_id: "uuid",
  configuracion_whitelabel: {
    nombre_app: "Mi ERP Empresarial",
    logo_url: "https://...",
    colores: {
      primario: "#1e40af",
      secundario: "#64748b",
      acento: "#f59e0b"
    },
    dominio: "empresa-a.tudominio.com",
    favicon_url: "https://..."
  }
}
```

### 3. Stack Tecnológico Confirmado

**Frontend:**
- ✅ Next.js 14+ (App Router)
- ✅ React 18.2.0
- ✅ TypeScript
- ✅ TailwindCSS 3.3.2
- ✅ shadcn/ui (componentes customizados)
- ✅ Zustand o Jotai (state management)
- ✅ React Query (server state)

**Backend:**
- ✅ Next.js API Routes / Server Actions
- ✅ Neon PostgreSQL (database)
- ✅ Drizzle ORM o Prisma (ORM)
- ✅ NextAuth.js (autenticación multi-tenant)

**Integraciones:**
- ✅ Facturama API (facturación electrónica)
- ✅ Stripe/OpenPay (cobros mensuales - A DEFINIR)
- ✅ AWS S3 / Cloudinary (imágenes productos)
- ✅ Resend / SendGrid (emails)

**App Móvil (Futura):**
- ✅ PWA con Service Workers (offline-first)
- ✅ React Native (si se requiere nativa)

---

## 📦 MÓDULOS DEL SISTEMA

### A. PANEL SUPER ADMINISTRATIVO (Proveedor del Servicio)

**Funcionalidades Esenciales:**

1. **Dashboard Principal**
   - Métricas clave: MRR, empresas activas, churns
   - Gráficas de crecimiento
   - Alertas importantes

2. **Gestión de Empresas/Clientes**
   - CRUD completo de empresas
   - Estados: Prueba, Activa, Suspendida, Cancelada
   - Asignación de plan
   - Límites de uso: sucursales, usuarios, productos, transacciones
   - Ver consumo actual vs límites
   - Habilitar/deshabilitar acceso
   - Logs de actividad

3. **Planes y Precios**
   - Configuración de planes (Básico, Pro, Enterprise)
   - Definir límites por plan:
     ```
     Plan Básico:
     - 3 sucursales máx
     - 10 usuarios máx
     - 500 productos máx
     - $XXX MXN/mes

     Plan Pro:
     - 15 sucursales máx
     - 50 usuarios máx
     - 5000 productos máx
     - $XXX MXN/mes

     Plan Enterprise:
     - 99 sucursales máx
     - Usuarios ilimitados
     - Productos ilimitados
     - $XXX MXN/mes
     ```

4. **Facturación Automática**
   - Generación automática de facturas mensuales
   - Registro de pagos recibidos
   - Historial de facturación por empresa
   - Recordatorios automáticos pre-vencimiento
   - Suspensión automática por falta de pago (configurable)
   - Reactivación al recibir pago

5. **Sistema de Soporte**
   - Tickets de soporte por empresa
   - Estados: Abierto, En proceso, Resuelto, Cerrado
   - Prioridades: Baja, Media, Alta, Crítica
   - Asignación de tickets a staff
   - Historial de comunicación

6. **Monitoreo de Uso**
   - Por empresa:
     - Número de sucursales activas
     - Número de usuarios registrados
     - Número de productos en catálogo
     - Transacciones mensuales
     - Almacenamiento usado (imágenes)
   - Alertas cuando se acercan a límites

7. **Configuración Global**
   - Parámetros del sistema
   - Credenciales de integraciones (Facturama, pagos, email)
   - Templates de emails transaccionales
   - Términos y condiciones
   - Política de privacidad

### B. ERP CORE (Lo que usan tus clientes)

**Ya definido en tu especificación:**

1. ✅ Módulo Empresas & Sucursales
2. ✅ Módulo Usuarios & Roles
3. ✅ Módulo Productos (con códigos de barras únicos globales)
4. ✅ Módulo Facturación (Facturama)
5. ✅ Módulo PDV con Turnos
6. ✅ Módulo Configuración (moneda, IVA, descuentos)
7. ✅ Módulo Reportes
8. ✅ Módulo Seguridad (auditoría, logs)

**MÓDULOS ADICIONALES RECOMENDADOS:**

9. **Módulo Compras** (Esencial para ERP completo)
   - Catálogo de proveedores
   - Órdenes de compra
   - Recepción de mercancía
   - Cuentas por pagar
   - Historial de compras

10. **Módulo Clientes** (Fundamental para ventas)
    - Base de datos de clientes
    - Historial de compras
    - Cuentas por cobrar
    - Crédito a clientes
    - Programa de lealtad

11. **Módulo Gastos Operativos**
    - Registro de gastos
    - Categorías configurables
    - Aprobación de gastos
    - Vinculación con contabilidad

12. **Módulo Cotizaciones**
    - Crear cotizaciones
    - Convertir a venta
    - Seguimiento de conversión
    - Vigencia de cotizaciones

---

## 🗄️ ARQUITECTURA DE BASE DE DATOS

### Estrategia de Códigos de Barras Únicos Globales

**Importante:** Los códigos de barras deben ser únicos en TODO el sistema (no solo por empresa).

**Implementación:**
```sql
CREATE TABLE codigos_barras_globales (
  codigo VARCHAR(50) PRIMARY KEY,  -- El código es la PK
  producto_id UUID NOT NULL,
  empresa_id UUID NOT NULL,
  tipo VARCHAR(20) NOT NULL, -- EAN13, CODE128, CUSTOM
  fecha_creacion TIMESTAMP DEFAULT NOW(),
  activo BOOLEAN DEFAULT TRUE
);

CREATE UNIQUE INDEX idx_codigo_unico ON codigos_barras_globales(codigo);
```

**Generador de Códigos:**
- Para productos sin código: generar EAN-13 o CODE-128 único
- Validar antes de insertar que no exista en `codigos_barras_globales`
- Para ensambles/personalizados: prefijo especial + secuencial

### Sistema Multi-Moneda

**Tabla de Configuración:**
```sql
CREATE TABLE configuracion_sucursal (
  sucursal_id UUID PRIMARY KEY,
  moneda_local VARCHAR(3) DEFAULT 'MXN', -- MXN, USD, EUR
  tasa_iva DECIMAL(5,2) DEFAULT 16.00,
  ...
);

CREATE TABLE tasas_cambio (
  id UUID PRIMARY KEY,
  moneda_base VARCHAR(3),
  moneda_destino VARCHAR(3),
  tasa DECIMAL(10,4),
  fecha_actualizacion TIMESTAMP,
  UNIQUE(moneda_base, moneda_destino)
);
```

**En Transacciones:**
```sql
CREATE TABLE ventas (
  id UUID PRIMARY KEY,
  moneda VARCHAR(3) NOT NULL,
  total_moneda_local DECIMAL(12,2),
  tipo_cambio_usd DECIMAL(10,4), -- para reportes consolidados
  total_usd DECIMAL(12,2), -- conversión para analytics
  ...
);
```

### Sistema de Turnos PDV

```sql
CREATE TABLE turnos_caja (
  id UUID PRIMARY KEY,
  caja_id UUID REFERENCES cajas(id),
  usuario_id UUID REFERENCES usuarios(id),
  tipo_turno VARCHAR(20), -- matutino, vespertino, nocturno
  monto_inicial DECIMAL(12,2),
  hora_apertura TIMESTAMP,
  hora_cierre TIMESTAMP,
  estado VARCHAR(20), -- abierto, cerrado
  notas_apertura TEXT,
  notas_cierre TEXT
);

CREATE TABLE cortes_caja (
  id UUID PRIMARY KEY,
  turno_id UUID REFERENCES turnos_caja(id),
  usuario_cierre_id UUID REFERENCES usuarios(id),
  total_efectivo_sistema DECIMAL(12,2),
  total_efectivo_contado DECIMAL(12,2),
  diferencia DECIMAL(12,2), -- contado - sistema
  total_tarjeta DECIMAL(12,2),
  total_transferencia DECIMAL(12,2),
  total_otros DECIMAL(12,2),
  observaciones TEXT,
  fecha_corte TIMESTAMP DEFAULT NOW()
);

-- Detalle de denominaciones
CREATE TABLE denominaciones_corte (
  id UUID PRIMARY KEY,
  corte_id UUID REFERENCES cortes_caja(id),
  denominacion DECIMAL(10,2), -- 1000, 500, 200, 100, 50, 20, 10, 5, 2, 1, 0.50
  cantidad INT,
  total DECIMAL(12,2) -- denominacion * cantidad
);
```

---

## 🔐 SEGURIDAD Y AUTENTICACIÓN

### NextAuth.js Multi-Tenant

**Estrategia:**
```typescript
// middleware.ts
export async function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || '';

  // Detectar tipo de acceso
  if (hostname.startsWith('super-admin.')) {
    // Panel Super Admin - solo tu equipo
    return checkSuperAdminAuth(request);
  } else {
    // ERP de cliente - detectar empresa por subdominio
    const subdomain = hostname.split('.')[0];
    const empresa = await getEmpresaBySubdomain(subdomain);

    if (!empresa || !empresa.activa) {
      return Response.redirect('/suspended');
    }

    // Setear tenant context
    request.headers.set('x-tenant-id', empresa.id);
    return checkClientAuth(request, empresa.id);
  }
}
```

**Roles y Permisos:**
```typescript
// Super Admin (TÚ)
type SuperAdminRole = 'super_admin' | 'support_staff';

// Clientes del ERP
type ClientRole =
  | 'administrador_general'
  | 'gerente_sucursal'
  | 'vendedor'
  | 'contador'
  | 'soporte'
  | 'direccion'
  | 'custom_role'; // roles configurables
```

### Encriptación de Credenciales Facturama

```typescript
// lib/encryption.ts
import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const SECRET_KEY = process.env.ENCRYPTION_SECRET_KEY; // 32 bytes

export function encrypt(text: string): string {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, SECRET_KEY, iv);

  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  const authTag = cipher.getAuthTag();

  return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
}

export function decrypt(encryptedText: string): string {
  const [ivHex, authTagHex, encrypted] = encryptedText.split(':');

  const iv = Buffer.from(ivHex, 'hex');
  const authTag = Buffer.from(authTagHex, 'hex');
  const decipher = crypto.createDecipheriv(ALGORITHM, SECRET_KEY, iv);

  decipher.setAuthTag(authTag);

  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
}
```

**Almacenamiento:**
```sql
CREATE TABLE credenciales_facturama (
  empresa_id UUID PRIMARY KEY,
  rfc VARCHAR(13) NOT NULL,
  usuario_facturama VARCHAR(255) NOT NULL,
  password_encrypted TEXT NOT NULL, -- encriptado con AES-256
  api_key_encrypted TEXT, -- encriptado
  modo VARCHAR(10) DEFAULT 'sandbox', -- sandbox | production
  fecha_actualizacion TIMESTAMP DEFAULT NOW()
);
```

---

## 📱 MODO OFFLINE - ESTRATEGIA

### PDV Offline (PWA)

**Tecnologías:**
- Service Workers
- IndexedDB para almacenamiento local
- Background Sync API para sincronización

**Flujo:**
```
1. Al iniciar turno → Descargar catálogo de productos a IndexedDB
2. Ventas offline → Guardar en IndexedDB con flag "pending_sync"
3. Al recuperar internet → Background sync sube ventas pendientes
4. Resolver conflictos (ej: producto agotado mientras offline)
```

**Datos a Almacenar Localmente:**
- Productos con precios actuales
- Stock de la sucursal
- Clientes frecuentes
- Configuración de la caja
- Ventas pendientes de sincronizar

**Sincronización:**
```typescript
// service-worker.ts
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-ventas') {
    event.waitUntil(syncPendingVentas());
  }
});

async function syncPendingVentas() {
  const db = await openDB('erp-offline');
  const ventasPendientes = await db.getAll('ventas_pendientes');

  for (const venta of ventasPendientes) {
    try {
      await fetch('/api/ventas', {
        method: 'POST',
        body: JSON.stringify(venta)
      });
      await db.delete('ventas_pendientes', venta.id);
    } catch (error) {
      // Reintentar después
      console.error('Error syncing venta:', venta.id);
    }
  }
}
```

---

## 🚀 PLAN DE DESARROLLO POR FASES

### FASE 1: FUNDAMENTOS (4-6 semanas)

**1.1 Infraestructura Base**
- ✅ Setup Next.js + TypeScript
- ✅ Configuración Neon PostgreSQL
- ✅ ORM (Drizzle/Prisma)
- ✅ Autenticación multi-tenant (NextAuth)
- ✅ Middleware para detección de subdominios
- ✅ Sistema de themes white-label

**1.2 Panel Super Admin**
- ✅ Dashboard principal
- ✅ CRUD de empresas
- ✅ Configuración de planes
- ✅ Sistema de estados (prueba, activa, suspendida)
- ✅ Logs de actividad

**1.3 Base del ERP**
- ✅ CRUD empresas y sucursales
- ✅ Sistema de usuarios y roles
- ✅ Configuración multi-moneda
- ✅ Configuración de IVA

### FASE 2: OPERACIONES CORE (6-8 semanas)

**2.1 Módulo Productos**
- ✅ CRUD completo
- ✅ Categorías por empresa
- ✅ Códigos de barras únicos globales
- ✅ Generador de códigos
- ✅ Múltiples unidades de medida
- ✅ Precios por tipo de cliente
- ✅ Imágenes de productos

**2.2 Inventario**
- ✅ Stock por sucursal
- ✅ Movimientos (entradas/salidas)
- ✅ Ajustes de inventario
- ✅ Transferencias entre sucursales
- ✅ Alertas de stock mínimo

**2.3 PDV Básico**
- ✅ Búsqueda de productos
- ✅ Carrito de compras
- ✅ Cálculo de totales
- ✅ Múltiples métodos de pago
- ✅ Impresión de tickets

### FASE 3: FACTURACIÓN & TURNOS (4-6 semanas)

**3.1 Integración Facturama**
- ✅ Conexión API
- ✅ Almacenamiento seguro credenciales
- ✅ Generación CFDI 4.0
- ✅ Timbrado automático
- ✅ Descarga XML/PDF
- ✅ Notas de crédito
- ✅ Cancelación

**3.2 Sistema de Turnos**
- ✅ Apertura de turno con monto inicial
- ✅ Registro de ventas por turno
- ✅ Corte de caja
- ✅ Denominaciones
- ✅ Reportes de diferencias

### FASE 4: FACTURACIÓN AUTOMÁTICA (3-4 semanas)

**4.1 Sistema de Cobros**
- ✅ Generación automática de facturas mensuales
- ✅ Integración pasarela de pago
- ✅ Registro de pagos
- ✅ Recordatorios automáticos
- ✅ Suspensión por falta de pago

**4.2 Reportes del Super Admin**
- ✅ MRR y métricas financieras
- ✅ Churn rate
- ✅ Uso por empresa
- ✅ Proyecciones

### FASE 5: MÓDULOS AVANZADOS (6-8 semanas)

**5.1 Módulo Compras**
- ✅ Proveedores
- ✅ Órdenes de compra
- ✅ Recepción de mercancía
- ✅ Cuentas por pagar

**5.2 Módulo Clientes**
- ✅ Base de datos clientes
- ✅ Historial de compras
- ✅ Cuentas por cobrar
- ✅ Crédito a clientes

**5.3 Reportes Avanzados**
- ✅ Reportes financieros
- ✅ Análisis de rentabilidad
- ✅ Dashboards personalizados
- ✅ Exportación Excel/PDF

### FASE 6: OFFLINE & MÓVIL (6-8 semanas)

**6.1 PWA Offline**
- ✅ Service Workers
- ✅ IndexedDB
- ✅ Background Sync
- ✅ Sincronización conflictos

**6.2 App Móvil**
- ✅ React Native / PWA
- ✅ Escaneo códigos de barras
- ✅ Consulta inventario
- ✅ Entradas/salidas
- ✅ PDV móvil simplificado

### FASE 7: E-COMMERCE (Proyecto Separado)

- ✅ Catálogo público
- ✅ Carrito de compras
- ✅ Checkout
- ✅ Integración con inventario ERP
- ✅ Redirección empleados a ERP

---

## 📋 ESTIMACIÓN TOTAL

**Tiempo estimado MVP (Fases 1-4):** 17-24 semanas (4-6 meses)
**Tiempo completo (Fases 1-6):** 29-42 semanas (7-10 meses)

---

## ❓ PREGUNTAS CRÍTICAS PENDIENTES

### 🔴 ALTA PRIORIDAD (necesarias antes de continuar)

1. **Facturación y Cobros:**
   - ¿Qué pasarela de pago usarás? (Stripe, OpenPay, Conekta, PayPal)
   - ¿Cobro mensual o permitirás anual con descuento?
   - ¿Cuántos días de prueba gratuita?
   - ¿Qué pasa si no pagan? ¿Suspensión automática inmediata o período de gracia?

2. **Planes y Precios:**
   - ¿Cuántos planes tendrás? (Básico, Pro, Enterprise)
   - ¿Qué límites específicos por plan?
   - ¿Precio tentativo de cada plan?

3. **Backend:**
   - ¿Usamos Neon + Next.js API Routes?
   - ¿O prefieres backend separado (Node.js/Express)?

### 🟡 MEDIA PRIORIDAD (podemos definir pronto)

4. **Módulos Adicionales:**
   - De los que sugerí (Compras, Clientes, Proveedores, Gastos)
   - ¿Cuáles incluimos en el MVP?
   - ¿Cuáles para versiones posteriores?

5. **E-commerce:**
   - ¿Lo desarrollaremos después de terminar el ERP?
   - ¿O en paralelo como proyecto separado?

6. **Impresión:**
   - ¿Tickets térmicos? ¿Qué impresoras específicas?
   - ¿Impresión de etiquetas de código de barras?
   - ¿Biblioteca de impresión? (react-to-print, específica de hardware)

### 🟢 BAJA PRIORIDAD (podemos definir después)

7. **App Móvil:**
   - ¿React Native o solo PWA?
   - ¿Funciones específicas además de las operativas?

8. **Notificaciones:**
   - ¿Email, SMS, Push notifications?
   - ¿Para qué eventos?

---

## 🎯 PRÓXIMOS PASOS INMEDIATOS

1. **Responder preguntas críticas** (arriba)
2. **Revisar y aprobar arquitectura propuesta**
3. **Definir prioridades de desarrollo**
4. **Comenzar con Fase 1: Fundamentos**

---

**Última actualización:** 2025-11-22
**Estado:** Pendiente de aprobación y respuestas
