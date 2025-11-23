# 📋 PENDIENTES DE SPRINTS ANTERIORES

**Última actualización:** 22 Noviembre 2025
**Versión actual:** 21

---

## 🔴 PENDIENTES IDENTIFICADOS

### Sprint 2: Multi-Tenancy & Auth (PARCIALMENTE COMPLETADO)

#### ⏳ Funcionalidades Pospuestas:

1. **Recuperación de contraseña**
   - Email de reset de contraseña
   - Token de recuperación
   - Formulario de nueva contraseña
   - **Prioridad:** Media
   - **Estado:** No implementado

2. **Verificación de email**
   - Email de verificación al registrarse
   - Token de verificación
   - Página de confirmación
   - **Prioridad:** Media
   - **Estado:** No implementado

---

### Sprint 4: Core ERP - Sucursales y Roles (COMPLETADO CON EXCEPCIONES)

#### ⏳ Funcionalidades Pospuestas:

1. **Middleware de autorización por permisos**
   - Validación de permisos en rutas protegidas
   - Verificación de acceso por módulo y acción
   - Redirección si no tiene permisos
   - **Prioridad:** Alta (para fase de producción)
   - **Estado:** Pospuesto para fase avanzada
   - **Nota:** El sistema de permisos existe en BD, falta implementar el middleware que los valide

---

### Sprint 5: Productos e Inventario (COMPLETADO CON EXCEPCIONES)

#### ⏳ Funcionalidades Pospuestas:

1. **Gestión directa de inventario por sucursal**
   - Ver stock actual por sucursal
   - Editar stock manualmente
   - Ajustes de inventario (entrada/salida)
   - Conteo físico vs sistema
   - **Prioridad:** Alta
   - **Estado:** Pospuesto a Sprint avanzado
   - **Nota:** El inventario se actualiza automáticamente con ventas, pero falta la gestión manual

2. **Transferencias entre sucursales**
   - Solicitud de transferencia
   - Aprobación de transferencia
   - Envío y recepción
   - Actualización de inventarios de ambas sucursales
   - Registro de movimientos
   - **Prioridad:** Media-Alta
   - **Estado:** Pospuesto a Sprint avanzado

3. **Visualización de movimientos de inventario**
   - Historial completo de movimientos
   - Filtros por producto, sucursal, tipo
   - Exportar a Excel/PDF
   - Gráficas de entradas/salidas
   - **Prioridad:** Media
   - **Estado:** Pospuesto a Sprint avanzado
   - **Nota:** Los movimientos se registran en BD, falta la interfaz de visualización

---

## 🟡 TAREAS TÉCNICAS PENDIENTES

### ESLint Warnings

**Problema:** Uso de `<a>` en lugar de `<Link>` de Next.js
- **Archivos afectados:** Múltiples páginas (~20-30 links)
- **Prioridad:** Baja (solo warnings, no errores)
- **Estado:** No crítico
- **Impacto:** Rendimiento ligeramente menor en navegación

**Problema:** Uso de `any` en algunos tipos
- **Archivos afectados:** ~5-7 archivos
- **Prioridad:** Media
- **Estado:** No crítico
- **Impacto:** Type safety reducida

---

## 📊 RESUMEN DE PENDIENTES POR PRIORIDAD

### 🔴 Alta Prioridad (Para Producción)
1. **Middleware de autorización** - Sprint 4
2. **Gestión de inventario manual** - Sprint 5

### 🟡 Media-Alta Prioridad
1. **Transferencias entre sucursales** - Sprint 5
2. **Visualización de movimientos** - Sprint 5

### 🟢 Media Prioridad
1. **Recuperación de contraseña** - Sprint 2
2. **Verificación de email** - Sprint 2

### ⚪ Baja Prioridad
1. **Corregir ESLint warnings** (Links y tipos)

---

## 💡 RECOMENDACIONES

### Opción 1: Completar pendientes ANTES de Sprint 7
**Ventajas:**
- Sistema más robusto y completo
- Gestión de inventario funcional antes de turnos
- Seguridad mejorada con middleware de autorización

**Tareas sugeridas:**
1. Implementar gestión manual de inventario (2-3 horas)
2. Crear visualización de movimientos (1-2 horas)
3. Implementar middleware de autorización (2-3 horas)
4. Transferencias entre sucursales (3-4 horas)

**Tiempo estimado:** 8-12 horas de desarrollo

### Opción 2: Continuar con Sprint 7 y completar después
**Ventajas:**
- Mantener momentum del proyecto
- Sprint 7 es independiente de los pendientes
- Completar funcionalidades en orden lógico

**Consideración:**
- Los pendientes de inventario serían útiles para gestión de stock en turnos

---

## 🎯 RECOMENDACIÓN FINAL

**Sugerencia:** Implementar **primero** la gestión de inventario manual antes de continuar con Sprint 7.

**Razones:**
1. El sistema de turnos necesitará gestión de stock
2. Es una funcionalidad crítica para operación diaria
3. Tiempo de implementación razonable (2-3 horas)
4. Complementa perfectamente el sistema de ventas ya implementado

**Sprint sugerido: "Sprint 5.5" - Gestión de Inventario**
- [ ] CRUD de inventario por sucursal
- [ ] Ajustes manuales de stock
- [ ] Visualización de movimientos
- [ ] Alertas de stock mínimo
- [ ] (Opcional) Transferencias entre sucursales

**Tiempo estimado:** 4-6 horas

---

## 📝 NOTAS

- Los esquemas de BD ya están completos para todas estas funcionalidades
- Las migraciones ya ejecutadas
- Solo falta implementar las interfaces y la lógica de negocio
- El middleware de autorización puede implementarse después sin afectar funcionalidad

---

**¿Quieres completar estos pendientes antes de continuar con Sprint 7?**
