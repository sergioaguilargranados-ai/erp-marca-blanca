import { db } from '@/lib/db'
import { empresas, roles, permisos } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'
import { redirect } from 'next/navigation'

export default async function RolesEmpresaPage({ params }: { params: { id: string } }) {
  const [empresa] = await db
    .select()
    .from(empresas)
    .where(eq(empresas.id, params.id))
    .limit(1)

  if (!empresa) {
    redirect('/admin/empresas')
  }

  const rolesEmpresa = await db
    .select()
    .from(roles)
    .where(eq(roles.empresaId, params.id))
    .orderBy(roles.esPredefinido, roles.nombre)

  // Contar permisos por rol
  const rolesConPermisos = await Promise.all(
    rolesEmpresa.map(async (rol) => {
      const permisosRol = await db
        .select()
        .from(permisos)
        .where(and(
          eq(permisos.rolId, rol.id),
          eq(permisos.permitido, true)
        ))

      return {
        ...rol,
        permisosCount: permisosRol.length
      }
    })
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Roles y Permisos</h1>
          <p className="text-slate-600 mt-1">
            Gestiona los roles de {empresa.nombre}
          </p>
          <p className="text-sm text-slate-500 mt-1">
            {rolesConPermisos.length} roles configurados
          </p>
        </div>
        <div className="flex gap-2">
          <a
            href={`/admin/empresas/${params.id}/roles/nuevo`}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            + Nuevo Rol
          </a>
          <a
            href={`/admin/empresas/${params.id}`}
            className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300"
          >
            ← Volver
          </a>
        </div>
      </div>

      {/* Roles Predefinidos */}
      <div>
        <h2 className="text-xl font-semibold text-slate-900 mb-4">
          Roles Predefinidos del Sistema
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rolesConPermisos.filter(r => r.esPredefinido).map((rol) => (
            <div
              key={rol.id}
              className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border-2 border-blue-200 p-6"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">{rol.nombre}</h3>
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded mt-1 inline-block">
                    Predefinido
                  </span>
                </div>
                <span
                  className={`px-2 py-1 text-xs font-semibold rounded ${
                    rol.activo
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {rol.activo ? 'Activo' : 'Inactivo'}
                </span>
              </div>

              <p className="text-sm text-slate-600 mb-4">
                {rol.descripcion || 'Sin descripción'}
              </p>

              <div className="flex items-center gap-2 text-sm text-slate-700 mb-4 pb-4 border-b border-blue-200">
                <span className="text-blue-600">🔐</span>
                <span>{rol.permisosCount} permisos asignados</span>
              </div>

              <div className="flex gap-2">
                <a
                  href={`/admin/empresas/${params.id}/roles/${rol.id}`}
                  className="flex-1 text-center px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
                >
                  Ver Permisos
                </a>
              </div>
            </div>
          ))}
        </div>

        {rolesConPermisos.filter(r => r.esPredefinido).length === 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <p className="text-yellow-800 font-semibold mb-2">
              ⚠️ No hay roles predefinidos
            </p>
            <p className="text-yellow-700 text-sm mb-3">
              Esta empresa no tiene los 6 roles predefinidos del sistema. Estos se crean automáticamente al aprobar una empresa.
            </p>
            <button
              className="px-4 py-2 bg-yellow-600 text-white text-sm rounded-lg hover:bg-yellow-700"
            >
              Crear Roles Predefinidos
            </button>
          </div>
        )}
      </div>

      {/* Roles Personalizados */}
      <div>
        <h2 className="text-xl font-semibold text-slate-900 mb-4">
          Roles Personalizados
        </h2>

        {rolesConPermisos.filter(r => !r.esPredefinido).length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rolesConPermisos.filter(r => !r.esPredefinido).map((rol) => (
              <div
                key={rol.id}
                className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-semibold text-slate-900">{rol.nombre}</h3>
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded ${
                      rol.activo
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {rol.activo ? 'Activo' : 'Inactivo'}
                  </span>
                </div>

                <p className="text-sm text-slate-600 mb-4">
                  {rol.descripcion || 'Sin descripción'}
                </p>

                <div className="flex items-center gap-2 text-sm text-slate-700 mb-4 pb-4 border-b border-slate-200">
                  <span className="text-purple-600">🔐</span>
                  <span>{rol.permisosCount} permisos asignados</span>
                </div>

                <div className="flex gap-2">
                  <a
                    href={`/admin/empresas/${params.id}/roles/${rol.id}`}
                    className="flex-1 text-center px-3 py-2 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700"
                  >
                    Ver
                  </a>
                  <a
                    href={`/admin/empresas/${params.id}/roles/${rol.id}/editar`}
                    className="flex-1 text-center px-3 py-2 bg-slate-200 text-slate-700 text-sm rounded-lg hover:bg-slate-300"
                  >
                    Editar
                  </a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg border-2 border-dashed border-slate-300">
            <p className="text-slate-500 mb-4">No hay roles personalizados</p>
            <a
              href={`/admin/empresas/${params.id}/roles/nuevo`}
              className="inline-block px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              Crear Rol Personalizado
            </a>
          </div>
        )}
      </div>
    </div>
  )
}
