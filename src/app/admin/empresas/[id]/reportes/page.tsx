import { db } from '@/lib/db'
import { empresas, ventas, detallesVenta, productos, inventario, sucursales } from '@/lib/db/schema'
import { eq, desc, sql, and, lte, gte } from 'drizzle-orm'
import { redirect } from 'next/navigation'

export default async function ReportesPage({
  params,
  searchParams
}: {
  params: { id: string }
  searchParams: { periodo?: string }
}) {
  const [empresa] = await db
    .select()
    .from(empresas)
    .where(eq(empresas.id, params.id))
    .limit(1)

  if (!empresa) {
    redirect('/admin/empresas')
  }

  // Calcular rango de fechas según período
  const ahora = new Date()
  let fechaDesde = new Date()
  const periodo = searchParams.periodo || 'mes'

  switch (periodo) {
    case 'hoy':
      fechaDesde.setHours(0, 0, 0, 0)
      break
    case 'semana':
      fechaDesde.setDate(ahora.getDate() - 7)
      break
    case 'mes':
      fechaDesde.setDate(ahora.getDate() - 30)
      break
    case 'trimestre':
      fechaDesde.setMonth(ahora.getMonth() - 3)
      break
    case 'año':
      fechaDesde.setFullYear(ahora.getFullYear() - 1)
      break
  }

  // Obtener ventas del período
  const ventasPeriodo = await db
    .select()
    .from(ventas)
    .where(and(
      eq(ventas.empresaId, params.id),
      eq(ventas.estado, 'completada'),
      gte(ventas.createdAt, fechaDesde)
    ))

  // Calcular métricas de ventas
  const totalVentas = ventasPeriodo.length
  const montoTotalVentas = ventasPeriodo.reduce((sum, v) => sum + Number(v.total), 0)
  const promedioVenta = totalVentas > 0 ? montoTotalVentas / totalVentas : 0

  // Ventas por método de pago
  const ventasEfectivo = ventasPeriodo.filter(v => v.metodoPago === 'efectivo')
  const ventasTarjeta = ventasPeriodo.filter(v => v.metodoPago === 'tarjeta')
  const ventasTransferencia = ventasPeriodo.filter(v => v.metodoPago === 'transferencia')

  const montoEfectivo = ventasEfectivo.reduce((sum, v) => sum + Number(v.total), 0)
  const montoTarjeta = ventasTarjeta.reduce((sum, v) => sum + Number(v.total), 0)
  const montoTransferencia = ventasTransferencia.reduce((sum, v) => sum + Number(v.total), 0)

  // Productos más vendidos
  const productosVendidos = await db
    .select({
      producto: productos,
      totalVendido: sql<number>`SUM(CAST(${detallesVenta.cantidad} AS INTEGER))`.as('total_vendido'),
      montoTotal: sql<number>`SUM(CAST(${detallesVenta.total} AS DECIMAL))`.as('monto_total'),
    })
    .from(detallesVenta)
    .innerJoin(ventas, eq(detallesVenta.ventaId, ventas.id))
    .innerJoin(productos, eq(detallesVenta.productoId, productos.id))
    .where(and(
      eq(ventas.empresaId, params.id),
      eq(ventas.estado, 'completada'),
      gte(ventas.createdAt, fechaDesde)
    ))
    .groupBy(productos.id, productos.nombre, productos.codigoBarras, productos.precioVentaMinorista)
    .orderBy(desc(sql`SUM(CAST(${detallesVenta.cantidad} AS INTEGER))`))
    .limit(10)

  // Alertas de inventario (productos con stock bajo)
  const alertasInventario = await db
    .select({
      producto: productos,
      inventario: inventario,
      sucursal: sucursales,
    })
    .from(inventario)
    .innerJoin(productos, eq(inventario.productoId, productos.id))
    .innerJoin(sucursales, eq(inventario.sucursalId, sucursales.id))
    .where(and(
      eq(sucursales.empresaId, params.id),
      sql`${inventario.cantidadDisponible} <= ${productos.stockMinimo}`
    ))
    .limit(15)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Reportes y Análisis</h1>
          <p className="text-slate-600 mt-1">
            Métricas y estadísticas de {empresa.nombre}
          </p>
        </div>
        <div className="flex gap-2">
          <a
            href={`/admin/empresas/${params.id}`}
            className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300"
          >
            ← Volver
          </a>
        </div>
      </div>

      {/* Selector de Período */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
        <form method="GET" className="flex gap-2">
          <button
            type="submit"
            name="periodo"
            value="hoy"
            className={`px-4 py-2 rounded-lg font-medium ${
              periodo === 'hoy'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Hoy
          </button>
          <button
            type="submit"
            name="periodo"
            value="semana"
            className={`px-4 py-2 rounded-lg font-medium ${
              periodo === 'semana'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            7 días
          </button>
          <button
            type="submit"
            name="periodo"
            value="mes"
            className={`px-4 py-2 rounded-lg font-medium ${
              periodo === 'mes'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            30 días
          </button>
          <button
            type="submit"
            name="periodo"
            value="trimestre"
            className={`px-4 py-2 rounded-lg font-medium ${
              periodo === 'trimestre'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            3 meses
          </button>
          <button
            type="submit"
            name="periodo"
            value="año"
            className={`px-4 py-2 rounded-lg font-medium ${
              periodo === 'año'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            1 año
          </button>
        </form>
      </div>

      {/* Métricas de Ventas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center gap-3">
            <div className="text-4xl">💰</div>
            <div>
              <div className="text-3xl font-bold">${montoTotalVentas.toFixed(2)}</div>
              <div className="text-blue-100">Total Vendido</div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center gap-3">
            <div className="text-4xl">🛒</div>
            <div>
              <div className="text-3xl font-bold">{totalVentas}</div>
              <div className="text-green-100">Ventas Realizadas</div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center gap-3">
            <div className="text-4xl">📊</div>
            <div>
              <div className="text-3xl font-bold">${promedioVenta.toFixed(2)}</div>
              <div className="text-purple-100">Promedio por Venta</div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center gap-3">
            <div className="text-4xl">📦</div>
            <div>
              <div className="text-3xl font-bold">{productosVendidos.length}</div>
              <div className="text-orange-100">Productos Activos</div>
            </div>
          </div>
        </div>
      </div>

      {/* Ventas por Método de Pago */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">💳 Ventas por Método de Pago</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium text-slate-700">Efectivo</span>
              <span className="text-sm font-semibold text-green-600">
                {totalVentas > 0 ? ((ventasEfectivo.length / totalVentas) * 100).toFixed(1) : 0}%
              </span>
            </div>
            <div className="bg-slate-100 rounded-full h-3 mb-2">
              <div
                className="bg-green-500 h-3 rounded-full"
                style={{ width: `${totalVentas > 0 ? (ventasEfectivo.length / totalVentas) * 100 : 0}%` }}
              />
            </div>
            <div className="text-sm text-slate-600">
              {ventasEfectivo.length} ventas • ${montoEfectivo.toFixed(2)}
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium text-slate-700">Tarjeta</span>
              <span className="text-sm font-semibold text-blue-600">
                {totalVentas > 0 ? ((ventasTarjeta.length / totalVentas) * 100).toFixed(1) : 0}%
              </span>
            </div>
            <div className="bg-slate-100 rounded-full h-3 mb-2">
              <div
                className="bg-blue-500 h-3 rounded-full"
                style={{ width: `${totalVentas > 0 ? (ventasTarjeta.length / totalVentas) * 100 : 0}%` }}
              />
            </div>
            <div className="text-sm text-slate-600">
              {ventasTarjeta.length} ventas • ${montoTarjeta.toFixed(2)}
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium text-slate-700">Transferencia</span>
              <span className="text-sm font-semibold text-purple-600">
                {totalVentas > 0 ? ((ventasTransferencia.length / totalVentas) * 100).toFixed(1) : 0}%
              </span>
            </div>
            <div className="bg-slate-100 rounded-full h-3 mb-2">
              <div
                className="bg-purple-500 h-3 rounded-full"
                style={{ width: `${totalVentas > 0 ? (ventasTransferencia.length / totalVentas) * 100 : 0}%` }}
              />
            </div>
            <div className="text-sm text-slate-600">
              {ventasTransferencia.length} ventas • ${montoTransferencia.toFixed(2)}
            </div>
          </div>
        </div>
      </div>

      {/* Productos Más Vendidos */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200">
        <div className="p-6 border-b border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900">🏆 Top 10 Productos Más Vendidos</h3>
        </div>
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                #
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Producto
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                Unidades Vendidas
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                Monto Total
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {productosVendidos.map((item, index) => (
              <tr key={item.producto.id} className="hover:bg-slate-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-900">
                  {index + 1}
                </td>
                <td className="px-6 py-4">
                  <div className="font-medium text-slate-900">{item.producto.nombre}</div>
                  {item.producto.codigoBarras && (
                    <div className="text-xs text-slate-500 font-mono">{item.producto.codigoBarras}</div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-semibold text-blue-600">
                  {item.totalVendido}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-semibold text-green-600">
                  ${Number(item.montoTotal).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {productosVendidos.length === 0 && (
          <div className="text-center py-12 text-slate-500">
            No hay datos de ventas en este período
          </div>
        )}
      </div>

      {/* Alertas de Inventario */}
      {alertasInventario.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg">
          <div className="p-6 border-b border-red-200">
            <h3 className="text-lg font-semibold text-red-900">⚠️ Alertas de Inventario ({alertasInventario.length})</h3>
            <p className="text-sm text-red-700 mt-1">Productos con stock bajo o agotado</p>
          </div>
          <div className="divide-y divide-red-100">
            {alertasInventario.slice(0, 5).map(({ producto, inventario: inv, sucursal }) => (
              <div key={`${producto.id}-${inv.id}`} className="p-4 hover:bg-red-100">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="font-medium text-red-900">{producto.nombre}</div>
                    <div className="text-sm text-red-700">{sucursal.nombre}</div>
                  </div>
                  <div className="text-right">
                    <div className={`text-lg font-bold ${
                      inv.cantidadDisponible === 0 ? 'text-red-600' : 'text-orange-600'
                    }`}>
                      {inv.cantidadDisponible} disponibles
                    </div>
                    <div className="text-xs text-red-600">
                      Mínimo: {producto.stockMinimo || 0}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {alertasInventario.length > 5 && (
              <div className="p-4 text-center">
                <a
                  href={`/admin/empresas/${params.id}/inventario?alerta=bajo`}
                  className="text-sm text-red-600 hover:text-red-700 font-medium"
                >
                  Ver todas las alertas ({alertasInventario.length})
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
