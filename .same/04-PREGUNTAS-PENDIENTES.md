# ❓ PREGUNTAS PENDIENTES PARA DEFINIR

## 🔴 CRÍTICAS (Necesarias para arrancar)

### 1. Panel Super Admin - Gestión de Clientes
- [ ] ¿Cómo se registrarán nuevas empresas?
  - Opción A: Auto-registro (las empresas se registran solas)
  - Opción B: Solo tú las creas manualmente
  - Opción C: Ambas (auto-registro + aprobación manual)

- [ ] ¿Habrá planes diferentes?
  - Básico, Pro, Enterprise
  - ¿Con qué límites específicos por plan?
  - ¿Cuánto costará cada plan?

- [ ] ¿Período de prueba gratuito?
  - ¿Cuántos días? (sugerido: 14-30 días)
  - ¿Requiere tarjeta de crédito al registrarse?

### 2. Facturación y Cobros
- [ ] ¿Cobro mensual o anual?
  - ¿O ambas opciones con descuento anual?

- [ ] ¿En qué moneda cobrarás?
  - MXN, USD, ambas?

- [ ] ¿Qué pasarela de pago?
  - Stripe (internacional)
  - OpenPay (México)
  - Conekta (México)
  - Mercado Pago
  - PayPal

- [ ] ¿Qué pasa si una empresa no paga?
  - Suspensión automática después de X días
  - Recordatorios automáticos (¿cuántos días antes?)
  - ¿Período de gracia?

### 3. Base de Datos
- [ ] ¿Confirmamos Neon PostgreSQL?
  - ¿Una BD para todas las empresas?
  - ¿O BD separadas por empresa?
  - Recomendación: BD única con RLS

### 4. Prioridades de Desarrollo
- [ ] ¿Qué desarrollamos PRIMERO?
  - Opción A: MVP del ERP (productos, PDV básico, inventario)
  - Opción B: Panel Super Admin (para gestionar clientes)
  - Opción C: Ambos en paralelo

  **Recomendación:** Primero Panel Super Admin, luego ERP

### 5. Backend & Autenticación
- [ ] ¿Usamos qué para backend?
  - Opción A: Supabase completo (Auth + DB + Storage)
  - Opción B: Neon DB + Next.js API Routes + Auth.js
  - Opción C: Neon DB + tu backend personalizado

  **Recomendación:** Neon DB + Next.js Server Actions + NextAuth

---

## 🟡 IMPORTANTES (Podemos definir pronto)

### 6. App Móvil
- [ ] ¿Funciones específicas de la app móvil?
  - Escaneo de códigos de barras ✅
  - Consulta de inventario ✅
  - Entradas/salidas de mercancía ✅
  - Transferencias entre sucursales ✅
  - ¿PDV móvil completo?
  - ¿Toma de pedidos?

- [ ] ¿Tecnología móvil?
  - PWA (más rápido de desarrollar)
  - React Native (nativa, mejor offline)

  **Recomendación:** Empezar con PWA

### 7. Módulos Adicionales
De la lista que sugerí, ¿cuáles necesitas para MVP?

- [ ] Módulo de Compras (órdenes a proveedores)
- [ ] Módulo de Clientes extendido (CRM básico)
- [ ] Módulo de Proveedores
- [ ] Módulo de Gastos Operativos
- [ ] Módulo de Producción/Ensambles
- [ ] Sistema de Notificaciones

**Recomendación para MVP:**
- ✅ Clientes (necesario para facturación)
- ✅ Proveedores básico
- ❌ Compras (fase 2)
- ❌ Gastos (fase 2)
- ❌ Producción (fase 3)

### 8. E-commerce Integration
- [ ] ¿El e-commerce es proyecto separado?
  - ¿Lo desarrollaremos después?
  - ¿Se conecta vía API REST a este ERP?

- [ ] ¿Sincronización de inventario?
  - Tiempo real o periódica
  - ¿Las ventas del e-commerce aparecen en el PDV?

---

## 🟢 PUEDEN ESPERAR (Pero ayuda definir)

### 9. Modo Offline
- [ ] ¿Prioridad del offline?
  - Alta (desde MVP)
  - Media (fase 2)
  - Baja (fase 3)

- [ ] ¿Tecnología offline?
  - Service Workers + IndexedDB
  - ¿Solo PDV o también app móvil?

### 10. Impresión
- [ ] ¿Tickets térmicos?
  - ¿Qué impresoras? (marca/modelo)
  - ¿Tamaño? (58mm, 80mm)

- [ ] ¿Etiquetas de código de barras?
  - ¿Impresora de etiquetas?
  - ¿Tamaño de etiquetas?

### 11. Integraciones Adicionales
- [ ] ¿Terminal bancaria para PDV?
  - Clip, iZettle, otro

- [ ] ¿Envío de emails?
  - SendGrid, Mailgun, Resend

- [ ] ¿Almacenamiento de archivos?
  - Supabase Storage
  - AWS S3
  - Cloudinary (para imágenes)

---

## 📝 RESPUESTAS RÁPIDAS

**Para comenzar HOY, necesito al menos:**

1. ✅ ¿Panel Super Admin primero o ERP primero?
2. ✅ ¿Pasarela de pago preferida?
3. ✅ ¿Planes de precios (al menos nombres y límites básicos)?
4. ✅ ¿Backend: Supabase o Neon + Next.js?

**Con esas 4 respuestas puedo empezar la arquitectura base.**

---

## 💡 MIS SUGERENCIAS POR DEFAULT

Si quieres que empiece YA, usaré estos defaults (luego ajustamos):

```
✅ Backend: Neon PostgreSQL + Next.js Server Actions + NextAuth
✅ Pasarela: Stripe (fácil cambiar después)
✅ Planes: Básico, Pro, Enterprise (definimos límites después)
✅ Prioridad: Panel Super Admin → luego ERP
✅ App Móvil: PWA (fase 2)
✅ Offline: Fase 2
✅ Módulos MVP: Solo lo esencial del ERP inicial
```

¿Procedemos con estos defaults o prefieres definir ahora?
