import { db } from '@/lib/db'
import { empresas, empleados, sucursales } from '@/lib/db/schema'
import { eq, desc, or, ilike, and } from 'drizzle-orm'
import { redirect } from 'next/navigation'

export default async function EmpleadosPage({
  params,
  searchParams
}: {
  params: { id: string }
  searchParams: { q?: string; activo?: string; sucursal?: string }
}) {
  const [empresa] = await db
    .select()
    .from(empresas)
    .where(eq(empresas.id, params.id))
    .limit(1)

  if (!empresa) {
    redirect('/admin/empresas')
  }

  // Construir condiciones
  const conditions = [eq(empleados.empresaId, params.id)]

  if (searchParams.q) {
    conditions.push(
      or(
        ilike(empleados.nombre, `%${searchParams.q}%`),
        ilike(empleados.numeroEmpleado, `%${searchParams.q}%`),
        ilike(empleados.puesto, `%${searchParams.q}%`)
      )!
    )
  }

  if (searchParams.activo === 'true') {
    conditions.push(eq(empleados.activo, true))
  } else if (searchParams.activo === 'false') {
    conditions.push(eq(empleados.activo, false))
  }

  if (searchParams.sucursal) {
    conditions.push(eq(empleados.sucursalId, searchParams.sucursal))
  }

  // Obtener empleados
  const empleadosList = await db
    .select({
      empleado: empleados,
      sucursal: sucursales,
    })
    .from(empleados)
    .leftJoin(sucursales, eq(empleados.sucursalId, sucursales.id))
    .where(conditions.length > 1 ? and(...conditions) : conditions[0])
    .orderBy(desc(empleados.createdAt))

  // Obtener sucursales para filtro
  const sucursalesList = await db
    .select()
    .from(sucursales)
    .where(eq(sucursales.empresaId, params.id))
    .orderBy(sucursales.nombre)

  // Estadísticas
  const totalEmpleados = empleadosList.length
  const empleadosActivos = empleadosList.filter(e => e.empleado.activo).length
  const empleadosInactivos = totalEmpleados - empleadosActivos

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Empleados</h1>
          <p className="text-slate-600 mt-1">
            Gestión de empleados de {empresa.nombre}
          </p>
        </div>
        <div className="flex gap-2">
          <a
            href={`/admin/empresas/${params.id}/empleados/nuevo`}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            + Nuevo Empleado
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
            <div className="text-4xl">👥</div>
            <div>
              <div className="text-2xl font-bold text-slate-900">{totalEmpleados}</div>
              <div className="text-sm text-slate-600">Total Empleados</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <div className="flex items-center gap-3">
            <div className="text-4xl">✅</div>
            <div>
              <div className="text-2xl font-bold text-green-600">{empleadosActivos}</div>
              <div className="text-sm text-slate-600">Activos</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <div className="flex items-center gap-3">
            <div className="text-4xl">❌</div>
            <div>
              <div className="text-2xl font-bold text-red-600">{empleadosInactivos}</div>
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
              placeholder="Buscar por nombre, número o puesto..."
              className="w-full px-4 py-2 border border-slate-300 rounded-lg"
            />
          </div>
          <select
            name="sucursal"
            defaultValue={searchParams.sucursal || ''}
            className="px-4 py-2 border border-slate-300 rounded-lg"
          >
            <option value="">Todas las sucursales</option>
            {sucursalesList.map(s => (
              <option key={s.id} value={s.id}>{s.nombre}</option>
            ))}
          </select>
          <select
            name="activo"
            defaultValue={searchParams.activo || 'all'}
            className="px-4 py-2 border border-slate-300 rounded-lg"
          >
            <option value="all">Todos</option>
            <option value="true">Activos</option>
            <option value="false">Inactivos</option>
          </select>
          <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Buscar
          </button>
        </form>
      </div>

      {/* Tabla de Empleados */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                Empleado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                Puesto
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                Sucursal
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                Contacto
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                Estado
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {empleadosList.map(({ empleado, sucursal }) => (
              <tr key={empleado.id} className="hover:bg-slate-50">
                <td className="px-6 py-4">
                  <div className="font-medium text-slate-900">
                    {empleado.nombre} {empleado.apellidoPaterno}
                  </div>
                  {empleado.numeroEmpleado && (
                    <div className="text-sm text-slate-500 font-mono">
                      #{empleado.numeroEmpleado}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-slate-900">{empleado.puesto || 'Sin asignar'}</div>
                  {empleado.departamento && (
                    <div className="text-xs text-slate-500">{empleado.departamento}</div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                  {sucursal?.nombre || 'Sin asignar'}
                </td>
                <td className="px-6 py-4">
                  {empleado.telefono && (
                    <div className="text-sm text-slate-900">{empleado.telefono}</div>
                  )}
                  {empleado.email && (
                    <div className="text-sm text-slate-500">{empleado.email}</div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    empleado.activo
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {empleado.activo ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end gap-2">
                    <a
                      href={`/admin/empresas/${params.id}/empleados/${empleado.id}`}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Ver
                    </a>
                    <a
                      href={`/admin/empresas/${params.id}/empleados/${empleado.id}/editar`}
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

        {empleadosList.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">👥</div>
            <p className="text-slate-500 mb-4">
              {searchParams.q || searchParams.activo || searchParams.sucursal
                ? 'No se encontraron empleados con los filtros aplicados'
                : 'No hay empleados registrados'
              }
            </p>
            {!searchParams.q && !searchParams.activo && !searchParams.sucursal && (
              <a
                href={`/admin/empresas/${params.id}/empleados/nuevo`}
                className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Registrar Primer Empleado
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
