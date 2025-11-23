import { db } from '@/lib/db'
import { empresas, ventas, usuarios, clientes } from '@/lib/db/schema'
import { eq, desc, and, gte, lte, sql } from 'drizzle-orm'
import { redirect } from 'next/navigation'

export default async function VentasPage({
  params,
  searchParams
}: {
  params: { id: string }
  searchParams: {
    desde?: string
    hasta?: string
    vendedor?: string
    metodoPago?: string
  }
}) {
  const [empresa] = await db
    .select()
    .from(empresas)
    .where(eq(empresas.id, params.id))
    .limit(1)

  if (!empresa) {
    redirect('/admin/empresas')
  }

  // Obtener vendedores para filtro
  const vendedores = await db
    .select()
    .from(usuarios)
    .where(eq(usuarios.empresaId, params.id))

  // Construir filtros
  const condiciones: any[] = [eq(ventas.empresaId, params.id)]

  if (searchParams.desde) {
    const desde = new Date(searchParams.desde)
    desde.setHours(0, 0, 0, 0)
    condiciones.push(gte(ventas.createdAt, desde))
  }

  if (searchParams.hasta) {
    const hasta = new Date(searchParams.hasta)
    hasta.setHours(23, 59, 59, 999)
    condiciones.push(lte(ventas.createdAt, hasta))
  }

  if (searchParams.vendedor) {
    condiciones.push(eq(ventas.usuarioId, searchParams.vendedor))
  }

  if (searchParams.metodoPago) {
    condiciones.push(eq(ventas.metodoPago, searchParams.metodoPago))
  }

  // Obtener ventas con filtros
  const ventasEmpresa = await db
    .select({
      venta: ventas,
      usuario: usuarios,
      cliente: clientes,
    })
    .from(ventas)
    .leftJoin(usuarios, eq(ventas.usuarioId, usuarios.id))
    .leftJoin(clientes, eq(ventas.clienteId, clientes.id))
    .where(and(...condiciones))
    .orderBy(desc(ventas.createdAt))
    .limit(100)

  // Estadísticas
  const totalVentas = ventasEmpresa.length
  const totalMonto = ventasEmpresa.reduce((sum, v) => sum + Number(v.venta.total), 0)
  const ventasHoy = ventasEmpresa.filter(v => {
    const hoy = new Date().toDateString()
    return new Date(v.venta.createdAt).toDateString() === hoy
  }).length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Ventas</h1>
          <p className="text-slate-600 mt-1">
            Historial de ventas de {empresa.nombre}
          </p>
          <p className="text-sm text-slate-500 mt-1">
            {totalVentas} ventas registradas
          </p>
        </div>
        <div className="flex gap-2">
          <a
            href={`/admin/empresas/${params.id}/ventas/pdv`}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            🛒 Punto de Venta
          </a>
          <a
            href={`/admin/empresas/${params.id}`}
            className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300"
          >
            ← Volver
          </a>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
        <form method="GET" className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <label className="text-sm font-medium text-slate-700 block mb-2">
              Desde
            </label>
            <input
              type="date"
              name="desde"
              defaultValue={searchParams.desde}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700 block mb-2">
              Hasta
            </label>
            <input
              type="date"
              name="hasta"
              defaultValue={searchParams.hasta}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700 block mb-2">
              Vendedor
            </label>
            <select
              name="vendedor"
              defaultValue={searchParams.vendedor}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg"
            >
              <option value="">Todos</option>
              {vendedores.map(v => (
                <option key={v.id} value={v.id}>{v.nombre}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700 block mb-2">
              Método de Pago
            </label>
            <select
              name="metodoPago"
              defaultValue={searchParams.metodoPago}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg"
            >
              <option value="">Todos</option>
              <option value="efectivo">Efectivo</option>
              <option value="tarjeta">Tarjeta</option>
              <option value="transferencia">Transferencia</option>
            </select>
          </div>

          <div className="flex items-end gap-2">
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Filtrar
            </button>
            {(searchParams.desde || searchParams.hasta || searchParams.vendedor || searchParams.metodoPago) && (
              <a
                href={`/admin/empresas/${params.id}/ventas`}
                className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300"
              >
                Limpiar
              </a>
            )}
          </div>
        </form>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <div className="flex items-center gap-3">
            <div className="text-3xl">💰</div>
            <div>
              <div className="text-2xl font-bold text-slate-900">
                ${totalMonto.toFixed(2)}
              </div>
              <div className="text-sm text-slate-600">Total vendido</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <div className="flex items-center gap-3">
            <div className="text-3xl">📊</div>
            <div>
              <div className="text-2xl font-bold text-slate-900">{totalVentas}</div>
              <div className="text-sm text-slate-600">Total de ventas</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <div className="flex items-center gap-3">
            <div className="text-3xl">📅</div>
            <div>
              <div className="text-2xl font-bold text-slate-900">{ventasHoy}</div>
              <div className="text-sm text-slate-600">Ventas hoy</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabla de ventas */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Folio
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Fecha
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Cliente
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Vendedor
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Método de Pago
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Total
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
            {ventasEmpresa.map(({ venta, usuario, cliente }) => (
              <tr key={venta.id} className="hover:bg-slate-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm font-mono font-medium text-slate-900">
                    {venta.folio}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-slate-900">
                    {new Date(venta.createdAt).toLocaleDateString('es-MX')}
                  </div>
                  <div className="text-xs text-slate-500">
                    {new Date(venta.createdAt).toLocaleTimeString('es-MX')}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-slate-900">
                    {cliente?.nombre || venta.nombreCliente || 'Público General'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-slate-900">
                    {usuario?.nombre || 'Usuario eliminado'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    venta.metodoPago === 'efectivo'
                      ? 'bg-green-100 text-green-800'
                      : venta.metodoPago === 'tarjeta'
                      ? 'bg-blue-100 text-blue-800'
                      : venta.metodoPago === 'transferencia'
                      ? 'bg-purple-100 text-purple-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {venta.metodoPago}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-semibold text-slate-900">
                    ${Number(venta.total).toFixed(2)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    venta.estado === 'completada'
                      ? 'bg-green-100 text-green-800'
                      : venta.estado === 'cancelada'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {venta.estado}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end gap-2">
                    <a
                      href={`/admin/empresas/${params.id}/ventas/${venta.id}`}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Ver
                    </a>
                    <a
                      href={`/admin/empresas/${params.id}/ventas/${venta.id}/ticket`}
                      target="_blank"
                      className="text-green-600 hover:text-green-900"
                    >
                      Ticket
                    </a>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {ventasEmpresa.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🛒</div>
            <p className="text-slate-500 mb-4">No hay ventas registradas</p>
            <a
              href={`/admin/empresas/${params.id}/ventas/pdv`}
              className="inline-block px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Realizar Primera Venta
            </a>
          </div>
        )}
      </div>
    </div>
  )
}
