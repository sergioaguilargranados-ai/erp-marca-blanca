import { db } from '@/lib/db'
import { empresas, roles, permisos } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'
import { redirect } from 'next/navigation'

// Módulos del sistema
const modulos = [
  { id: 'productos', nombre: 'Productos', icon: '📦' },
  { id: 'inventario', nombre: 'Inventario', icon: '📊' },
  { id: 'ventas', nombre: 'Ventas / PDV', icon: '🛒' },
  { id: 'compras', nombre: 'Compras', icon: '🛍️' },
  { id: 'clientes', nombre: 'Clientes', icon: '👥' },
  { id: 'proveedores', nombre: 'Proveedores', icon: '🏭' },
  { id: 'facturacion', nombre: 'Facturación', icon: '🧾' },
  { id: 'reportes', nombre: 'Reportes', icon: '📈' },
  { id: 'configuracion', nombre: 'Configuración', icon: '⚙️' },
  { id: 'usuarios', nombre: 'Usuarios', icon: '👤' },
  { id: 'sucursales', nombre: 'Sucursales', icon: '🏢' },
]

const acciones = [
  { id: 'crear', nombre: 'Crear', icon: '➕' },
  { id: 'leer', nombre: 'Leer', icon: '👁️' },
  { id: 'actualizar', nombre: 'Editar', icon: '✏️' },
  { id: 'eliminar', nombre: 'Eliminar', icon: '🗑️' },
]

export default async function RolDetallesPage({
  params
}: {
  params: { id: string; rolId: string }
}) {
  const [rolData] = await db
    .select({
      rol: roles,
      empresa: empresas,
    })
    .from(roles)
    .leftJoin(empresas, eq(roles.empresaId, empresas.id))
    .where(and(
      eq(roles.id, params.rolId),
      eq(roles.empresaId, params.id)
    ))
    .limit(1)

  if (!rolData || !rolData.rol) {
    redirect(`/admin/empresas/${params.id}/roles`)
  }

  const { rol, empresa } = rolData

  // Obtener permisos del rol
  const permisosRol = await db
    .select()
    .from(permisos)
    .where(eq(permisos.rolId, params.rolId))

  // Crear mapa de permisos para fácil consulta
  const permisosMap: Record<string, boolean> = {}
  permisosRol.forEach(p => {
    if (p.permitido) {
      permisosMap[`${p.modulo}_${p.accion}`] = true
    }
  })

  const permisosTotal = permisosRol.filter(p => p.permitido).length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-slate-900">{rol.nombre}</h1>
            <span className={`px-3 py-1 text-sm font-semibold rounded-full border ${
              rol.activo
                ? 'bg-green-100 text-green-800 border-green-200'
                : 'bg-red-100 text-red-800 border-red-200'
            }`}>
              {rol.activo ? 'Activo' : 'Inactivo'}
            </span>
            {rol.esPredefinido && (
              <span className="px-3 py-1 text-sm font-semibold rounded-full bg-blue-100 text-blue-800 border border-blue-200">
                Predefinido
              </span>
            )}
          </div>
          <p className="text-slate-600">{empresa?.nombre}</p>
          {rol.descripcion && (
            <p className="text-sm text-slate-500 mt-1">{rol.descripcion}</p>
          )}
        </div>
        <div className="flex gap-2">
          {!rol.esPredefinido && (
            <a
              href={`/admin/empresas/${params.id}/roles/${params.rolId}/editar`}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              Editar
            </a>
          )}
          <a
            href={`/admin/empresas/${params.id}/roles`}
            className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300"
          >
            ← Volver
          </a>
        </div>
      </div>

      {/* Resumen */}
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
        <div className="flex items-center gap-4">
          <div className="text-4xl">🔐</div>
          <div>
            <div className="text-2xl font-bold text-purple-900">{permisosTotal}</div>
            <div className="text-sm text-purple-700">Permisos asignados de {modulos.length * acciones.length} posibles</div>
          </div>
        </div>
      </div>

      {/* Matriz de Permisos */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">
          Matriz de Permisos
        </h3>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="sticky left-0 z-10 bg-slate-50 px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider border-r border-slate-200">
                  Módulo
                </th>
                {acciones.map((accion) => (
                  <th key={accion.id} className="px-6 py-3 text-center text-xs font-medium text-slate-500 uppercase tracking-wider">
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-lg">{accion.icon}</span>
                      <span>{accion.nombre}</span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {modulos.map((modulo) => {
                const tieneAlgunPermiso = acciones.some(a => permisosMap[`${modulo.id}_${a.id}`])

                return (
                  <tr key={modulo.id} className={tieneAlgunPermiso ? 'bg-purple-50' : 'hover:bg-slate-50'}>
                    <td className="sticky left-0 z-10 bg-white px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 border-r border-slate-200">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{modulo.icon}</span>
                        <span>{modulo.nombre}</span>
                      </div>
                    </td>
                    {acciones.map((accion) => {
                      const key = `${modulo.id}_${accion.id}`
                      const tienePermiso = permisosMap[key] || false

                      return (
                        <td key={key} className="px-6 py-4 whitespace-nowrap text-center">
                          {tienePermiso ? (
                            <span className="inline-flex items-center justify-center w-6 h-6 bg-green-100 text-green-700 rounded-full">
                              ✓
                            </span>
                          ) : (
                            <span className="inline-flex items-center justify-center w-6 h-6 bg-slate-100 text-slate-400 rounded-full">
                              −
                            </span>
                          )}
                        </td>
                      )
                    })}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Información adicional */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <h3 className="font-semibold text-slate-900 mb-4">Información</h3>
        <dl className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <dt className="text-xs text-slate-500 uppercase mb-1">Tipo</dt>
            <dd className="text-sm font-medium text-slate-900">
              {rol.esPredefinido ? 'Rol Predefinido del Sistema' : 'Rol Personalizado'}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-slate-500 uppercase mb-1">Creado</dt>
            <dd className="text-sm font-medium text-slate-900">
              {new Date(rol.createdAt).toLocaleDateString('es-MX')}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-slate-500 uppercase mb-1">Última actualización</dt>
            <dd className="text-sm font-medium text-slate-900">
              {new Date(rol.updatedAt).toLocaleDateString('es-MX')}
            </dd>
          </div>
        </dl>
      </div>

      {/* Acciones */}
      {!rol.esPredefinido && (
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <h3 className="font-semibold text-slate-900 mb-4">Acciones</h3>
          <div className="flex gap-3">
            <a
              href={`/admin/empresas/${params.id}/roles/${params.rolId}/editar`}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              Editar Permisos
            </a>
            {rol.activo ? (
              <button className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700">
                Desactivar Rol
              </button>
            ) : (
              <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                Activar Rol
              </button>
            )}
            <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
              Eliminar Rol
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
