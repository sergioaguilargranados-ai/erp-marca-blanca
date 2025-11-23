import { db } from '@/lib/db'
import { empresas, clientes } from '@/lib/db/schema'
import { eq, or, ilike, and } from 'drizzle-orm'
import { redirect } from 'next/navigation'

export default async function ClientesPage({
  params,
  searchParams
}: {
  params: { id: string }
  searchParams: { q?: string; tipo?: string }
}) {
  const [empresa] = await db
    .select()
    .from(empresas)
    .where(eq(empresas.id, params.id))
    .limit(1)

  if (!empresa) {
    redirect('/admin/empresas')
  }

  // Búsqueda y filtros
  const busqueda = searchParams.q || ''
  const tipoFiltro = searchParams.tipo || ''

  // Construir condiciones
  const condiciones: any[] = [eq(clientes.empresaId, params.id)]

  if (busqueda) {
    condiciones.push(
      or(
        ilike(clientes.nombre, `%${busqueda}%`),
        ilike(clientes.email, `%${busqueda}%`),
        ilike(clientes.rfc, `%${busqueda}%`)
      )
    )
  }

  if (tipoFiltro) {
    condiciones.push(eq(clientes.tipo, tipoFiltro))
  }

  const clientesEmpresa = await db
    .select()
    .from(clientes)
    .where(and(...condiciones))
    .orderBy(clientes.nombre)

  // Estadísticas
  const totalClientes = clientesEmpresa.length
  const clientesActivos = clientesEmpresa.filter(c => c.activo).length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Clientes</h1>
          <p className="text-slate-600 mt-1">
            Base de clientes de {empresa.nombre}
          </p>
          <p className="text-sm text-slate-500 mt-1">
            {totalClientes} clientes ({clientesActivos} activos)
          </p>
        </div>
        <div className="flex gap-2">
          <a
            href={`/admin/empresas/${params.id}/clientes/nuevo`}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            + Nuevo Cliente
          </a>
          <a
            href={`/admin/empresas/${params.id}`}
            className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300"
          >
            ← Volver
          </a>
        </div>
      </div>

      {/* Filtros y búsqueda */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
        <form method="GET" className="flex gap-4">
          <div className="flex-1">
            <input
              type="text"
              name="q"
              defaultValue={busqueda}
              placeholder="Buscar por nombre, email o RFC..."
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <select
              name="tipo"
              defaultValue={tipoFiltro}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Todos los tipos</option>
              <option value="minorista">Minorista</option>
              <option value="mayorista">Mayorista</option>
              <option value="especial">Especial</option>
            </select>
          </div>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Buscar
          </button>
          {(busqueda || tipoFiltro) && (
            <a
              href={`/admin/empresas/${params.id}/clientes`}
              className="px-6 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300"
            >
              Limpiar
            </a>
          )}
        </form>
      </div>

      {/* Tabla de clientes */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Cliente
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Contacto
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                RFC
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Tipo
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
            {clientesEmpresa.map((cliente) => (
              <tr key={cliente.id} className="hover:bg-slate-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="font-medium text-slate-900">{cliente.nombre}</div>
                    {cliente.razonSocial && (
                      <div className="text-sm text-slate-500">{cliente.razonSocial}</div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm">
                    {cliente.email && (
                      <div className="text-slate-900">{cliente.email}</div>
                    )}
                    {cliente.telefono && (
                      <div className="text-slate-500">{cliente.telefono}</div>
                    )}
                    {!cliente.email && !cliente.telefono && (
                      <span className="text-slate-400">Sin contacto</span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {cliente.rfc ? (
                    <span className="text-sm font-mono text-slate-900">{cliente.rfc}</span>
                  ) : (
                    <span className="text-sm text-slate-400">Sin RFC</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    cliente.tipo === 'mayorista'
                      ? 'bg-purple-100 text-purple-800'
                      : cliente.tipo === 'especial'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {cliente.tipo}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    cliente.activo
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {cliente.activo ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end gap-2">
                    <a href={`/admin/empresas/${params.id}/clientes/${cliente.id}`} className="text-blue-600 hover:text-blue-900">
                      Ver
                    </a>
                    <a href={`/admin/empresas/${params.id}/clientes/${cliente.id}/editar`} className="text-emerald-600 hover:text-emerald-900">
                      Editar
                    </a>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {clientesEmpresa.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">👥</div>
            <p className="text-slate-500 mb-4">
              {busqueda || tipoFiltro ? 'No se encontraron clientes' : 'No hay clientes registrados'}
            </p>
            {!busqueda && !tipoFiltro && (
              <a
                href={`/admin/empresas/${params.id}/clientes/nuevo`}
                className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Crear Primer Cliente
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
