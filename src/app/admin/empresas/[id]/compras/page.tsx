import { db } from '@/lib/db'
import { empresas, ordenesCompra, proveedores } from '@/lib/db/schema'
import { eq, desc, and, or, ilike } from 'drizzle-orm'
import { redirect } from 'next/navigation'

export default async function ComprasPage({
  params,
  searchParams
}: {
  params: { id: string }
  searchParams: { q?: string; estado?: string; proveedor?: string }
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
  const conditions = [eq(ordenesCompra.empresaId, params.id)]

  if (searchParams.q) {
    conditions.push(ilike(ordenesCompra.folio, `%${searchParams.q}%`))
  }

  if (searchParams.estado && searchParams.estado !== 'all') {
    conditions.push(eq(ordenesCompra.estado, searchParams.estado))
  }

  if (searchParams.proveedor) {
    conditions.push(eq(ordenesCompra.proveedorId, searchParams.proveedor))
  }

  // Obtener órdenes de compra
  const ordenesList = await db
    .select({
      orden: ordenesCompra,
      proveedor: proveedores,
    })
    .from(ordenesCompra)
    .leftJoin(proveedores, eq(ordenesCompra.proveedorId, proveedores.id))
    .where(conditions.length > 1 ? and(...conditions) : conditions[0])
    .orderBy(desc(ordenesCompra.createdAt))

  // Obtener proveedores para filtro
  const proveedoresList = await db
    .select()
    .from(proveedores)
    .where(eq(proveedores.empresaId, params.id))
    .orderBy(proveedores.nombre)

  // Estadísticas
  const totalOrdenes = ordenesList.length
  const totalComprado = ordenesList.reduce((sum, o) => sum + Number(o.orden.total), 0)
  const ordenesPendientes = ordenesList.filter(o => o.orden.estado === 'borrador' || o.orden.estado === 'enviada').length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Órdenes de Compra</h1>
          <p className="text-slate-600 mt-1">
            Gestión de compras de {empresa.nombre}
          </p>
        </div>
        <div className="flex gap-2">
          <a
            href={`/admin/empresas/${params.id}/compras/nueva`}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            + Nueva Orden de Compra
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
            <div className="text-4xl">📋</div>
            <div>
              <div className="text-2xl font-bold text-slate-900">{totalOrdenes}</div>
              <div className="text-sm text-slate-600">Total Órdenes</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <div className="flex items-center gap-3">
            <div className="text-4xl">💰</div>
            <div>
              <div className="text-2xl font-bold text-green-600">${totalComprado.toFixed(2)}</div>
              <div className="text-sm text-slate-600">Total Comprado</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <div className="flex items-center gap-3">
            <div className="text-4xl">⏰</div>
            <div>
              <div className="text-2xl font-bold text-orange-600">{ordenesPendientes}</div>
              <div className="text-sm text-slate-600">Pendientes</div>
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
              placeholder="Buscar por folio..."
              className="w-full px-4 py-2 border border-slate-300 rounded-lg"
            />
          </div>
          <select
            name="proveedor"
            defaultValue={searchParams.proveedor || ''}
            className="px-4 py-2 border border-slate-300 rounded-lg"
          >
            <option value="">Todos los proveedores</option>
            {proveedoresList.map(p => (
              <option key={p.id} value={p.id}>{p.nombre}</option>
            ))}
          </select>
          <select
            name="estado"
            defaultValue={searchParams.estado || 'all'}
            className="px-4 py-2 border border-slate-300 rounded-lg"
          >
            <option value="all">Todos</option>
            <option value="borrador">Borrador</option>
            <option value="enviada">Enviada</option>
            <option value="recibida_parcial">Recibida Parcial</option>
            <option value="recibida">Recibida</option>
            <option value="cancelada">Cancelada</option>
          </select>
          <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Buscar
          </button>
        </form>
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Folio</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Proveedor</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Fecha</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase">Total</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Estado</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {ordenesList.map(({ orden, proveedor }) => (
              <tr key={orden.id} className="hover:bg-slate-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-mono font-medium text-slate-900">
                  {orden.folio}
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-slate-900">{proveedor?.nombre || 'N/A'}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                  {new Date(orden.fechaOrden).toLocaleDateString('es-MX')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-semibold text-slate-900">
                  ${Number(orden.total).toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    orden.estado === 'recibida' ? 'bg-green-100 text-green-800' :
                    orden.estado === 'enviada' ? 'bg-blue-100 text-blue-800' :
                    orden.estado === 'cancelada' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {orden.estado}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                  <a href={`/admin/empresas/${params.id}/compras/${orden.id}`} className="text-blue-600 hover:text-blue-900">
                    Ver
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {ordenesList.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📋</div>
            <p className="text-slate-500 mb-4">No hay órdenes de compra</p>
            <a
              href={`/admin/empresas/${params.id}/compras/nueva`}
              className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Crear Primera Orden
            </a>
          </div>
        )}
      </div>
    </div>
  )
}
