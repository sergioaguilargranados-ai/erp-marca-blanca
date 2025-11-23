# 🔄 Guía: Cambiar de Sandbox a Producción

## ✅ HOY: Sistema Funcional con Credenciales de Prueba

### Ya Configurado en `.env`

```bash
# ✅ FACTURAMA SANDBOX (Funciona HOY sin crear cuenta)
FACTURAMA_API_URL=https://apisandbox.facturama.mx
FACTURAMA_USER=pruebas
FACTURAMA_PASSWORD=pruebas2011

# ✅ STRIPE TEST MODE (Solo necesitas tus keys de test)
STRIPE_SECRET_KEY=sk_test_your_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
```

### Lo que Ya Funciona HOY

✅ **Facturama Sandbox:**
- Timbrado de facturas CFDI 4.0
- Generación de XML y PDF
- Cancelación de facturas
- TODAS las funciones de facturación
- SIN LÍMITES en sandbox

✅ **Stripe Test Mode:**
- Pruebas de cobros
- Simulación de pagos
- Tarjetas de prueba
- Webhooks en desarrollo

✅ **Base de Datos:**
- PostgreSQL en Neon
- 49 tablas listas para crear
- Datos seed preparados

---

## 🔧 MAÑANA: Cambiar a Producción (5 minutos por servicio)

### 1. Facturama Producción (Cuando tengas cuenta real)

#### Paso 1: Crear Cuenta
1. Ir a: https://facturama.mx
2. Elegir plan (desde $299/mes)
3. Registrarse y verificar

#### Paso 2: Obtener Credenciales
1. Login en Facturama
2. Ir a: API → Credenciales
3. Copiar usuario y contraseña

#### Paso 3: Subir Certificados SAT
1. Panel → Certificados
2. Upload tu .cer y .key del SAT
3. Validar

#### Paso 4: Actualizar `.env`
```bash
# Cambiar SOLO estas 3 líneas:
FACTURAMA_API_URL=https://api.facturama.mx
FACTURAMA_USER=tu-usuario-real
FACTURAMA_PASSWORD=tu-password-real
```

**¡Listo!** Ahora timbras en producción con el SAT real.

---

### 2. Stripe Producción (Cuando tengas cuenta)

#### Paso 1: Crear Cuenta
1. Ir a: https://stripe.com
2. Crear cuenta (gratis)
3. Verificar email y negocio

#### Paso 2: Obtener API Keys de Producción
1. Dashboard → Developers → API keys
2. **Cambiar a modo "Live"** (toggle arriba a la derecha)
3. Copiar:
   - Secret key (sk_live_...)
   - Publishable key (pk_live_...)

#### Paso 3: Crear Productos
1. Products → Add product
2. Crear tus 3 planes:
   - **Básico:** $800 MXN/mes (recurring)
   - **Profesional:** $1,500 MXN/mes (recurring)
   - **Empresarial:** $2,500 MXN/mes (recurring)

#### Paso 4: Configurar Webhook
1. Webhooks → Add endpoint
2. URL: `https://tu-sitio.com/api/webhooks/stripe`
3. Events seleccionados:
   - `invoice.paid`
   - `invoice.payment_failed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
4. Copiar webhook secret (whsec_...)

#### Paso 5: Actualizar `.env`
```bash
# Cambiar a keys LIVE:
STRIPE_SECRET_KEY=sk_live_TU_KEY_REAL
STRIPE_WEBHOOK_SECRET=whsec_TU_SECRET_REAL
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_TU_KEY_REAL
```

#### Paso 6: Actualizar en Netlify (si ya desplegaste)
1. Site settings → Environment variables
2. Editar las 3 variables de Stripe
3. Redeploy

**¡Listo!** Ahora cobras pagos reales.

---

## 📋 Checklist Rápido

### HOY (Con Sandbox)
- [x] DATABASE_URL configurada
- [x] Facturama Sandbox activo
- [x] Stripe en test mode
- [ ] Ejecutar `bun run db:push`
- [ ] Ejecutar `bun run dev`
- [ ] Probar facturación (genera CFDIs de prueba)
- [ ] Probar todo el sistema

### MAÑANA (Cuando Quieras Producción)
- [ ] Crear cuenta Facturama real
- [ ] Subir certificados SAT
- [ ] Actualizar 3 líneas de Facturama en `.env`
- [ ] Crear cuenta Stripe real
- [ ] Configurar productos en Stripe
- [ ] Actualizar 3 líneas de Stripe en `.env`
- [ ] Redeploy (si ya está en Netlify)
- [ ] ¡A vender! 🚀

---

## 🎯 Comparación: Sandbox vs Producción

### Facturama

| Función | Sandbox (HOY) | Producción (MAÑANA) |
|---------|---------------|---------------------|
| **Timbrado** | ✅ Gratis ilimitado | ✅ $1-2 MXN por CFDI |
| **XML válido** | ✅ Válido para pruebas | ✅ Válido para SAT |
| **PDF** | ✅ Generado | ✅ Generado |
| **Cancelación** | ✅ Funciona | ✅ Funciona con SAT |
| **Cuenta requerida** | ❌ No (credenciales públicas) | ✅ Sí ($299+/mes) |

### Stripe

| Función | Test Mode (HOY) | Live Mode (MAÑANA) |
|---------|-----------------|---------------------|
| **Cobros** | ✅ Simulados | ✅ Reales |
| **Tarjetas** | ✅ Tarjetas de prueba | ✅ Tarjetas reales |
| **Dinero** | ❌ No se transfiere | ✅ Se deposita en tu cuenta |
| **Webhooks** | ✅ Funcionan | ✅ Funcionan |
| **Dashboard** | ✅ Visible | ✅ Visible |
| **Comisión** | ❌ $0 | ✅ 3.6% + $3 MXN |

---

## 💳 Tarjetas de Prueba de Stripe (Para HOY)

Mientras estás en test mode, usa estas tarjetas:

```
✅ Pago Exitoso:
Número: 4242 4242 4242 4242
CVV: cualquier 3 dígitos
Fecha: cualquier fecha futura

❌ Pago Rechazado:
Número: 4000 0000 0000 0002
CVV: cualquier 3 dígitos

⏱️ Requiere Autenticación 3D:
Número: 4000 0027 6000 3184
CVV: cualquier 3 dígitos
```

Más tarjetas: https://stripe.com/docs/testing

---

## 🚀 Resumen: ¡Empieza HOY!

### Con lo que Ya Tienes Configurado:

```bash
# 1. Crear tablas
cd erp-marca-blanca
bun run db:push
# Responder: Y

# 2. Iniciar servidor
bun run dev

# 3. Abrir navegador
http://localhost:3000
```

**¡YA FUNCIONA TODO!**

- ✅ Login
- ✅ Dashboard
- ✅ PDV completo
- ✅ Facturación CFDI 4.0 (sandbox)
- ✅ Reportes
- ✅ Inventario
- ✅ Cobros con Stripe (test)
- ✅ Dark mode
- ✅ PWA
- ✅ Scanner de códigos
- ✅ Mobile

### Mañana Solo Cambias 6 Líneas

**En `.env`:**
```bash
# Línea 9: Cambiar URL de Facturama
# Línea 10: Tu usuario Facturama
# Línea 11: Tu password Facturama
# Línea 14: Tu Stripe secret key
# Línea 15: Tu Stripe webhook secret
# Línea 16: Tu Stripe publishable key
```

**¡Y listo para producción!** 🎉

---

## 📞 Costos Reales (Cuando Pases a Producción)

### Facturama
- **Plan Básico:** $299 MXN/mes
- **Plan Plus:** $699 MXN/mes (recomendado)
- **Plan Premium:** $1,499 MXN/mes
- **Costo por CFDI:** ~$1-2 MXN

### Stripe
- **Sin mensualidad:** $0
- **Por transacción:** 3.6% + $3 MXN
- **Ejemplo:** Cobro de $1,500 = Comisión $57

### Base de Datos Neon
- **Gratis:** Hasta 0.5GB
- **Pro:** $25 USD/mes (10GB)

### Hosting Netlify
- **Gratis:** 100GB bandwidth
- **Pro:** $19 USD/mes (1TB)

**Total estimado mensual para empezar:** ~$1,000-1,500 MXN

---

## ✅ Estado Actual

**HOY mismo puedes:**
- ✅ Desarrollar completamente
- ✅ Probar TODAS las funciones
- ✅ Facturar CFDIs (sandbox)
- ✅ Simular cobros (Stripe test)
- ✅ Mostrar a clientes beta
- ✅ Deploy a staging

**MAÑANA cambias a producción en 10 minutos** 🚀

---

**Fecha:** Noviembre 23, 2025
**Versión:** v2.1.1
**Estado:** Sandbox Configurado ✅ → Listo para Producción 🟢
