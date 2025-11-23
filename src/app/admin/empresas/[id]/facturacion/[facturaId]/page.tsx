import { db } from '@/lib/db'
import { empresas, facturas, detallesFactura, clientes } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'
import { redirect } from 'next/navigation'
import { TimbrarFacturaButton } from './timbrar-component'
import { CancelarFacturaButton } from './cancelar-component'

export default async function FacturaDetallesPage({
  params
}: {
  params: { id: string; facturaId: string }
}) {
  const [facturaData] = await db
    .select({
      factura: facturas,
      cliente: clientes,
      empresa: empresas,
    })
    .from(facturas)
    .leftJoin(clientes, eq(facturas.clienteId, clientes.id))
    .leftJoin(empresas, eq(facturas.empresaId, empresas.id))
    .where(and(
      eq(facturas.id, params.facturaId),
      eq(facturas.empresaId, params.id)
    ))
    .limit(1)

  if (!facturaData) {
    redirect(`/admin/empresas/${params.id}/facturacion`)
  }

  const { factura, cliente, empresa } = facturaData

  // Obtener detalles de la factura
  const detalles = await db
    .select()
    .from(detallesFactura)
    .where(eq(detallesFactura.facturaId, params.facturaId))

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-slate-900">
              Factura {factura.serie && `${factura.serie}-`}{factura.folio}
            </h1>
            <span className={`px-3 py-1 text-sm font-semibold rounded-full border ${
              factura.estado === 'timbrada'
                ? 'bg-green-100 text-green-800 border-green-200'
                : factura.estado === 'cancelada'
                ? 'bg-red-100 text-red-800 border-red-200'
                : factura.estado === 'borrador'
                ? 'bg-yellow-100 text-yellow-800 border-yellow-200'
                : 'bg-slate-100 text-slate-800 border-slate-200'
            }`}>
              {factura.estado}
            </span>
          </div>
          <p className="text-slate-600">{empresa?.nombre}</p>
          <p className="text-sm text-slate-500 mt-1">
            Fecha: {new Date(factura.fecha).toLocaleDateString('es-MX')}
          </p>
        </div>
        <div className="flex gap-2">
          {factura.estado === 'timbrada' && factura.xmlUrl && (
            <a
              href={factura.xmlUrl}
              download
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              📄 XML
            </a>
          )}
          {factura.estado === 'timbrada' && factura.pdfUrl && (
            <a
              href={factura.pdfUrl}
              target="_blank"
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              📑 PDF
            </a>
          )}
          <a
            href={`/admin/empresas/${params.id}/facturacion`}
            className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300"
          >
            ← Volver
          </a>
        </div>
      </div>

      {/* UUID del SAT */}
      {factura.folioFiscal && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="text-sm text-green-700 mb-1">UUID del SAT:</div>
          <div className="font-mono text-sm text-green-900 break-all">{factura.folioFiscal}</div>
          {factura.fechaTimbrado && (
            <div className="text-xs text-green-600 mt-2">
              Timbrado: {new Date(factura.fechaTimbrado).toLocaleString('es-MX')}
            </div>
          )}
        </div>
      )}

      {/* Información Fiscal */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Emisor */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <h3 className="font-semibold text-slate-900 mb-4">🏢 Emisor</h3>
          <dl className="space-y-2 text-sm">
            <div>
              <dt className="text-slate-500">RFC:</dt>
              <dd className="font-mono font-semibold text-slate-900">{empresa?.nombre}</dd>
            </div>
            <div>
              <dt className="text-slate-500">Lugar de Expedición:</dt>
              <dd className="font-medium text-slate-900">{factura.lugarExpedicion}</dd>
            </div>
          </dl>
        </div>

        {/* Receptor */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <h3 className="font-semibold text-slate-900 mb-4">👤 Receptor</h3>
          <dl className="space-y-2 text-sm">
            <div>
              <dt className="text-slate-500">Razón Social:</dt>
              <dd className="font-semibold text-slate-900">{factura.receptorNombre}</dd>
            </div>
            <div>
              <dt className="text-slate-500">RFC:</dt>
              <dd className="font-mono font-semibold text-slate-900">{factura.receptorRfc}</dd>
            </div>
            <div>
              <dt className="text-slate-500">Régimen Fiscal:</dt>
              <dd className="font-medium text-slate-900">{factura.receptorRegimenFiscal}</dd>
            </div>
            <div>
              <dt className="text-slate-500">Uso CFDI:</dt>
              <dd className="font-medium text-slate-900">{factura.receptorUsoCfdi}</dd>
            </div>
            <div>
              <dt className="text-slate-500">CP Fiscal:</dt>
              <dd className="font-medium text-slate-900">{factura.receptorCodigoPostal}</dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Datos de Pago */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <h3 className="font-semibold text-slate-900 mb-4">💳 Información de Pago</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-sm">
          <div>
            <dt className="text-slate-500 mb-1">Forma de Pago:</dt>
            <dd className="font-semibold text-slate-900">{factura.formaPago}</dd>
          </div>
          <div>
            <dt className="text-slate-500 mb-1">Método de Pago:</dt>
            <dd className="font-semibold text-slate-900">{factura.metodoPago}</dd>
          </div>
          <div>
            <dt className="text-slate-500 mb-1">Moneda:</dt>
            <dd className="font-semibold text-slate-900">{factura.moneda}</dd>
          </div>
          {factura.tipoCambio && Number(factura.tipoCambio) !== 1 && (
            <div>
              <dt className="text-slate-500 mb-1">Tipo de Cambio:</dt>
              <dd className="font-semibold text-slate-900">{factura.tipoCambio}</dd>
            </div>
          )}
        </div>
      </div>

      {/* Conceptos */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200">
        <div className="p-6 border-b border-slate-200">
          <h3 className="font-semibold text-slate-900">Conceptos ({detalles.length})</h3>
        </div>
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                Descripción
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase">
                Cantidad
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase">
                P. Unitario
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase">
                Importe
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {detalles.map((detalle) => (
              <tr key={detalle.id}>
                <td className="px-6 py-4">
                  <div className="font-medium text-slate-900">{detalle.descripcion}</div>
                  <div className="text-xs text-slate-500 mt-1">
                    Clave: {detalle.claveProdServ} | Unidad: {detalle.claveUnidad}
                  </div>
                </td>
                <td className="px-6 py-4 text-right text-sm text-slate-900">
                  {Number(detalle.cantidad).toFixed(2)} {detalle.unidad}
                </td>
                <td className="px-6 py-4 text-right text-sm text-slate-900">
                  ${Number(detalle.valorUnitario).toFixed(2)}
                </td>
                <td className="px-6 py-4 text-right text-sm font-semibold text-slate-900">
                  ${Number(detalle.importe).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Totales */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <h3 className="font-semibold text-slate-900 mb-4">💰 Totales</h3>
        <div className="space-y-2 max-w-md ml-auto">
          <div className="flex justify-between text-slate-700">
            <span>Subtotal:</span>
            <span className="font-semibold">${Number(factura.subtotal).toFixed(2)}</span>
          </div>
          {Number(factura.descuento) > 0 && (
            <div className="flex justify-between text-slate-700">
              <span>Descuento:</span>
              <span className="font-semibold">-${Number(factura.descuento).toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between text-slate-700">
            <span>IVA Trasladado:</span>
            <span className="font-semibold">${Number(factura.totalImpuestosTrasladados).toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-2xl font-bold text-slate-900 pt-2 border-t border-slate-200">
            <span>Total:</span>
            <span>${Number(factura.total).toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Observaciones */}
      {factura.observaciones && (
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <h3 className="font-semibold text-slate-900 mb-2">📝 Observaciones</h3>
          <p className="text-sm text-slate-700 whitespace-pre-wrap">{factura.observaciones}</p>
        </div>
      )}

      {/* Acciones */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <h3 className="font-semibold text-slate-900 mb-4">Acciones</h3>
        <div className="flex gap-3">
          {factura.estado === 'borrador' && (
            <TimbrarFacturaButton
              empresaId={params.id}
              facturaId={params.facturaId}
              folio={`${factura.serie}-${factura.folio}`}
            />
          )}
          {factura.estado === 'timbrada' && (
            <>
              {factura.xmlUrl && (
                <a
                  href={factura.xmlUrl}
                  download
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  📄 Descargar XML
                </a>
              )}
              {factura.pdfUrl && (
                <a
                  href={factura.pdfUrl}
                  target="_blank"
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  📑 Descargar PDF
                </a>
              )}
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                ✉️ Enviar por Email
              </button>
              <CancelarFacturaButton
                empresaId={params.id}
                facturaId={params.facturaId}
                folio={`${factura.serie}-${factura.folio}`}
              />
            </>
          )}
        </div>
      </div>

      {/* Cancelación */}
      {factura.estado === 'cancelada' && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h3 className="font-semibold text-red-900 mb-2">Factura Cancelada</h3>
          {factura.fechaCancelacion && (
            <p className="text-sm text-red-700">
              Fecha de cancelación: {new Date(factura.fechaCancelacion).toLocaleString('es-MX')}
            </p>
          )}
          {factura.motivoCancelacion && (
            <p className="text-sm text-red-700 mt-2">
              Motivo: {factura.motivoCancelacion}
            </p>
          )}
        </div>
      )}
    </div>
  )
}
