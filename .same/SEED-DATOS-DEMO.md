# 🌱 Guía de Población de Base de Datos

**Última actualización:** Noviembre 23, 2025

---

## 📊 Resumen de Scripts de Seed

El sistema tiene **2 scripts de seed** para poblar la base de datos:

### 1. **Seed Básico** (`db:seed`)
Crea la estructura fundamental del sistema.

### 2. **Seed Demo** (`db:seed-demo`)
Crea datos de ejemplo realistas para demostración.

---

## 🚀 Proceso de Instalación Completa

### Paso 1️⃣: Crear Tablas en la Base de Datos

```bash
cd erp-marca-blanca
bun run db:push
```

**¿Qué hace?**
- Crea las 49 tablas del sistema en Neon PostgreSQL
- Ejecuta migraciones pendientes
- Configura índices y relaciones

**Tiempo:** ~2 minutos

**Cuando pregunte:** `Do you want to execute changes?`
**Responder:** `Y` (yes)

---

### Paso 2️⃣: Ejecutar Seed Básico

```bash
bun run db:seed
```

**¿Qué crea?**

#### ✅ Planes de Suscripción (3)
- **Básico**: 1 sucursal, 5 usuarios, 1,000 productos
- **Profesional**: 5 sucursales, 15 usuarios, 10,000 productos
- **Empresarial**: 99 sucursales, 999 usuarios, 999,999 productos

#### ✅ Empresa Demo (1)
- Nombre: "Empresa Demo"
- Subdominio: demo
- Estado: Activa
- Plan: Profesional
- Periodo de prueba: 30 días

#### ✅ Roles Predefinidos (6)
1. **Super Administrador** - Acceso total al sistema
2. **Administrador** - Gestión completa de empresa
3. **Gerente** - Operaciones de sucursal
4. **Vendedor** - Ventas y clientes
5. **Cajero** - Punto de venta y caja
6. **Almacenista** - Inventario y transferencias

#### ✅ Permisos por Rol (~50)
- Matriz completa de permisos
- Módulos: empresas, planes, sucursales, usuarios, productos, ventas, inventario, reportes, etc.

#### ✅ Usuario Administrador (1)
- **Email:** admin@demo.com
- **Password:** demo123
- **Rol:** Administrador
- **Estado:** Activo

**Tiempo:** ~30 segundos

---

### Paso 3️⃣: Ejecutar Seed Demo

```bash
bun run db:seed-demo
```

**¿Qué crea?**

#### 🏢 Sucursales (3)
1. **Sucursal Centro** (Matriz)
   - Código: CENTRO
   - Ubicación: Av. Juárez 123, Centro Histórico, CDMX
   - Teléfono: 55-1234-5678

2. **Sucursal Norte**
   - Código: NORTE
   - Ubicación: Av. Insurgentes Norte 456, CDMX
   - Teléfono: 55-2345-6789

3. **Sucursal Sur**
   - Código: SUR
   - Ubicación: Calz. Tlalpan 789, CDMX
   - Teléfono: 55-3456-7890

#### 📁 Categorías (6)
- Electrónica
- Computadoras
- Accesorios
- Audio
- Oficina
- Redes

#### 📦 Productos (12)

**Computadoras:**
- Laptop HP 15-dw3000 - $12,999
- Laptop Dell Inspiron 15 - $18,999

**Electrónica:**
- Mouse Logitech MX Master 3 - $1,299
- Teclado Mecánico Corsair K95 - $2,499

**Audio:**
- Audífonos Sony WH-1000XM5 - $5,999
- Bocina JBL Flip 6 - $1,899

**Accesorios:**
- Hub USB-C 7 en 1 - $699
- Cable HDMI 2m - $149

**Oficina:**
- Silla Ergonómica - $2,999
- Escritorio Ajustable - $5,999

**Redes:**
- Router TP-Link AX3000 - $1,499
- Switch 8 puertos Gigabit - $899

#### 📊 Inventario (36 registros)
- Stock aleatorio entre 10-60 unidades
- Stock mínimo: 30% del actual
- Stock máximo: 200% del actual
- Distribuido en las 3 sucursales

#### 👥 Clientes (6)

**Personas Físicas (3):**
1. Juan Pérez García - CDMX
2. María López Hernández - CDMX
3. Carlos Ramírez Torres - CDMX
4. Ana Martínez Silva - CDMX

**Personas Morales (2):**
1. Tecnología Avanzada SA de CV - Naucalpan
2. Distribuidora del Centro SA de CV - CDMX

#### 🏭 Proveedores (3)
1. HP Inc México
2. Dell Technologies México
3. Logitech México

#### 💰 Cajas (7)
- **Sucursal Centro:** 3 cajas (CENTRO-CAJ1, CAJ2, CAJ3)
- **Sucursal Norte:** 2 cajas (NORTE-CAJ1, CAJ2)
- **Sucursal Sur:** 2 cajas (SUR-CAJ1, CAJ2)

#### 💳 Ventas (~80-100 registros)
- Últimos 30 días
- 2-4 ventas por día
- Horario: 9am - 9pm
- Métodos de pago: Efectivo, Tarjeta Crédito, Tarjeta Débito, Transferencia
- 1-3 productos por venta
- 1-3 unidades por producto
- Con IVA calculado (16%)
- Detalles completos de cada venta

**Tiempo:** ~1 minuto

---

## 📈 Resumen Total de Datos Creados

| Entidad | Cantidad | Script |
|---------|----------|--------|
| Planes | 3 | seed |
| Empresas | 1 | seed |
| Roles | 6 | seed |
| Permisos | ~50 | seed |
| Usuarios | 1 | seed |
| Sucursales | 3 | seed-demo |
| Categorías | 6 | seed-demo |
| Productos | 12 | seed-demo |
| Inventario | 36 | seed-demo |
| Clientes | 6 | seed-demo |
| Proveedores | 3 | seed-demo |
| Cajas | 7 | seed-demo |
| Métodos de Pago | 4 | seed-demo |
| Ventas | ~90 | seed-demo |
| Detalles de Venta | ~180 | seed-demo |

**Total:** ~400+ registros

---

## ✅ Checklist de Ejecución

- [ ] `bun run db:push` - Crear tablas
- [ ] `bun run db:seed` - Datos básicos (30s)
- [ ] `bun run db:seed-demo` - Datos de ejemplo (1m)
- [ ] Iniciar servidor: `bun run dev`
- [ ] Login con admin@demo.com / demo123
- [ ] Explorar el sistema con datos reales

---

## 🔑 Credenciales de Acceso

Después de ejecutar los seeds:

```
Email: admin@demo.com
Password: demo123
Rol: Administrador
Empresa: Empresa Demo
```

---

## 🎯 ¿Qué Puedes Hacer Ahora?

Con estos datos de ejemplo puedes presentar:

### ✅ Dashboard
- Ventas de los últimos 30 días
- Gráficas de tendencias
- Productos más vendidos
- Métricas por sucursal

### ✅ Punto de Venta
- Buscar productos reales
- Simular ventas
- Seleccionar clientes
- Métodos de pago

### ✅ Inventario
- Stock por sucursal
- Alertas de stock bajo
- Transferencias entre sucursales

### ✅ Reportes
- Ventas por periodo
- Productos más vendidos
- Ventas por sucursal
- Ventas por vendedor

### ✅ Gestión
- Clientes con historial
- Proveedores activos
- Productos con precios
- Sucursales operativas

---

## 🔄 Resetear Datos

Si quieres empezar de nuevo:

```bash
# CUIDADO: Esto borra TODOS los datos
bun run db:push --force

# Luego volver a ejecutar seeds
bun run db:seed
bun run db:seed-demo
```

---

## 🐛 Troubleshooting

### Error: "table already exists"
**Solución:** Las tablas ya están creadas. Salta al Paso 2.

### Error: "Empresa Demo not found"
**Solución:** Primero ejecuta `bun run db:seed` antes de `db:seed-demo`.

### Error: "Connection refused"
**Solución:** Verifica tu `DATABASE_URL` en `.env`.

### Error: "UNIQUE constraint failed"
**Solución:** Los datos ya existen. Usa `db:push --force` para resetear.

---

## 📝 Notas Importantes

1. **Orden de ejecución:** Siempre ejecutar `db:seed` ANTES que `db:seed-demo`
2. **Datos realistas:** Todos los datos son ficticios pero realistas
3. **Fechas:** Las ventas tienen fechas de los últimos 30 días
4. **Stocks:** Los inventarios son aleatorios pero coherentes
5. **Precios:** Precios de mercado aproximados en MXN

---

## 🎉 ¡Listo!

Después de ejecutar los 3 comandos tendrás un sistema completo con:
- ✅ 400+ registros de ejemplo
- ✅ Datos realistas y coherentes
- ✅ Listo para presentación
- ✅ Todas las funcionalidades visibles

**¡A presentar tu ERP!** 🚀
