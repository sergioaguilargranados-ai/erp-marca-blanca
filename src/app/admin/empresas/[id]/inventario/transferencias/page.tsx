import { db } from '@/lib/db'
import { empresas, transferencias, productos, sucursales, usuarios } from '@/lib/db/schema'
import { eq, or, and, desc } from 'drizzle-orm'
import { redirect } from 'next/navigation'

export default async function TransferenciasPage({
  params,
  searchParams
}: {
  params: { id: string }
  searchParams: {
    estado?: string
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

  // Obtener sucursales de la empresa para filtrar transferencias
  const sucursalesEmpresa = await db
    .select()
    .from(sucursales)
    .where(eq(sucursales.empresaId, params.id))

  const sucursalesIds = sucursalesEmpresa.map((s) => s.id)

  // Construir condiciones de filtro
  const condiciones: any[] = [
    or(
      ...sucursalesIds.map((id) => eq(transferencias.sucursalOrigenId, id)),
      ...sucursalesIds.map((id) => eq(transferencias.sucursalDestinoId, id))
    ),
  ]

  if (searchParams.estado) {
    condiciones.push(eq(transferencias.estado, searchParams.estado))
  }

  // Obtener transferencias
  const transferenciasEmpresa = await db
    .select({
      transferencia: transferencias,
      producto: productos,
      sucursalOrigen: sucursales,
      sucursalDestino: sucursales,
      usuarioSolicitante: usuarios,
    })
    .from(transferencias)
    .leftJoin(productos, eq(transferencias.productoId, productos.id))
    .leftJoin(sucursales, eq(transferencias.sucursalOrigenId, sucursales.id))
    .leftJoin(sucursales, eq(transferencias.sucursalDestinoId, sucursales.id))
    .leftJoin(usuarios, eq(transferencias.usuarioSolicitanteId, usuarios.id))
    .where(and(...condiciones))
    .orderBy(desc(transferencias.createdAt))
    .limit(100)

  // Estadísticas
  const totalTransferencias = transferenciasEmpresa.length
  const pendientes = transferenciasEmpresa.filter((t) => t.transferencia.estado === 'solicitada').length
  const enProceso = transferenciasEmpresa.filter(
    (t) => t.transferencia.estado === 'aprobada' || t.transferencia.estado === 'en_transito'
  ).length
  const completadas = transferenciasEmpresa.filter((t) => t.transferencia.estado === 'recibida').length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Transferencias entre Sucursales</h1>
          <p className="text-slate-600 mt-1">
            Gestión de transferencias de productos de {empresa.nombre}
          </p>
          <p className="text-sm text-slate-500 mt-1">
            {totalTransferencias} transferencias registradas
          </p>
        </div>
        <div className="flex gap-2">
          <a
            href={`/admin/empresas/${params.id}/inventario/transferencias/nueva`}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            + Nueva Transferencia
          </a>
          <a
            href={`/admin/empresas/${params.id}/inventario`}
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
              <div className="text-2xl font-bold text-slate-900">{totalTransferencias}</div>
              <div className="text-sm text-slate-600">Total</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <div className="flex items-center gap-3">
            <div className="text-3xl">⏳</div>
            <div>
              <div className="text-2xl font-bold text-yellow-600">{pendientes}</div>
              <div className="text-sm text-slate-600">Pendientes</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <div className="flex items-center gap-3">
            <div className="text-3xl">🚚</div>
            <div>
              <div className="text-2xl font-bold text-blue-600">{enProceso}</div>
              <div className="text-sm text-slate-600">En proceso</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <div className="flex items-center gap-3">
            <div className="text-3xl">✅</div>
            <div>
              <div className="text-2xl font-bold text-green-600">{completadas}</div>
              <div className="text-sm text-slate-600">Completadas</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
        <form method="GET" className="flex gap-4">
          <div className="flex-1">
            <label className="text-sm font-medium text-slate-700 block mb-2">
              Estado
            </label>
            <select
              name="estado"
              defaultValue={searchParams.estado}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg"
            >
              <option value="">Todos</option>
              <option value="solicitada">Solicitada</option>
              <option value="aprobada">Aprobada</option>
              <option value="en_transito">En Tránsito</option>
              <option value="recibida">Recibida</option>
              <option value="rechazada">Rechazada</option>
              <option value="cancelada">Cancelada</option>
            </select>
          </div>
          <div className="flex items-end gap-2">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Filtrar
            </button>
            {searchParams.estado && (
              <a
                href={`/admin/empresas/${params.id}/inventario/transferencias`}
                className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300"
              >
                Limpiar
              </a>
            )}
          </div>
        </form>
      </div>

      {/* Tabla de transferencias */}
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
              <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                Cantidad
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Origen → Destino
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Solicitante
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
            {transferenciasEmpresa.map(
              ({ transferencia, producto, sucursalOrigen, sucursalDestino, usuarioSolicitante }) => (
                <tr key={transferencia.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-slate-900">
                      {new Date(transferencia.createdAt).toLocaleDateString('es-MX')}
                    </div>
                    <div className="text-xs text-slate-500">
                      {new Date(transferencia.createdAt).toLocaleTimeString('es-MX')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-slate-900">
                      {producto?.nombre || 'Producto eliminado'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <span className="font-semibold text-slate-900">{transferencia.cantidad}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-slate-900">
                      {sucursalOrigen?.nombre || 'N/A'} → {sucursalDestino?.nombre || 'N/A'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-slate-900">
                      {usuarioSolicitante?.nombre || 'Usuario eliminado'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        transferencia.estado === 'solicitada'
                          ? 'bg-yellow-100 text-yellow-800'
                          : transferencia.estado === 'aprobada'
                          ? 'bg-blue-100 text-blue-800'
                          : transferencia.estado === 'en_transito'
                          ? 'bg-purple-100 text-purple-800'
                          : transferencia.estado === 'recibida'
                          ? 'bg-green-100 text-green-800'
                          : transferencia.estado === 'rechazada'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-slate-100 text-slate-800'
                      }`}
                    >
                      {transferencia.estado.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <a
                      href={`/admin/empresas/${params.id}/inventario/transferencias/${transferencia.id}`}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Ver detalles
                    </a>
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>

        {transferenciasEmpresa.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔄</div>
            <p className="text-slate-500 mb-4">No hay transferencias registradas</p>
            <a
              href={`/admin/empresas/${params.id}/inventario/transferencias/nueva`}
              className="inline-block px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Crear Primera Transferencia
            </a>
          </div>
        )}
      </div>
    </div>
  )
}
