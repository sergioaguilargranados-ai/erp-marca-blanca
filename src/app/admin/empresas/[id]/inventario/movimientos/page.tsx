import { db } from '@/lib/db'
import { empresas, movimientosInventario, productos, sucursales, usuarios } from '@/lib/db/schema'
import { eq, and, gte, lte, desc } from 'drizzle-orm'
import { redirect } from 'next/navigation'

export default async function MovimientosInventarioPage({
  params,
  searchParams
}: {
  params: { id: string }
  searchParams: {
    producto?: string
    sucursal?: string
    tipo?: string
    desde?: string
    hasta?: string
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

  // Obtener sucursales para filtros
  const sucursalesEmpresa = await db
    .select()
    .from(sucursales)
    .where(eq(sucursales.empresaId, params.id))

  // Construir condiciones de filtro
  const condiciones: any[] = []

  if (searchParams.producto) {
    condiciones.push(eq(movimientosInventario.productoId, searchParams.producto))
  }

  if (searchParams.sucursal) {
    condiciones.push(eq(movimientosInventario.sucursalId, searchParams.sucursal))
  }

  if (searchParams.tipo) {
    condiciones.push(eq(movimientosInventario.tipo, searchParams.tipo))
  }

  if (searchParams.desde) {
    const desde = new Date(searchParams.desde)
    desde.setHours(0, 0, 0, 0)
    condiciones.push(gte(movimientosInventario.createdAt, desde))
  }

  if (searchParams.hasta) {
    const hasta = new Date(searchParams.hasta)
    hasta.setHours(23, 59, 59, 999)
    condiciones.push(lte(movimientosInventario.createdAt, hasta))
  }

  // Obtener movimientos con joins
  const movimientos = await db
    .select({
      movimiento: movimientosInventario,
      producto: productos,
      sucursal: sucursales,
      usuario: usuarios,
    })
    .from(movimientosInventario)
    .leftJoin(productos, eq(movimientosInventario.productoId, productos.id))
    .leftJoin(sucursales, eq(movimientosInventario.sucursalId, sucursales.id))
    .leftJoin(usuarios, eq(movimientosInventario.usuarioId, usuarios.id))
    .where(condiciones.length > 0 ? and(...condiciones) : undefined)
    .orderBy(desc(movimientosInventario.createdAt))
    .limit(200)

  // Obtener producto seleccionado si hay filtro
  const productoSeleccionado = searchParams.producto
    ? await db
        .select()
        .from(productos)
        .where(eq(productos.id, searchParams.producto))
        .limit(1)
    : []

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Movimientos de Inventario</h1>
          <p className="text-slate-600 mt-1">
            Historial completo de movimientos de {empresa.nombre}
          </p>
          {productoSeleccionado[0] && (
            <p className="text-sm text-slate-500 mt-1">
              Producto: {productoSeleccionado[0].nombre}
            </p>
          )}
          <p className="text-sm text-slate-500 mt-1">
            {movimientos.length} movimientos encontrados
          </p>
        </div>
        <a
          href={`/admin/empresas/${params.id}/inventario`}
          className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300"
        >
          ← Volver
        </a>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
        <form method="GET" className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <input type="hidden" name="producto" value={searchParams.producto || ''} />

          <div>
            <label className="text-sm font-medium text-slate-700 block mb-2">
              Sucursal
            </label>
            <select
              name="sucursal"
              defaultValue={searchParams.sucursal}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg"
            >
              <option value="">Todas</option>
              {sucursalesEmpresa.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.nombre}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700 block mb-2">
              Tipo
            </label>
            <select
              name="tipo"
              defaultValue={searchParams.tipo}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg"
            >
              <option value="">Todos</option>
              <option value="entrada">Entrada</option>
              <option value="salida">Salida</option>
              <option value="venta">Venta</option>
              <option value="ajuste">Ajuste</option>
              <option value="transferencia">Transferencia</option>
            </select>
          </div>

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

          <div className="flex items-end gap-2">
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Filtrar
            </button>
            {(searchParams.sucursal || searchParams.tipo || searchParams.desde || searchParams.hasta) && (
              <a
                href={`/admin/empresas/${params.id}/inventario/movimientos${
                  searchParams.producto ? `?producto=${searchParams.producto}` : ''
                }`}
                className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300"
              >
                Limpiar
              </a>
            )}
          </div>
        </form>
      </div>

      {/* Tabla de movimientos */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Fecha
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Producto
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Sucursal
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Tipo
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                Cantidad
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                Stock Anterior
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                Stock Nuevo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Usuario
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Observaciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {movimientos.map(({ movimiento, producto, sucursal, usuario }) => (
              <tr key={movimiento.id} className="hover:bg-slate-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-slate-900">
                    {new Date(movimiento.createdAt).toLocaleDateString('es-MX')}
                  </div>
                  <div className="text-xs text-slate-500">
                    {new Date(movimiento.createdAt).toLocaleTimeString('es-MX')}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-slate-900">
                    {producto?.nombre || 'Producto eliminado'}
                  </div>
                  {producto?.codigoBarras && (
                    <div className="text-xs text-slate-500 font-mono">
                      {producto.codigoBarras}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-slate-900">
                    {sucursal?.nombre || 'N/A'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      movimiento.tipo === 'entrada'
                        ? 'bg-green-100 text-green-800'
                        : movimiento.tipo === 'salida'
                        ? 'bg-red-100 text-red-800'
                        : movimiento.tipo === 'venta'
                        ? 'bg-blue-100 text-blue-800'
                        : movimiento.tipo === 'ajuste'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-purple-100 text-purple-800'
                    }`}
                  >
                    {movimiento.tipo}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <span
                    className={`font-semibold ${
                      movimiento.cantidad > 0 ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {movimiento.cantidad > 0 ? '+' : ''}
                    {movimiento.cantidad}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <span className="text-sm text-slate-600">{movimiento.cantidadAnterior}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <span className="text-sm font-semibold text-slate-900">
                    {movimiento.cantidadNueva}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-slate-900">
                    {usuario?.nombre || 'Sistema'}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-slate-600 max-w-xs truncate">
                    {movimiento.observaciones || '-'}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {movimientos.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📋</div>
            <p className="text-slate-500 mb-4">No hay movimientos registrados</p>
          </div>
        )}
      </div>
    </div>
  )
}
