# 📊 ANÁLISIS COMPLETO - ERP MARCA BLANCA

## 🎯 VISIÓN DEL PROYECTO

### Objetivo Principal
Desarrollar un **ERP SaaS Multi-Tenant** de marca blanca para rentar con costo mensual, dirigido a empresas que necesiten:
- Gestión multi-empresa con hasta 99 sucursales
- Sistema multi-moneda
- Facturación electrónica (CFDI 4.0 vía Facturama)
- Punto de Venta (PDV) con sistema de turnos
- Inventarios independientes por sucursal
- Integración con e-commerce

### Características Distintivas
- ✅ **White Label Completo** - Sin marca del proveedor en el sistema del cliente
- ✅ **Subdominios Personalizados** - Cada empresa tiene su propio subdominio
- ✅ **Modo Offline** - PDV y app móvil funcionan sin internet
- ✅ **Panel Super Admin** - Para gestionar clientes, cobros y facturación del servicio
- ✅ **App Móvil** - Funciones operativas (inventario, escaneo, etc.)
- ✅ **E-commerce Integration** - Sincronización con tiendas online

---

## 🏗️ ARQUITECTURA PROPUESTA

### Stack Tecnológico
```
Frontend:
- Next.js 14+ (App Router)
- React 18.2.0
- TypeScript
- TailwindCSS 3.3.2
- shadcn/ui

Backend:
- Neon PostgreSQL (Database)
- Next.js API Routes / Server Actions
- Supabase (opcional para Auth y Storage)

Móvil:
- PWA (Progressive Web App) - Fase inicial
- React Native (Fase avanzada)

Offline:
- Service Workers
- IndexedDB para caché local
- Sincronización automática
```

### Modelo Multi-Tenant

**OPCIÓN RECOMENDADA: Single Database con Row Level Security**

```
┌─────────────────────────────────────────┐
│         NEON POSTGRESQL DATABASE         │
├─────────────────────────────────────────┤
│  ┌─────────────────────────────────┐   │
│  │  Tabla: empresas                 │   │
│  │  - id (PK)                       │   │
│  │  - subdominio (unique)           │   │
│  │  - plan_id                       │   │
│  │  - estado (activa/prueba/        │   │
│  │    suspendida/cancelada)         │   │
│  └─────────────────────────────────┘   │
│                                          │
│  Todas las demás tablas tienen:         │
│  - empresa_id (FK a empresas)           │
│  - Row Level Security habilitado        │
└─────────────────────────────────────────┘

Ventajas:
✅ Más económico (una sola BD)
✅ Backups centralizados
✅ Queries multi-tenant fáciles
✅ Migraciones simplificadas

Consideraciones:
⚠️ Índices en empresa_id en todas las tablas
⚠️ RLS estricto para seguridad
⚠️ Monitoring de performance
```

### Arquitectura de Subdominios

```
┌──────────────────────────────────────────────┐
│          tudominio.com (Landing)             │
│          Marketing del servicio ERP          │
└──────────────────────────────────────────────┘

┌──────────────────────────────────────────────┐
│      admin.tudominio.com (Super Admin)       │
│   Panel administrativo del proveedor         │
│   - Gestión de empresas                      │
│   - Facturación y cobros                     │
│   - Monitoreo y métricas                     │
└──────────────────────────────────────────────┘

┌──────────────────────────────────────────────┐
│    empresa1.tudominio.com (Cliente 1)        │
│    Sistema ERP completo para Cliente 1       │
└──────────────────────────────────────────────┘

┌──────────────────────────────────────────────┐
│    empresa2.tudominio.com (Cliente 2)        │
│    Sistema ERP completo para Cliente 2       │
└──────────────────────────────────────────────┘

Middleware Next.js:
- Detecta subdominio de la request
- Carga configuración de empresa
- Aplica branding personalizado
- Valida estado de la empresa
```

---

## 📋 MÓDULOS DEL SISTEMA

### A. MÓDULOS DEL ERP (Para clientes)

#### 1️⃣ **Empresas & Sucursales**
- CRUD de empresas
- Hasta 99 sucursales por empresa
- Inventario independiente por sucursal
- Configuración: moneda, IVA, datos fiscales
- Logo y branding personalizado

#### 2️⃣ **Usuarios & Roles**
- Sistema de roles configurable
- 6 roles predefinidos:
  1. Administrador General
  2. Gerente de Sucursal
  3. Vendedor
  4. Contador
  5. Soporte
  6. Dirección
- Permisos granulares (CRUD por módulo)
- Auditoría de accesos

#### 3️⃣ **Productos & Inventario**
- CRUD de productos
- Categorías personalizables
- Códigos de barras únicos globalmente
- Stock independiente por sucursal
- Múltiples unidades de medida
- Precios por tipo de cliente
- Imágenes múltiples
- Transferencias entre sucursales
- Valuación PEPS/UEPS/Promedio
- Generador de códigos de barras

#### 4️⃣ **Facturación Electrónica**
- Integración Facturama API
- CFDI 4.0
- Credenciales encriptadas por empresa
- Timbrado automático
- XML/PDF descargables
- Notas de crédito
- Cancelaciones
- Complementos de pago

#### 5️⃣ **Punto de Venta (PDV)**
- Sistema de 3 turnos configurables
- Apertura/cierre de turno
- Corte de caja por usuario y caja
- Búsqueda por código de barras
- Múltiples métodos de pago
- Facturación directa desde PDV
- Devoluciones
- Impresión de tickets
- **Modo Offline**

#### 6️⃣ **Configuración General**
- Moneda por empresa/sucursal
- IVA parametrizable
- Descuentos especiales con autorización
- Descuentos promocionales con vigencia

#### 7️⃣ **Reportes**
- Ventas por período/sucursal/vendedor
- Inventario y movimientos
- Productos con stock bajo
- Facturación y cobranza
- Rotación de productos
- Rentabilidad
- Auditoría de usuarios
- Exportación Excel/PDF

#### 8️⃣ **Seguridad**
- Autenticación multi-empresa
- Encriptación de credenciales
- Auditoría completa
- Logs de acceso
- Recuperación de contraseña
- Verificación de email
- Sesiones con timeout

### B. PANEL SUPER ADMINISTRATIVO (Para ti)

#### 1️⃣ **Dashboard Principal**
Métricas clave:
- Total empresas activas/prueba/suspendidas
- MRR (Monthly Recurring Revenue)
- Nuevos clientes este mes
- Tasa de churn
- Gráficas de crecimiento
- Ingresos proyectados

#### 2️⃣ **Gestión de Empresas**
- Lista de todas las empresas
- Estados: Activa, Prueba, Suspendida, Cancelada
- Detalles de uso:
  - Número de usuarios
  - Número de sucursales
  - Productos en catálogo
  - Transacciones del mes
  - Almacenamiento usado
- Límites por plan
- Habilitar/deshabilitar empresa
- Ver como empresa (impersonation)
- Logs de acceso por empresa

#### 3️⃣ **Planes y Pricing**
Configuración de planes:

**Plan Básico:**
- Hasta 3 sucursales
- Hasta 10 usuarios
- 1,000 productos
- 5,000 transacciones/mes
- 5 GB almacenamiento

**Plan Pro:**
- Hasta 20 sucursales
- Usuarios ilimitados
- 10,000 productos
- 50,000 transacciones/mes
- 20 GB almacenamiento

**Plan Enterprise:**
- Hasta 99 sucursales
- Todo ilimitado
- Soporte prioritario
- Almacenamiento extendido

#### 4️⃣ **Facturación y Cobros**
- Generación automática de facturas mensuales
- Registro de pagos
- Historial de facturación por empresa
- Recordatorios automáticos (7, 3, 1 día antes)
- Suspensión automática por falta de pago
- Integración con pasarela de pago
- Facturas propias (Facturama)

#### 5️⃣ **Sistema de Soporte**
- Tickets de soporte
- Prioridades: Baja, Media, Alta, Crítica
- Estados: Nuevo, En proceso, Resuelto, Cerrado
- Asignación a agentes de soporte
- Respuestas y conversaciones
- Base de conocimientos
- FAQ

#### 6️⃣ **Configuración Global**
- Parámetros del sistema
- Integraciones (Facturama, pagos, email)
- Templates de emails:
  - Bienvenida
  - Recordatorio de pago
  - Suspensión de cuenta
  - Factura generada
  - Recuperación de contraseña
- Términos y condiciones
- Política de privacidad

#### 7️⃣ **Analytics y Reportes**
- Empresas nuevas por mes
- Ingresos mensuales
- Tasa de retención
- Empresas que cancelaron (con razón)
- Uso promedio por empresa
- Productos más populares
- Reportes de performance del sistema

---

## 🔄 FUNCIONALIDADES ADICIONALES SUGERIDAS

### Módulos que NO están en la spec pero son importantes:

#### A. **Módulo de Compras**
**Justificación:** Un ERP sin compras está incompleto
- Órdenes de compra a proveedores
- Recepción de mercancía
- Cuentas por pagar
- Historial de compras
- Relación con inventario

#### B. **Módulo de Clientes (CRM Básico)**
**Justificación:** Necesario para facturación y lealtad
- Base de datos de clientes
- RFC para facturación
- Historial de compras por cliente
- Programa de lealtad/puntos
- Cuentas por cobrar
- Crédito a clientes
- Estados de cuenta

#### C. **Módulo de Proveedores**
**Justificación:** Complementa el módulo de compras
- Catálogo de proveedores
- Productos por proveedor
- Evaluación de proveedores
- Historial de compras

#### D. **Módulo de Gastos Operativos**
**Justificación:** Para tener contabilidad completa
- Registro de gastos (renta, luz, agua, salarios)
- Categorías de gastos
- Aprobación de gastos (workflow)
- Relación con sucursales

#### E. **Módulo de Producción/Ensambles**
**Justificación:** Mencionas "ensambles" en productos
- Productos compuestos (kits/combos)
- Recetas/BOM (Bill of Materials)
- Proceso de ensamblaje
- Costo de producción
- Descomposición de productos

#### F. **Notificaciones y Alertas**
**Justificación:** Mejorar la operación
- Stock bajo
- Productos por vencer
- Recordatorios de pagos
- Ventas importantes
- Push notifications en móvil
- Emails automáticos

---

## 📱 APP MÓVIL - ALCANCE

### Funciones Operativas (NO administrativas)

**Inventario:**
- ✅ Consulta de stock por sucursal
- ✅ Búsqueda de productos
- ✅ Escaneo de código de barras con cámara
- ✅ Registro de entradas de mercancía
- ✅ Registro de salidas
- ✅ Transferencias entre sucursales
- ✅ Ajustes de inventario
- ✅ Captura de fotos de productos

**Ventas:**
- ✅ PDV móvil simplificado
- ✅ Toma de pedidos
- ✅ Consulta de precios
- ❌ NO reportes complejos
- ❌ NO configuración

**Offline:**
- ✅ Caché de productos
- ✅ Registro de movimientos offline
- ✅ Sincronización automática
- ✅ Indicador de estado (online/offline)

---

## 🔌 INTEGRACIÓN E-COMMERCE

### Flujo de Integración

```
┌────────────────────────────────────────┐
│     Website E-commerce (Proyecto 2)    │
│                                         │
│  Usuario Público → Carrito de Compras  │
│  Usuario Empresa → Redirect a ERP      │
└─────────────┬──────────────────────────┘
              │
              │ API REST
              │
              ▼
┌────────────────────────────────────────┐
│         ERP Sistema (Proyecto 1)       │
│                                         │
│  - Sincronización de inventario        │
│  - Ventas del e-commerce → PDV         │
│  - Actualización de precios            │
│  - Catálogo de productos               │
└────────────────────────────────────────┘
```

### Endpoints API necesarios:
- `GET /api/productos` - Catálogo público
- `GET /api/productos/{id}/stock` - Consulta de disponibilidad
- `POST /api/ventas/ecommerce` - Registrar venta del sitio
- `GET /api/precios` - Sincronizar precios
- `POST /api/webhooks/pedido` - Webhook de nuevo pedido

---

## 💾 MODO OFFLINE - ESTRATEGIA

### PDV Offline

**Tecnología:**
- Service Workers
- IndexedDB
- Background Sync API

**Datos en Caché:**
- Productos del catálogo (completo)
- Precios actuales
- Stock actual
- Cliente del turno activo
- Configuración de la caja

**Sincronización:**
1. Detectar conexión perdida
2. Almacenar ventas en IndexedDB
3. Mostrar indicador "MODO OFFLINE"
4. Al recuperar internet:
   - Enviar ventas pendientes en orden
   - Resolver conflictos de stock
   - Actualizar catálogo
   - Confirmar sincronización

**Manejo de Conflictos:**
- Si dos cajas venden el mismo producto offline:
  - Última venta prevalece
  - Alertar si stock queda negativo
  - Opción de ajuste manual

---

## 🗄️ ESQUEMA DE BASE DE DATOS

Ver archivo: `02-ESQUEMA-BASE-DATOS.md`

---

## 📅 PLAN DE DESARROLLO POR FASES

Ver archivo: `03-PLAN-DESARROLLO.md`

---

## ❓ PREGUNTAS PENDIENTES

Ver archivo: `04-PREGUNTAS-PENDIENTES.md`

---

## 📊 ESTIMACIÓN DE COMPLEJIDAD

### Complejidad Alta:
- ⚠️ Sistema multi-tenant con subdominios
- ⚠️ Modo offline con sincronización
- ⚠️ Integración Facturama (CFDI 4.0)
- ⚠️ Sistema de permisos granular
- ⚠️ Facturación automática a clientes

### Complejidad Media:
- 🔶 PDV con sistema de turnos
- 🔶 Inventarios por sucursal
- 🔶 Reportes dinámicos
- 🔶 App móvil PWA

### Complejidad Baja:
- ✅ CRUD básicos
- ✅ Autenticación
- ✅ Dashboard con métricas
- ✅ Gestión de usuarios

---

**Última actualización:** Noviembre 22, 2025
