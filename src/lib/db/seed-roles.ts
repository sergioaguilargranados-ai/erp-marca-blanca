import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import { roles, permisos } from './schema'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const sql = neon(process.env.DATABASE_URL!)
const db = drizzle(sql)

// Módulos del sistema
const modulos = [
  'productos',
  'inventario',
  'ventas',
  'compras',
  'clientes',
  'proveedores',
  'facturacion',
  'reportes',
  'configuracion',
  'usuarios',
  'sucursales',
]

const acciones = ['crear', 'leer', 'actualizar', 'eliminar']

// Definición de roles predefinidos con sus permisos
const rolesPredefinidos = [
  {
    nombre: 'Administrador General',
    descripcion: 'Acceso completo a todas las funcionalidades del sistema',
    permisos: modulos.flatMap(modulo =>
      acciones.map(accion => ({ modulo, accion, permitido: true }))
    ),
  },
  {
    nombre: 'Gerente de Sucursal',
    descripcion: 'Gestión completa de una sucursal específica',
    permisos: [
      // Productos: todos
      ...acciones.map(accion => ({ modulo: 'productos', accion, permitido: true })),
      // Inventario: todos
      ...acciones.map(accion => ({ modulo: 'inventario', accion, permitido: true })),
      // Ventas: todos
      ...acciones.map(accion => ({ modulo: 'ventas', accion, permitido: true })),
      // Compras: todos
      ...acciones.map(accion => ({ modulo: 'compras', accion, permitido: true })),
      // Clientes: todos
      ...acciones.map(accion => ({ modulo: 'clientes', accion, permitido: true })),
      // Proveedores: leer
      { modulo: 'proveedores', accion: 'leer', permitido: true },
      // Facturación: todos
      ...acciones.map(accion => ({ modulo: 'facturacion', accion, permitido: true })),
      // Reportes: leer
      { modulo: 'reportes', accion: 'leer', permitido: true },
      // Usuarios: leer, crear
      { modulo: 'usuarios', accion: 'leer', permitido: true },
      { modulo: 'usuarios', accion: 'crear', permitido: true },
    ],
  },
  {
    nombre: 'Vendedor',
    descripcion: 'Operación de punto de venta y atención a clientes',
    permisos: [
      // Productos: leer
      { modulo: 'productos', accion: 'leer', permitido: true },
      // Inventario: leer
      { modulo: 'inventario', accion: 'leer', permitido: true },
      // Ventas: crear, leer
      { modulo: 'ventas', accion: 'crear', permitido: true },
      { modulo: 'ventas', accion: 'leer', permitido: true },
      // Clientes: crear, leer, actualizar
      { modulo: 'clientes', accion: 'crear', permitido: true },
      { modulo: 'clientes', accion: 'leer', permitido: true },
      { modulo: 'clientes', accion: 'actualizar', permitido: true },
      // Facturación: crear, leer
      { modulo: 'facturacion', accion: 'crear', permitido: true },
      { modulo: 'facturacion', accion: 'leer', permitido: true },
    ],
  },
  {
    nombre: 'Contador',
    descripcion: 'Gestión contable y financiera',
    permisos: [
      // Productos: leer
      { modulo: 'productos', accion: 'leer', permitido: true },
      // Inventario: leer
      { modulo: 'inventario', accion: 'leer', permitido: true },
      // Ventas: leer
      { modulo: 'ventas', accion: 'leer', permitido: true },
      // Compras: todos
      ...acciones.map(accion => ({ modulo: 'compras', accion, permitido: true })),
      // Clientes: leer
      { modulo: 'clientes', accion: 'leer', permitido: true },
      // Proveedores: todos
      ...acciones.map(accion => ({ modulo: 'proveedores', accion, permitido: true })),
      // Facturación: todos
      ...acciones.map(accion => ({ modulo: 'facturacion', accion, permitido: true })),
      // Reportes: leer
      { modulo: 'reportes', accion: 'leer', permitido: true },
    ],
  },
  {
    nombre: 'Soporte',
    descripcion: 'Consulta de información para atención al cliente',
    permisos: [
      // Productos: leer
      { modulo: 'productos', accion: 'leer', permitido: true },
      // Inventario: leer
      { modulo: 'inventario', accion: 'leer', permitido: true },
      // Ventas: leer
      { modulo: 'ventas', accion: 'leer', permitido: true },
      // Clientes: leer, actualizar
      { modulo: 'clientes', accion: 'leer', permitido: true },
      { modulo: 'clientes', accion: 'actualizar', permitido: true },
    ],
  },
  {
    nombre: 'Dirección',
    descripcion: 'Visualización de reportes y métricas ejecutivas',
    permisos: [
      // Todos los módulos: solo lectura
      ...modulos.map(modulo => ({ modulo, accion: 'leer', permitido: true })),
    ],
  },
]

async function seedRoles(empresaId: string) {
  console.log(`\n🌱 Creando roles predefinidos para empresa: ${empresaId}`)

  for (const rolData of rolesPredefinidos) {
    // Crear rol
    const [nuevoRol] = await db
      .insert(roles)
      .values({
        empresaId,
        nombre: rolData.nombre,
        descripcion: rolData.descripcion,
        esPredefinido: true,
        activo: true,
      })
      .returning()

    console.log(`  ✅ Rol creado: ${rolData.nombre}`)

    // Crear permisos del rol
    await db.insert(permisos).values(
      rolData.permisos.map(permiso => ({
        rolId: nuevoRol.id,
        ...permiso,
      }))
    )

    console.log(`     └─ ${rolData.permisos.length} permisos asignados`)
  }
}

// Exportar para uso en otras partes del sistema
export { seedRoles, rolesPredefinidos }

// Si se ejecuta directamente desde línea de comandos
if (typeof require !== 'undefined' && require.main === module) {
  console.log('❌ Este script requiere un empresaId como argumento')
  console.log('Uso: bun run src/lib/db/seed-roles.ts <empresaId>')
  process.exit(1)
}
