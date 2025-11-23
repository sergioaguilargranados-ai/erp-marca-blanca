import { db } from '@/lib/db'
import { ventas, detallesVenta, usuarios, clientes, sucursales } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'
import { redirect } from 'next/navigation'
import { CancelarVentaButton } from './cancelar-component'

export default async function VentaDetallesPage({
  params
}: {
  params: { id: string; ventaId: string }
}) {
  // Obtener venta con relaciones
  const [ventaData] = await db
    .select({
      venta: ventas,
      usuario: usuarios,
      cliente: clientes,
      sucursal: sucursales,
    })
    .from(ventas)
    .leftJoin(usuarios, eq(ventas.usuarioId, usuarios.id))
    .leftJoin(clientes, eq(ventas.clienteId, clientes.id))
    .leftJoin(sucursales, eq(ventas.sucursalId, sucursales.id))
    .where(and(
      eq(ventas.id, params.ventaId),
      eq(ventas.empresaId, params.id)
    ))
    .limit(1)

  if (!ventaData) {
    redirect(`/admin/empresas/${params.id}/ventas`)
  }

  const { venta, usuario, cliente, sucursal } = ventaData

  // Obtener detalles de la venta
  const detalles = await db
    .select()
    .from(detallesVenta)
    .where(eq(detallesVenta.ventaId, params.ventaId))

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-slate-900">Venta {venta.folio}</h1>
            <span className={`px-3 py-1 text-sm font-semibold rounded-full ${
              venta.estado === 'completada'
                ? 'bg-green-100 text-green-800'
                : venta.estado === 'cancelada'
                ? 'bg-red-100 text-red-800'
                : 'bg-yellow-100 text-yellow-800'
            }`}>
              {venta.estado}
            </span>
          </div>
          <p className="text-slate-600">
            {new Date(venta.createdAt).toLocaleString('es-MX')}
          </p>
        </div>
        <div className="flex gap-2">
          <a
            href={`/admin/empresas/${params.id}/ventas/${params.ventaId}/ticket`}
            target="_blank"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            🖨️ Imprimir Ticket
          </a>
          <a
            href={`/admin/empresas/${params.id}/ventas`}
            className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300"
          >
            ← Volver
          </a>
        </div>
      </div>

      {/* Información de la venta */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <h3 className="font-semibold text-slate-900 mb-4">Cliente</h3>
          <div className="space-y-2">
            <div className="text-sm text-slate-900 font-medium">
              {cliente?.nombre || venta.nombreCliente}
            </div>
            {cliente?.email && (
              <div className="text-sm text-slate-600">{cliente.email}</div>
            )}
            {cliente?.telefono && (
              <div className="text-sm text-slate-600">{cliente.telefono}</div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <h3 className="font-semibold text-slate-900 mb-4">Datos de Venta</h3>
          <dl className="space-y-2 text-sm">
            <div>
              <dt className="text-slate-600">Vendedor:</dt>
              <dd className="font-medium text-slate-900">{usuario?.nombre || 'N/A'}</dd>
            </div>
            <div>
              <dt className="text-slate-600">Sucursal:</dt>
              <dd className="font-medium text-slate-900">{sucursal?.nombre || 'N/A'}</dd>
            </div>
            <div>
              <dt className="text-slate-600">Método de pago:</dt>
              <dd className="font-medium text-slate-900 capitalize">{venta.metodoPago}</dd>
            </div>
          </dl>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <h3 className="font-semibold text-slate-900 mb-4">Totales</h3>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-slate-600">Subtotal:</dt>
              <dd className="font-medium text-slate-900">${Number(venta.subtotal).toFixed(2)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-600">IVA:</dt>
              <dd className="font-medium text-slate-900">${Number(venta.iva).toFixed(2)}</dd>
            </div>
            <div className="flex justify-between text-lg font-bold border-t border-slate-200 pt-2">
              <dt className="text-slate-900">Total:</dt>
              <dd className="text-green-600">${Number(venta.total).toFixed(2)}</dd>
            </div>
            {venta.metodoPago === 'efectivo' && venta.montoPagado && (
              <>
                <div className="flex justify-between text-sm">
                  <dt className="text-slate-600">Pagado:</dt>
                  <dd className="font-medium text-slate-900">${Number(venta.montoPagado).toFixed(2)}</dd>
                </div>
                <div className="flex justify-between text-sm">
                  <dt className="text-slate-600">Cambio:</dt>
                  <dd className="font-medium text-slate-900">${Number(venta.cambio || 0).toFixed(2)}</dd>
                </div>
              </>
            )}
          </dl>
        </div>
      </div>

      {/* Detalles de productos */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200">
        <div className="p-6 border-b border-slate-200">
          <h3 className="font-semibold text-slate-900">Productos ({detalles.length})</h3>
        </div>
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                Producto
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase">
                Cantidad
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase">
                Precio Unit.
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase">
                Subtotal
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase">
                IVA
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase">
                Total
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {detalles.map((detalle) => (
              <tr key={detalle.id}>
                <td className="px-6 py-4">
                  <div className="font-medium text-slate-900">{detalle.nombreProducto}</div>
                  {detalle.codigoBarras && (
                    <div className="text-sm text-slate-500 font-mono">{detalle.codigoBarras}</div>
                  )}
                </td>
                <td className="px-6 py-4 text-right text-sm text-slate-900">
                  {detalle.cantidad} {detalle.unidadMedida}
                </td>
                <td className="px-6 py-4 text-right text-sm text-slate-900">
                  ${Number(detalle.precioUnitario).toFixed(2)}
                </td>
                <td className="px-6 py-4 text-right text-sm text-slate-900">
                  ${Number(detalle.subtotal).toFixed(2)}
                </td>
                <td className="px-6 py-4 text-right text-sm text-slate-900">
                  ${Number(detalle.iva).toFixed(2)}
                </td>
                <td className="px-6 py-4 text-right text-sm font-semibold text-slate-900">
                  ${Number(detalle.total).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Acciones */}
      {venta.estado === 'completada' && (
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <h3 className="font-semibold text-slate-900 mb-4">Acciones</h3>
          <div className="flex gap-3">
            <CancelarVentaButton
              empresaId={params.id}
              ventaId={params.ventaId}
              folio={venta.folio}
              usuarioId={venta.usuarioId}
            />
            {venta.requiereFactura === 'pendiente' && (
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Generar Factura
              </button>
            )}
          </div>
        </div>
      )}

      {venta.estado === 'cancelada' && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h3 className="font-semibold text-red-900 mb-2">Venta Cancelada</h3>
          <p className="text-sm text-red-700">
            Esta venta fue cancelada el {new Date(venta.canceladaAt!).toLocaleString('es-MX')}
          </p>
        </div>
      )}
    </div>
  )
}
