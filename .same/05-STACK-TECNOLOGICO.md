# 🛠️ STACK TECNOLÓGICO COMPLETO

## 📐 ARQUITECTURA GENERAL

```
┌─────────────────────────────────────────────────────┐
│                  FRONTEND (Next.js)                  │
│  ┌──────────────┐  ┌──────────────┐  ┌───────────┐ │
│  │ Super Admin  │  │ ERP Clientes │  │ E-commerce│ │
│  │ admin.dom.com│  │empresa1.d.com│  │ tienda.*  │ │
│  └──────────────┘  └──────────────┘  └───────────┘ │
└─────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────┐
│          BACKEND (Next.js API Routes)               │
│  ┌──────────┐  ┌──────────┐  ┌──────────────────┐  │
│  │ Server   │  │   API    │  │   Webhooks       │  │
│  │ Actions  │  │  Routes  │  │ (Stripe, etc.)   │  │
│  └──────────┘  └──────────┘  └──────────────────┘  │
└─────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────┐
│        SERVICIOS EXTERNOS & BASE DE DATOS           │
│  ┌──────────┐  ┌──────────┐  ┌──────────────────┐  │
│  │   Neon   │  │NextAuth  │  │   Cloudinary     │  │
│  │PostgreSQL│  │   Auth   │  │    (Imágenes)    │  │
│  └──────────┘  └──────────┘  └──────────────────┘  │
│  ┌──────────┐  ┌──────────┐  ┌──────────────────┐  │
│  │  Stripe  │  │  Mercado │  │   Facturama      │  │
│  │   Pagos  │  │   Pago   │  │   (CFDI 4.0)     │  │
│  └──────────┘  └──────────┘  └──────────────────┘  │
│  ┌──────────┐  ┌──────────┐  ┌──────────────────┐  │
│  │  OpenAI  │  │ WhatsApp │  │     Resend       │  │
│  │ Chatbot  │  │Business  │  │     (Email)      │  │
│  └──────────┘  └──────────┘  └──────────────────┘  │
└─────────────────────────────────────────────────────┘
```

---

## 🎨 FRONTEND

### Core Framework
```json
{
  "next": "^14.2.0",
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "typescript": "^5.3.0"
}
```

### UI & Styling
```json
{
  "tailwindcss": "^3.3.2",
  "@tailwindcss/forms": "^0.5.7",
  "shadcn/ui": "latest",
  "lucide-react": "^0.294.0",
  "class-variance-authority": "^0.7.0",
  "clsx": "^2.0.0",
  "tailwind-merge": "^2.0.0"
}
```

### State Management
```json
{
  "zustand": "^4.4.7",
  "@tanstack/react-query": "^5.8.0"
}
```
- **Zustand:** Estado global simple y rápido
- **React Query:** Cache de datos, sincronización server

### Forms & Validation
```json
{
  "react-hook-form": "^7.48.2",
  "zod": "^3.22.4",
  "@hookform/resolvers": "^3.3.2"
}
```

### Charts & Visualización
```json
{
  "recharts": "^2.10.0",
  "date-fns": "^2.30.0"
}
```

### PWA & Offline
```json
{
  "next-pwa": "^5.6.0",
  "idb": "^8.0.0",
  "workbox-window": "^7.0.0"
}
```
- **next-pwa:** Configuración automática de Service Workers
- **idb:** IndexedDB wrapper para caché local
- **workbox:** Estrategias de caché offline

---

## ⚙️ BACKEND

### Next.js Features
- **App Router** (Next.js 14+)
- **Server Actions** para mutaciones
- **API Routes** para endpoints REST
- **Middleware** para multi-tenancy (detección subdominio)

### Database Client
```json
{
  "@neondatabase/serverless": "^0.9.0",
  "drizzle-orm": "^0.29.0",
  "drizzle-kit": "^0.20.0"
}
```
- **Drizzle ORM:** TypeScript-first, excelente con Neon
- **Alternativa:** Prisma (más popular pero menos performante)

**¿Por qué Drizzle?**
- ✅ Serverless-friendly (Neon optimizado)
- ✅ TypeScript nativo
- ✅ Queries SQL directos cuando necesites
- ✅ Migrations automáticas
- ✅ Mejor performance que Prisma

### Autenticación
```json
{
  "next-auth": "^5.0.0",
  "@auth/drizzle-adapter": "^0.7.0",
  "bcryptjs": "^2.4.3",
  "jose": "^5.1.0"
}
```
- **NextAuth v5 (Auth.js):** Multi-provider, sessions, JWT
- **Soporte:** Email/Password, OAuth (Google, etc.)

### Encriptación
```json
{
  "crypto-js": "^4.2.0"
}
```
- Para credenciales Facturama encriptadas

---

## 💾 BASE DE DATOS

### Neon PostgreSQL

**Conexión:**
```typescript
import { neon } from '@neondatabase/serverless'

const sql = neon(process.env.DATABASE_URL!)
```

**Row Level Security (RLS):**
```sql
-- Habilitar RLS en todas las tablas multi-tenant
ALTER TABLE productos ENABLE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation ON productos
  USING (empresa_id = current_setting('app.empresa_id')::uuid);
```

**Backups:**
- Neon ofrece backups automáticos
- Configurar retención de 7 días (gratis)
- Para 90 días: implementar sistema propio

---

## 💳 PAGOS

### Stripe
```json
{
  "stripe": "^14.7.0",
  "@stripe/stripe-js": "^2.2.0"
}
```

**Funcionalidades:**
- Suscripciones recurrentes (mensual/anual)
- Webhooks para eventos de pago
- Customer Portal para gestión de suscripción
- Multi-currency (MXN, USD)

### Mercado Pago
```json
{
  "mercadopago": "^2.0.0"
}
```

**Funcionalidades:**
- Alternativa para mercado LATAM
- Checkout Pro
- Webhooks de notificación

---

## 🧾 FACTURACIÓN ELECTRÓNICA

### Facturama API
```json
{
  "axios": "^1.6.2"
}
```

**Integración:**
- API REST de Facturama
- CFDI 4.0
- Timbrado automático
- Webhooks para actualización de estado

**Endpoints:**
```
POST /api/3/cfdis
GET /api/3/cfdis/{id}
DELETE /api/3/cfdis/{id} (cancelación)
```

---

## 📧 EMAILS

### Resend
```json
{
  "resend": "^2.1.0",
  "@react-email/components": "^0.0.12"
}
```

**¿Por qué Resend?**
- ✅ Diseñado para Next.js
- ✅ Templates React
- ✅ 3,000 emails gratis/mes
- ✅ Excelente deliverability

**Templates necesarios:**
- Bienvenida
- Verificación de email
- Recordatorio de pago
- Factura generada
- Suspensión de cuenta
- Recuperación de contraseña

---

## 🖼️ STORAGE DE IMÁGENES

### Cloudinary
```json
{
  "cloudinary": "^1.41.0",
  "next-cloudinary": "^5.11.0"
}
```

**¿Por qué Cloudinary?**
- ✅ Optimización automática de imágenes
- ✅ Transformaciones on-the-fly
- ✅ CDN global
- ✅ 25GB gratis/mes
- ✅ Upload widget React

**Uso:**
- Logos de empresas
- Imágenes de productos
- Fotos de inventario desde móvil

---

## 🤖 CHATBOT IA

### OpenAI API
```json
{
  "openai": "^4.20.0"
}
```

**Modelo recomendado:**
- **GPT-4-turbo** para soporte complejo
- **GPT-3.5-turbo** para respuestas rápidas

**Funcionalidades:**
- Chat en vivo con IA
- Respuestas desde base de conocimientos
- Integración con tickets de soporte

### WhatsApp Business API
```json
{
  "@whiskeysockets/baileys": "^6.5.0"
}
```
**Alternativas:**
- **Twilio WhatsApp API** (más fácil, de pago)
- **Baileys** (gratis, más complejo)

---

## 📱 PWA & OFFLINE

### Service Workers
```javascript
// next.config.js
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
})

module.exports = withPWA({
  // config
})
```

### IndexedDB (Caché Local)
```typescript
import { openDB } from 'idb'

const db = await openDB('erp-offline', 1, {
  upgrade(db) {
    db.createObjectStore('productos')
    db.createObjectStore('ventas')
    db.createObjectStore('clientes')
    db.createObjectStore('inventario')
  },
})
```

### Sincronización
```typescript
// Background Sync API
if ('serviceWorker' in navigator && 'sync' in registration) {
  registration.sync.register('sync-ventas')
}
```

---

## 🖨️ IMPRESIÓN

### Tickets Térmicos
```json
{
  "jspdf": "^2.5.1",
  "html2canvas": "^1.4.1"
}
```

**Opciones:**
1. **PDF + Print API** (navegador)
2. **ESC/POS commands** (impresoras térmicas directas)

### Códigos de Barras
```json
{
  "jsbarcode": "^3.11.5",
  "react-barcode": "^1.4.6"
}
```

**Formatos soportados:**
- EAN-13
- CODE128
- QR Code

---

## 📊 REPORTES

### Excel Export
```json
{
  "xlsx": "^0.18.5",
  "exceljs": "^4.4.0"
}
```

### PDF Export
```json
{
  "jspdf": "^2.5.1",
  "jspdf-autotable": "^3.8.2"
}
```

---

## 🔐 SEGURIDAD

### Rate Limiting
```json
{
  "@upstash/ratelimit": "^1.0.0",
  "@upstash/redis": "^1.25.0"
}
```

### CSRF Protection
- Next.js tiene protección nativa en Server Actions

### Helmet (Headers de seguridad)
```json
{
  "helmet": "^7.1.0"
}
```

---

## 📦 UTILIDADES

### General
```json
{
  "lodash": "^4.17.21",
  "dayjs": "^1.11.10",
  "uuid": "^9.0.1",
  "nanoid": "^5.0.4"
}
```

### Validación
```json
{
  "validator": "^13.11.0"
}
```

### Testing (Opcional para después)
```json
{
  "vitest": "^1.0.0",
  "playwright": "^1.40.0",
  "@testing-library/react": "^14.1.2"
}
```

---

## 🌍 MULTI-TENANT

### Middleware de Subdominio
```typescript
// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const hostname = request.headers.get('host')
  const subdomain = hostname?.split('.')[0]

  if (subdomain === 'admin') {
    // Panel Super Admin
    return NextResponse.rewrite(new URL('/admin', request.url))
  }

  // ERP de empresa
  const response = NextResponse.next()
  response.headers.set('x-tenant', subdomain)
  return response
}
```

---

## 📱 E-COMMERCE (Parte del mismo proyecto)

### Componentes específicos
```json
{
  "@stripe/stripe-js": "^2.2.0",
  "swiper": "^11.0.5",
  "react-image-gallery": "^1.3.0"
}
```

### Shopping Cart
```typescript
// Zustand store para carrito
import create from 'zustand'
import { persist } from 'zustand/middleware'

export const useCartStore = create(
  persist(
    (set) => ({
      items: [],
      addItem: (item) => set((state) => ({
        items: [...state.items, item]
      })),
      // ...
    }),
    { name: 'cart-storage' }
  )
)
```

---

## 🚀 DEPLOYMENT

### Plataforma Recomendada: Vercel
```json
{
  "vercel": "^32.5.0"
}
```

**¿Por qué Vercel?**
- ✅ Creadores de Next.js
- ✅ Edge Functions
- ✅ Serverless perfecto para Next.js
- ✅ Subdominios ilimitados
- ✅ SSL automático

**Alternativas:**
- **Netlify** (bueno pero menos optimizado para Next.js)
- **Railway** (si necesitas más control)

### Variables de Entorno
```env
# Database
DATABASE_URL=postgresql://...neon.tech/...

# Auth
NEXTAUTH_SECRET=...
NEXTAUTH_URL=https://tudominio.com

# Stripe
STRIPE_PUBLIC_KEY=pk_...
STRIPE_SECRET_KEY=sk_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Mercado Pago
MP_PUBLIC_KEY=...
MP_ACCESS_TOKEN=...

# Facturama
FACTURAMA_API_URL=https://api.facturama.mx
FACTURAMA_USER=...
FACTURAMA_PASSWORD=...

# Cloudinary
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...

# OpenAI
OPENAI_API_KEY=sk-...

# Resend
RESEND_API_KEY=re_...

# WhatsApp (si usas Twilio)
TWILIO_ACCOUNT_SID=...
TWILIO_AUTH_TOKEN=...
TWILIO_WHATSAPP_NUMBER=whatsapp:+...
```

---

## 📊 MONITOREO

### Analytics
```json
{
  "@vercel/analytics": "^1.1.1",
  "@vercel/speed-insights": "^1.0.2"
}
```

### Error Tracking
```json
{
  "@sentry/nextjs": "^7.85.0"
}
```

### Logs
```json
{
  "pino": "^8.16.2",
  "pino-pretty": "^10.2.3"
}
```

---

## 🎯 RESUMEN DEL STACK

| Categoría | Tecnología |
|-----------|-----------|
| **Framework** | Next.js 14 + React 18 + TypeScript |
| **UI** | shadcn/ui + TailwindCSS |
| **Database** | Neon PostgreSQL + Drizzle ORM |
| **Auth** | NextAuth.js v5 |
| **State** | Zustand + React Query |
| **Forms** | React Hook Form + Zod |
| **Pagos** | Stripe + Mercado Pago |
| **Facturación** | Facturama API |
| **Storage** | Cloudinary |
| **Emails** | Resend |
| **Chatbot** | OpenAI GPT-4 |
| **WhatsApp** | Twilio WhatsApp API |
| **PWA** | next-pwa + Service Workers |
| **Offline** | IndexedDB (idb) |
| **Deploy** | Vercel |
| **Monitoring** | Sentry + Vercel Analytics |

---

## ✅ VENTAJAS DE ESTE STACK

1. ✅ **Todo TypeScript** - Type safety completo
2. ✅ **Serverless** - Escala automáticamente
3. ✅ **Developer Experience** - Rápido de desarrollar
4. ✅ **Performance** - Edge computing, CDN global
5. ✅ **Moderno** - Últimas tecnologías 2024-2025
6. ✅ **Económico** - Tiers gratuitos generosos
7. ✅ **Documentación** - Excelente en todos los servicios

---

**Última actualización:** Noviembre 22, 2025
