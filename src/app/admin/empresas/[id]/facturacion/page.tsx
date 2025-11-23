import { db } from '@/lib/db'
import { empresas, facturas, configuracionFacturacion } from '@/lib/db/schema'
import { eq, desc } from 'drizzle-orm'
import { redirect } from 'next/navigation'

export default async function FacturacionPage({ params }: { params: { id: string } }) {
  const [empresa] = await db
    .select()
    .from(empresas)
    .where(eq(empresas.id, params.id))
    .limit(1)

  if (!empresa) {
    redirect('/admin/empresas')
  }

  // Verificar si hay configuración de facturación
  const [config] = await db
    .select()
    .from(configuracionFacturacion)
    .where(eq(configuracionFacturacion.empresaId, params.id))
    .limit(1)

  // Obtener facturas de la empresa
  const facturasEmpresa = await db
    .select()
    .from(facturas)
    .where(eq(facturas.empresaId, params.id))
    .orderBy(desc(facturas.createdAt))
    .limit(50)

  // Estadísticas
  const totalFacturas = facturasEmpresa.length
  const facturasTimbradas = facturasEmpresa.filter(f => f.estado === 'timbrada').length
  const facturasCanceladas = facturasEmpresa.filter(f => f.estado === 'cancelada').length
  const totalMonto = facturasEmpresa
    .filter(f => f.estado === 'timbrada')
    .reduce((sum, f) => sum + Number(f.total), 0)

  // Si no hay configuración, mostrar aviso
  if (!config) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Facturación CFDI 4.0</h1>
            <p className="text-slate-600 mt-1">
              Sistema de facturación electrónica para {empresa.nombre}
            </p>
          </div>
          <a
            href={`/admin/empresas/${params.id}`}
            className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300"
          >
            ← Volver
          </a>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8">
          <div className="text-center">
            <div className="text-6xl mb-4">🧾</div>
            <h2 className="text-2xl font-bold text-yellow-900 mb-2">
              Configuración de Facturación Requerida
            </h2>
            <p className="text-yellow-800 mb-6">
              Antes de emitir facturas, debes configurar los datos fiscales de tu empresa
              y conectar con un proveedor de timbrado (PAC).
            </p>
            <a
              href={`/admin/empresas/${params.id}/facturacion/configurar`}
              className="inline-block px-6 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 font-medium"
            >
              Configurar Facturación
            </a>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 mb-3">ℹ️ Requisitos</h3>
          <ul className="space-y-2 text-sm text-blue-800">
            <li className="flex items-start gap-2">
              <span className="text-blue-600">•</span>
              <span>RFC de la empresa válido</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600">•</span>
              <span>Certificado de Sello Digital (CSD) vigente (.cer y .key)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600">•</span>
              <span>Contraseña del certificado</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600">•</span>
              <span>Cuenta con un Proveedor Autorizado de Certificación (PAC)</span>
            </li>
          </ul>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Facturación CFDI 4.0</h1>
          <p className="text-slate-600 mt-1">
            Sistema de facturación electrónica de {empresa.nombre}
          </p>
          <p className="text-sm text-slate-500 mt-1">
            RFC: {config.rfc} | Régimen: {config.regimenFiscal}
          </p>
        </div>
        <div className="flex gap-2">
          <a
            href={`/admin/empresas/${params.id}/facturacion/nueva`}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            + Nueva Factura
          </a>
          <a
            href={`/admin/empresas/${params.id}/facturacion/configurar`}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            ⚙️ Configuración
          </a>
          <a
            href={`/admin/empresas/${params.id}`}
            className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300"
          >
            ← Volver
          </a>
        </div>
      </div>

      {/* Alertas */}
      {config.pacModoSandbox && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <p className="text-sm text-orange-800">
            ⚠️ <strong>Modo Sandbox Activo</strong> - Las facturas generadas son de prueba y no tienen validez fiscal.
          </p>
        </div>
      )}

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <div className="flex items-center gap-3">
            <div className="text-3xl">🧾</div>
            <div>
              <div className="text-2xl font-bold text-slate-900">{totalFacturas}</div>
              <div className="text-sm text-slate-600">Total facturas</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <div className="flex items-center gap-3">
            <div className="text-3xl">✅</div>
            <div>
              <div className="text-2xl font-bold text-green-600">{facturasTimbradas}</div>
              <div className="text-sm text-slate-600">Timbradas</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <div className="flex items-center gap-3">
            <div className="text-3xl">❌</div>
            <div>
              <div className="text-2xl font-bold text-red-600">{facturasCanceladas}</div>
              <div className="text-sm text-slate-600">Canceladas</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <div className="flex items-center gap-3">
            <div className="text-3xl">💰</div>
            <div>
              <div className="text-2xl font-bold text-slate-900">${totalMonto.toFixed(2)}</div>
              <div className="text-sm text-slate-600">Monto facturado</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabla de facturas */}
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
                UUID
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
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
            {facturasEmpresa.map((factura) => (
              <tr key={factura.id} className="hover:bg-slate-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm font-mono font-medium text-slate-900">
                    {factura.serie && `${factura.serie}-`}{factura.folio}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-slate-900">
                    {new Date(factura.fecha).toLocaleDateString('es-MX')}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-slate-900">{factura.receptorNombre}</div>
                  <div className="text-xs text-slate-500 font-mono">{factura.receptorRfc}</div>
                </td>
                <td className="px-6 py-4">
                  {factura.folioFiscal ? (
                    <span className="text-xs font-mono text-slate-600">
                      {factura.folioFiscal.slice(0, 20)}...
                    </span>
                  ) : (
                    <span className="text-xs text-slate-400">Sin timbrar</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <div className="text-sm font-semibold text-slate-900">
                    ${Number(factura.total).toFixed(2)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    factura.estado === 'timbrada'
                      ? 'bg-green-100 text-green-800'
                      : factura.estado === 'cancelada'
                      ? 'bg-red-100 text-red-800'
                      : factura.estado === 'borrador'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-slate-100 text-slate-800'
                  }`}>
                    {factura.estado}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end gap-2">
                    <a
                      href={`/admin/empresas/${params.id}/facturacion/${factura.id}`}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Ver
                    </a>
                    {factura.xmlUrl && (
                      <a
                        href={factura.xmlUrl}
                        download
                        className="text-green-600 hover:text-green-900"
                      >
                        XML
                      </a>
                    )}
                    {factura.pdfUrl && (
                      <a
                        href={factura.pdfUrl}
                        target="_blank"
                        className="text-purple-600 hover:text-purple-900"
                      >
                        PDF
                      </a>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {facturasEmpresa.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🧾</div>
            <p className="text-slate-500 mb-4">No hay facturas emitidas</p>
            <a
              href={`/admin/empresas/${params.id}/facturacion/nueva`}
              className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Emitir Primera Factura
            </a>
          </div>
        )}
      </div>
    </div>
  )
}
