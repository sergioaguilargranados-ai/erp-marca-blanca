import { db } from '@/lib/db'
import { empresas, proveedores } from '@/lib/db/schema'
import { eq, desc, or, ilike } from 'drizzle-orm'
import { redirect } from 'next/navigation'

export default async function ProveedoresPage({
  params,
  searchParams
}: {
  params: { id: string }
  searchParams: { q?: string; activo?: string }
}) {
  const [empresa] = await db
    .select()
    .from(empresas)
    .where(eq(empresas.id, params.id))
    .limit(1)

  if (!empresa) {
    redirect('/admin/empresas')
  }

  // Construir condiciones de búsqueda
  const conditions = [eq(proveedores.empresaId, params.id)]

  if (searchParams.q) {
    conditions.push(
      or(
        ilike(proveedores.nombre, `%${searchParams.q}%`),
        ilike(proveedores.nombreComercial, `%${searchParams.q}%`),
        ilike(proveedores.rfc, `%${searchParams.q}%`)
      )!
    )
  }

  if (searchParams.activo === 'true') {
    conditions.push(eq(proveedores.activo, true))
  } else if (searchParams.activo === 'false') {
    conditions.push(eq(proveedores.activo, false))
  }

  // Obtener proveedores
  const proveedoresList = await db
    .select()
    .from(proveedores)
    .where(conditions.length > 1 ? conditions.reduce((a, b) => a && b) : conditions[0])
    .orderBy(desc(proveedores.createdAt))

  // Estadísticas
  const totalProveedores = proveedoresList.length
  const proveedoresActivos = proveedoresList.filter(p => p.activo).length
  const proveedoresInactivos = totalProveedores - proveedoresActivos

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Proveedores</h1>
          <p className="text-slate-600 mt-1">
            Gestión de proveedores de {empresa.nombre}
          </p>
        </div>
        <div className="flex gap-2">
          <a
            href={`/admin/empresas/${params.id}/proveedores/nuevo`}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            + Nuevo Proveedor
          </a>
          <a
            href={`/admin/empresas/${params.id}`}
            className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300"
          >
            ← Volver
          </a>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <div className="flex items-center gap-3">
            <div className="text-4xl">📦</div>
            <div>
              <div className="text-2xl font-bold text-slate-900">{totalProveedores}</div>
              <div className="text-sm text-slate-600">Total Proveedores</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <div className="flex items-center gap-3">
            <div className="text-4xl">✅</div>
            <div>
              <div className="text-2xl font-bold text-green-600">{proveedoresActivos}</div>
              <div className="text-sm text-slate-600">Activos</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <div className="flex items-center gap-3">
            <div className="text-4xl">❌</div>
            <div>
              <div className="text-2xl font-bold text-red-600">{proveedoresInactivos}</div>
              <div className="text-sm text-slate-600">Inactivos</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
        <form method="GET" className="flex gap-4">
          <div className="flex-1">
            <input
              type="text"
              name="q"
              defaultValue={searchParams.q || ''}
              placeholder="Buscar por nombre, RFC o nombre comercial..."
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            name="activo"
            defaultValue={searchParams.activo || 'all'}
            className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Todos</option>
            <option value="true">Activos</option>
            <option value="false">Inactivos</option>
          </select>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Buscar
          </button>
          {(searchParams.q || searchParams.activo) && (
            <a
              href={`/admin/empresas/${params.id}/proveedores`}
              className="px-6 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300"
            >
              Limpiar
            </a>
          )}
        </form>
      </div>

      {/* Tabla de Proveedores */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Proveedor
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                RFC
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Contacto
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Crédito
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {proveedoresList.map((proveedor) => (
              <tr key={proveedor.id} className="hover:bg-slate-50">
                <td className="px-6 py-4">
                  <div className="font-medium text-slate-900">{proveedor.nombre}</div>
                  {proveedor.nombreComercial && (
                    <div className="text-sm text-slate-500">{proveedor.nombreComercial}</div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {proveedor.rfc ? (
                    <span className="text-sm font-mono text-slate-900">{proveedor.rfc}</span>
                  ) : (
                    <span className="text-sm text-slate-400">Sin RFC</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  {proveedor.telefono && (
                    <div className="text-sm text-slate-900">{proveedor.telefono}</div>
                  )}
                  {proveedor.email && (
                    <div className="text-sm text-slate-500">{proveedor.email}</div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-slate-900">
                    {proveedor.diasCredito || '0'} días
                  </div>
                  <div className="text-sm text-slate-500">
                    ${Number(proveedor.limiteCredito || 0).toFixed(2)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    proveedor.activo
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {proveedor.activo ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end gap-2">
                    <a
                      href={`/admin/empresas/${params.id}/proveedores/${proveedor.id}`}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Ver
                    </a>
                    <a
                      href={`/admin/empresas/${params.id}/proveedores/${proveedor.id}/editar`}
                      className="text-green-600 hover:text-green-900"
                    >
                      Editar
                    </a>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {proveedoresList.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📦</div>
            <p className="text-slate-500 mb-4">
              {searchParams.q || searchParams.activo
                ? 'No se encontraron proveedores con los filtros aplicados'
                : 'No hay proveedores registrados'
              }
            </p>
            {!searchParams.q && !searchParams.activo && (
              <a
                href={`/admin/empresas/${params.id}/proveedores/nuevo`}
                className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Registrar Primer Proveedor
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
