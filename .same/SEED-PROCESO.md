# 🌱 Población de Base de Datos - Guía Rápida

## Paso 1: Crear Tablas
```bash
bun run db:push
```
Crea las 49 tablas del sistema.

## Paso 2: Datos Básicos
```bash
bun run db:seed
```
Crea:
- 3 Planes de suscripción
- 1 Empresa Demo
- 6 Roles y permisos
- 1 Usuario admin (admin@demo.com / demo123)

## Paso 3: Datos de Ejemplo
```bash
bun run db:seed-demo
```
Crea:
- 3 Sucursales
- 6 Categorías
- 12 Productos
- 36 Registros de inventario
- 6 Clientes
- 3 Proveedores
- 7 Cajas
- ~90 Ventas de últimos 30 días

## Total: ~400+ registros para demostración
