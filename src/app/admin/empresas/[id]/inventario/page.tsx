import { db } from '@/lib/db'
import { empresas, sucursales, inventario, productos, categorias } from '@/lib/db/schema'
import { eq, and, lte, sql } from 'drizzle-orm'
import { redirect } from 'next/navigation'

export default async function InventarioPage({
  params,
  searchParams
}: {
  params: { id: string }
  searchParams: {
    sucursal?: string
    categoria?: string
    busqueda?: string
    alerta?: string
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

  // Obtener sucursales
  const sucursalesEmpresa = await db
    .select()
    .from(sucursales)
    .where(eq(sucursales.empresaId, params.id))

  // Obtener categorías
  const categoriasEmpresa = await db
    .select()
    .from(categorias)
    .where(eq(categorias.empresaId, params.id))

  // Filtro de sucursal (si no se selecciona, tomar la primera)
  const sucursalSeleccionada = searchParams.sucursal || sucursalesEmpresa[0]?.id || ''

  if (!sucursalSeleccionada) {
    return (
      <div className="max-w-2xl mx-auto mt-12">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-yellow-900 mb-2">
            ⚠️ No hay sucursales registradas
          </h2>
          <p className="text-yellow-800 mb-4">
            Debes crear al menos una sucursal para gestionar inventario.
          </p>
          <a
            href={`/admin/empresas/${params.id}/sucursales/nueva`}
            className="inline-block px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
          >
            Crear Sucursal
          </a>
        </div>
      </div>
    )
  }

  // Obtener inventario de la sucursal seleccionada con productos
  const inventarioQuery = db
    .select({
      inventario: inventario,
      producto: productos,
      categoria: categorias,
    })
    .from(inventario)
    .leftJoin(productos, eq(inventario.productoId, productos.id))
    .leftJoin(categorias, eq(productos.categoriaId, categorias.id))
    .where(eq(inventario.sucursalId, sucursalSeleccionada))
    .$dynamic()

  const inventarioSucursal = await inventarioQuery

  // Filtrar por búsqueda
  let inventarioFiltrado = inventarioSucursal
  if (searchParams.busqueda) {
    const busqueda = searchParams.busqueda.toLowerCase()
    inventarioFiltrado = inventarioFiltrado.filter(
      (item) =>
        item.producto?.nombre.toLowerCase().includes(busqueda) ||
        item.producto?.codigoBarras?.toLowerCase().includes(busqueda) ||
        item.producto?.sku?.toLowerCase().includes(busqueda)
    )
  }

  // Filtrar por categoría
  if (searchParams.categoria) {
    inventarioFiltrado = inventarioFiltrado.filter(
      (item) => item.producto?.categoriaId === searchParams.categoria
    )
  }

  // Filtrar por alerta de stock
  if (searchParams.alerta === 'bajo') {
    inventarioFiltrado = inventarioFiltrado.filter(
      (item) =>
        item.producto &&
        item.inventario.cantidadDisponible <= (item.producto.stockMinimo || 0)
    )
  }

  // Estadísticas
  const totalProductos = inventarioFiltrado.length
  const productosConStock = inventarioFiltrado.filter((i) => i.inventario.cantidadDisponible > 0).length
  const productosSinStock = inventarioFiltrado.filter((i) => i.inventario.cantidadDisponible === 0).length
  const productosStockBajo = inventarioFiltrado.filter(
    (i) => i.producto && i.inventario.cantidadDisponible > 0 && i.inventario.cantidadDisponible <= (i.producto.stockMinimo || 0)
  ).length

  const sucursalActual = sucursalesEmpresa.find((s) => s.id === sucursalSeleccionada)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Inventario</h1>
          <p className="text-slate-600 mt-1">
            Gestión de stock por sucursal de {empresa.nombre}
          </p>
          <p className="text-sm text-slate-500 mt-1">
            Sucursal: {sucursalActual?.nombre}
          </p>
        </div>
        <div className="flex gap-2">
          <a
            href={`/admin/empresas/${params.id}/inventario/ajustar`}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            ⚙️ Ajustar Stock
          </a>
          <a
            href={`/admin/empresas/${params.id}/inventario/movimientos`}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            📋 Ver Movimientos
          </a>
          <a
            href={`/admin/empresas/${params.id}/inventario/transferencias`}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            🔄 Transferencias
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <div className="flex items-center gap-3">
            <div className="text-3xl">📦</div>
            <div>
              <div className="text-2xl font-bold text-slate-900">{totalProductos}</div>
              <div className="text-sm text-slate-600">Total productos</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <div className="flex items-center gap-3">
            <div className="text-3xl">✅</div>
            <div>
              <div className="text-2xl font-bold text-green-600">{productosConStock}</div>
              <div className="text-sm text-slate-600">Con stock</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <div className="flex items-center gap-3">
            <div className="text-3xl">⚠️</div>
            <div>
              <div className="text-2xl font-bold text-yellow-600">{productosStockBajo}</div>
              <div className="text-sm text-slate-600">Stock bajo</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <div className="flex items-center gap-3">
            <div className="text-3xl">❌</div>
            <div>
              <div className="text-2xl font-bold text-red-600">{productosSinStock}</div>
              <div className="text-sm text-slate-600">Sin stock</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
        <form method="GET" className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <label className="text-sm font-medium text-slate-700 block mb-2">
              Sucursal
            </label>
            <select
              name="sucursal"
              defaultValue={sucursalSeleccionada}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg"
              onChange={(e) => (e.target as HTMLSelectElement).form?.submit()}
            >
              {sucursalesEmpresa.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.nombre}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700 block mb-2">
              Categoría
            </label>
            <select
              name="categoria"
              defaultValue={searchParams.categoria}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg"
            >
              <option value="">Todas</option>
              {categoriasEmpresa.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nombre}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700 block mb-2">
              Alerta
            </label>
            <select
              name="alerta"
              defaultValue={searchParams.alerta}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg"
            >
              <option value="">Todos</option>
              <option value="bajo">Stock bajo</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="text-sm font-medium text-slate-700 block mb-2">
              Buscar
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                name="busqueda"
                defaultValue={searchParams.busqueda}
                placeholder="Nombre, código de barras o SKU..."
                className="flex-1 px-3 py-2 border border-slate-300 rounded-lg"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Buscar
              </button>
              {(searchParams.busqueda || searchParams.categoria || searchParams.alerta) && (
                <a
                  href={`/admin/empresas/${params.id}/inventario?sucursal=${sucursalSeleccionada}`}
                  className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300"
                >
                  Limpiar
                </a>
              )}
            </div>
          </div>
        </form>
      </div>

      {/* Tabla de inventario */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Producto
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Categoría
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                Stock Actual
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                Disponible
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                Reservado
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                Stock Mínimo
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
            {inventarioFiltrado.map((item) => {
              if (!item.producto) return null

              const stockBajo =
                item.inventario.cantidadDisponible > 0 &&
                item.inventario.cantidadDisponible <= (item.producto.stockMinimo || 0)

              const sinStock = item.inventario.cantidadDisponible === 0

              return (
                <tr
                  key={item.inventario.id}
                  className={`hover:bg-slate-50 ${
                    stockBajo ? 'bg-yellow-50' : sinStock ? 'bg-red-50' : ''
                  }`}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="font-medium text-slate-900">{item.producto.nombre}</div>
                      {item.producto.codigoBarras && (
                        <div className="text-sm text-slate-500 font-mono">
                          {item.producto.codigoBarras}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {item.categoria ? (
                      <span className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded">
                        {item.categoria.nombre}
                      </span>
                    ) : (
                      <span className="text-sm text-slate-400">Sin categoría</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <span className="font-semibold text-slate-900">
                      {item.inventario.cantidad}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <span
                      className={`font-semibold ${
                        sinStock ? 'text-red-600' : stockBajo ? 'text-yellow-600' : 'text-green-600'
                      }`}
                    >
                      {item.inventario.cantidadDisponible}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <span className="text-slate-600">{item.inventario.cantidadReservada}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <span className="text-slate-600">{item.producto.stockMinimo || 0}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {sinStock ? (
                      <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                        Sin stock
                      </span>
                    ) : stockBajo ? (
                      <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                        Stock bajo
                      </span>
                    ) : (
                      <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Disponible
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <a
                      href={`/admin/empresas/${params.id}/inventario/movimientos?producto=${item.producto.id}&sucursal=${sucursalSeleccionada}`}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Ver historial
                    </a>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>

        {inventarioFiltrado.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📦</div>
            <p className="text-slate-500 mb-4">
              {searchParams.busqueda || searchParams.categoria || searchParams.alerta
                ? 'No se encontraron productos'
                : 'No hay productos con inventario en esta sucursal'}
            </p>
            {!searchParams.busqueda && !searchParams.categoria && !searchParams.alerta && (
              <a
                href={`/admin/empresas/${params.id}/inventario/ajustar`}
                className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Agregar Stock
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
