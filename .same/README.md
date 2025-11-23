# 📚 DOCUMENTACIÓN ERP MARCA BLANCA

## 🎯 Proyecto
Sistema ERP SaaS Multi-Tenant de marca blanca para rentar con costo mensual.

## 📖 Documentos Disponibles

### 1. **01-ANALISIS-PROYECTO.md**
Análisis completo del proyecto incluyendo:
- Visión y objetivos
- Arquitectura propuesta (multi-tenant, subdominios)
- Módulos del ERP
- Panel Super Administrativo
- Funcionalidades sugeridas
- Integraciones (e-commerce, app móvil)
- Modo offline

### 2. **02-ESQUEMA-BASE-DATOS.md** ⏳
Esquema completo de base de datos con:
- 40+ tablas
- Tablas super administrativas
- Tablas del ERP por empresa
- Row Level Security (RLS)

### 3. **03-PLAN-DESARROLLO.md**
Plan de desarrollo por fases:
- 11 Fases de desarrollo
- 35 Sprints estimados
- 8 meses de desarrollo
- MVP mínimo identificado (4 meses)
- Roadmap visual

### 4. **04-PREGUNTAS-PENDIENTES.md** ⏳
Preguntas organizadas por prioridad para definir:
- Alta: Panel admin, facturación, BD, stack técnico
- Media: App móvil, módulos adicionales, e-commerce
- Baja: Offline, impresión, compliance

## 🚀 Stack Tecnológico Definido

- **Frontend:** Next.js 14+ + React 18 + TypeScript
- **UI:** shadcn/ui + TailwindCSS
- **Base de Datos:** Neon PostgreSQL
- **Móvil:** PWA (inicial) → React Native (opcional)

## ⚠️ Pendiente de Definir

Para comenzar el desarrollo necesitamos que definas:

1. ✅ Arquitectura de BD (Single DB o DB per tenant)
2. ✅ Backend (Supabase, Custom, o Híbrido)
3. ✅ Prioridad de desarrollo
4. ✅ Planes de suscripción y precios
5. ✅ Pasarela de pago

## 📁 Estructura del Proyecto

```
erp-marca-blanca/
├── .same/              # Documentación y wikis
├── src/
│   ├── app/           # Next.js App Router
│   └── lib/           # Utilidades
├── components/        # Componentes React
└── public/           # Assets estáticos
```

## 🎨 Características Principales

- ✅ White Label completo
- ✅ Subdominios personalizados
- ✅ Multi-empresa (hasta 99 sucursales)
- ✅ Multi-moneda
- ✅ Facturación CFDI 4.0 (Facturama)
- ✅ PDV con sistema de turnos
- ✅ Modo offline
- ✅ App móvil
- ✅ Integración e-commerce

---

**Última actualización:** Noviembre 22, 2025
