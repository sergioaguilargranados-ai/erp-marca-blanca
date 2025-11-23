import { db } from '@/lib/db'
import { empresas, proveedores, ordenesCompra, cuentasPorPagar } from '@/lib/db/schema'
import { eq, and, desc, sql } from 'drizzle-orm'
import { redirect } from 'next/navigation'

export default async function ProveedorDetallesPage({
  params
}: {
  params: { id: string; proveedorId: string }
}) {
  const [proveedorData] = await db
    .select({
      proveedor: proveedores,
      empresa: empresas,
    })
    .from(proveedores)
    .leftJoin(empresas, eq(proveedores.empresaId, empresas.id))
    .where(and(
      eq(proveedores.id, params.proveedorId),
      eq(proveedores.empresaId, params.id)
    ))
    .limit(1)

  if (!proveedorData || !proveedorData.proveedor) {
    redirect(`/admin/empresas/${params.id}/proveedores`)
  }

  const { proveedor, empresa } = proveedorData

  // Obtener órdenes de compra del proveedor
  const ordenesProveedor = await db
    .select()
    .from(ordenesCompra)
    .where(and(
      eq(ordenesCompra.proveedorId, params.proveedorId),
      eq(ordenesCompra.empresaId, params.id)
    ))
    .orderBy(desc(ordenesCompra.createdAt))
    .limit(10)

  // Obtener cuentas por pagar del proveedor
  const cuentasProveedor = await db
    .select()
    .from(cuentasPorPagar)
    .where(and(
      eq(cuentasPorPagar.proveedorId, params.proveedorId),
      eq(cuentasPorPagar.empresaId, params.id)
    ))
    .orderBy(desc(cuentasPorPagar.createdAt))
    .limit(10)

  // Estadísticas
  const totalOrdenes = ordenesProveedor.length
  const totalComprado = ordenesProveedor
    .filter(o => o.estado !== 'cancelada')
    .reduce((sum, o) => sum + Number(o.total), 0)

  const totalPorPagar = cuentasProveedor
    .filter(c => c.estado !== 'pagada')
    .reduce((sum, c) => sum + Number(c.saldo), 0)

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-slate-900">{proveedor.nombre}</h1>
            <span className={`px-3 py-1 text-sm font-semibold rounded-full border ${
              proveedor.activo
                ? 'bg-green-100 text-green-800 border-green-200'
                : 'bg-red-100 text-red-800 border-red-200'
            }`}>
              {proveedor.activo ? 'Activo' : 'Inactivo'}
            </span>
          </div>
          <p className="text-slate-600">{empresa?.nombre}</p>
          {proveedor.nombreComercial && (
            <p className="text-sm text-slate-500 mt-1">{proveedor.nombreComercial}</p>
          )}
        </div>
        <div className="flex gap-2">
          <a
            href={`/admin/empresas/${params.id}/proveedores/${params.proveedorId}/editar`}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Editar
          </a>
          <a
            href={`/admin/empresas/${params.id}/proveedores`}
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
              <div className="text-sm text-slate-600">Órdenes de Compra</div>
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
              <div className="text-2xl font-bold text-orange-600">${totalPorPagar.toFixed(2)}</div>
              <div className="text-sm text-slate-600">Por Pagar</div>
            </div>
          </div>
        </div>
      </div>

      {/* Información del Proveedor */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Datos Fiscales */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <span>📄</span> Datos Fiscales
          </h3>
          <dl className="space-y-3">
            {proveedor.rfc && (
              <div>
                <dt className="text-xs text-slate-500 uppercase mb-1">RFC</dt>
                <dd className="text-sm font-mono font-semibold text-slate-900">{proveedor.rfc}</dd>
              </div>
            )}
            {proveedor.razonSocial && (
              <div>
                <dt className="text-xs text-slate-500 uppercase mb-1">Razón Social</dt>
                <dd className="text-sm font-medium text-slate-900">{proveedor.razonSocial}</dd>
              </div>
            )}
            {proveedor.regimenFiscal && (
              <div>
                <dt className="text-xs text-slate-500 uppercase mb-1">Régimen Fiscal</dt>
                <dd className="text-sm font-medium text-slate-900">{proveedor.regimenFiscal}</dd>
              </div>
            )}
            {proveedor.usoCfdi && (
              <div>
                <dt className="text-xs text-slate-500 uppercase mb-1">Uso CFDI</dt>
                <dd className="text-sm font-medium text-slate-900">{proveedor.usoCfdi}</dd>
              </div>
            )}
          </dl>
        </div>

        {/* Contacto */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <span>📞</span> Contacto
          </h3>
          <dl className="space-y-3">
            {proveedor.telefono && (
              <div>
                <dt className="text-xs text-slate-500 uppercase mb-1">Teléfono</dt>
                <dd className="text-sm font-medium text-slate-900">{proveedor.telefono}</dd>
              </div>
            )}
            {proveedor.email && (
              <div>
                <dt className="text-xs text-slate-500 uppercase mb-1">Email</dt>
                <dd className="text-sm font-medium text-slate-900">{proveedor.email}</dd>
              </div>
            )}
            {proveedor.sitioWeb && (
              <div>
                <dt className="text-xs text-slate-500 uppercase mb-1">Sitio Web</dt>
                <dd className="text-sm font-medium text-blue-600">
                  <a href={proveedor.sitioWeb} target="_blank" rel="noopener noreferrer">
                    {proveedor.sitioWeb}
                  </a>
                </dd>
              </div>
            )}
            {proveedor.nombreContacto && (
              <div>
                <dt className="text-xs text-slate-500 uppercase mb-1">Persona de Contacto</dt>
                <dd className="text-sm font-medium text-slate-900">{proveedor.nombreContacto}</dd>
                {proveedor.telefonoContacto && (
                  <dd className="text-sm text-slate-600">{proveedor.telefonoContacto}</dd>
                )}
                {proveedor.emailContacto && (
                  <dd className="text-sm text-slate-600">{proveedor.emailContacto}</dd>
                )}
              </div>
            )}
          </dl>
        </div>

        {/* Dirección */}
        {(proveedor.calle || proveedor.ciudad) && (
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
            <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <span>📍</span> Dirección
            </h3>
            <dl className="space-y-2 text-sm">
              {proveedor.calle && (
                <dd className="text-slate-900">
                  {proveedor.calle} {proveedor.numeroExterior}
                  {proveedor.numeroInterior && ` Int. ${proveedor.numeroInterior}`}
                </dd>
              )}
              {proveedor.colonia && <dd className="text-slate-900">{proveedor.colonia}</dd>}
              {proveedor.ciudad && (
                <dd className="text-slate-900">
                  {proveedor.ciudad}, {proveedor.estado} {proveedor.codigoPostal}
                </dd>
              )}
              {proveedor.pais && <dd className="text-slate-900">{proveedor.pais}</dd>}
            </dl>
          </div>
        )}

        {/* Términos Comerciales */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <span>💼</span> Términos Comerciales
          </h3>
          <dl className="space-y-3">
            <div>
              <dt className="text-xs text-slate-500 uppercase mb-1">Días de Crédito</dt>
              <dd className="text-sm font-semibold text-slate-900">{proveedor.diasCredito || '0'} días</dd>
            </div>
            <div>
              <dt className="text-xs text-slate-500 uppercase mb-1">Límite de Crédito</dt>
              <dd className="text-sm font-semibold text-slate-900">
                ${Number(proveedor.limiteCredito || 0).toFixed(2)}
              </dd>
            </div>
            {Number(proveedor.descuentoDefault) > 0 && (
              <div>
                <dt className="text-xs text-slate-500 uppercase mb-1">Descuento Default</dt>
                <dd className="text-sm font-semibold text-slate-900">
                  {proveedor.descuentoDefault}%
                </dd>
              </div>
            )}
          </dl>
        </div>
      </div>

      {/* Información Bancaria */}
      {(proveedor.banco || proveedor.cuentaBancaria) && (
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <span>🏦</span> Información Bancaria
          </h3>
          <dl className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {proveedor.banco && (
              <div>
                <dt className="text-xs text-slate-500 uppercase mb-1">Banco</dt>
                <dd className="text-sm font-medium text-slate-900">{proveedor.banco}</dd>
              </div>
            )}
            {proveedor.cuentaBancaria && (
              <div>
                <dt className="text-xs text-slate-500 uppercase mb-1">Cuenta / CLABE</dt>
                <dd className="text-sm font-mono font-medium text-slate-900">{proveedor.cuentaBancaria}</dd>
              </div>
            )}
          </dl>
        </div>
      )}

      {/* Notas */}
      {proveedor.notas && (
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <span>📝</span> Notas
          </h3>
          <p className="text-sm text-slate-700 whitespace-pre-wrap">{proveedor.notas}</p>
        </div>
      )}

      {/* Órdenes de Compra Recientes */}
      {ordenesProveedor.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-slate-200">
          <div className="p-6 border-b border-slate-200 flex justify-between items-center">
            <h3 className="font-semibold text-slate-900">
              Órdenes de Compra Recientes ({totalOrdenes})
            </h3>
            <a
              href={`/admin/empresas/${params.id}/compras?proveedor=${params.proveedorId}`}
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              Ver todas →
            </a>
          </div>
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                  Folio
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                  Fecha
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                  Estado
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {ordenesProveedor.slice(0, 5).map((orden) => (
                <tr key={orden.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-slate-900">
                    {orden.folio}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                    {new Date(orden.fechaOrden).toLocaleDateString('es-MX')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-semibold text-slate-900">
                    ${Number(orden.total).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      orden.estado === 'recibida'
                        ? 'bg-green-100 text-green-800'
                        : orden.estado === 'enviada'
                        ? 'bg-blue-100 text-blue-800'
                        : orden.estado === 'cancelada'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {orden.estado}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Cuentas por Pagar */}
      {cuentasProveedor.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-slate-200">
          <div className="p-6 border-b border-slate-200 flex justify-between items-center">
            <h3 className="font-semibold text-slate-900">
              Cuentas por Pagar ({cuentasProveedor.length})
            </h3>
            <a
              href={`/admin/empresas/${params.id}/cuentas-pagar?proveedor=${params.proveedorId}`}
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              Ver todas →
            </a>
          </div>
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                  Factura
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                  Vencimiento
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase">
                  Total
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase">
                  Saldo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                  Estado
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {cuentasProveedor.slice(0, 5).map((cuenta) => (
                <tr key={cuenta.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-slate-900">
                    {cuenta.folio || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                    {new Date(cuenta.fechaVencimiento).toLocaleDateString('es-MX')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-semibold text-slate-900">
                    ${Number(cuenta.montoTotal).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-semibold text-orange-600">
                    ${Number(cuenta.saldo).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      cuenta.estado === 'pagada'
                        ? 'bg-green-100 text-green-800'
                        : cuenta.estado === 'parcial'
                        ? 'bg-yellow-100 text-yellow-800'
                        : cuenta.estado === 'vencida'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {cuenta.estado}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Información del Sistema */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <h3 className="font-semibold text-slate-900 mb-4">Información del Sistema</h3>
        <dl className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
          <div>
            <dt className="text-xs text-slate-500 uppercase mb-1">Registrado</dt>
            <dd className="font-medium text-slate-900">
              {new Date(proveedor.createdAt).toLocaleDateString('es-MX')}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-slate-500 uppercase mb-1">Última actualización</dt>
            <dd className="font-medium text-slate-900">
              {new Date(proveedor.updatedAt).toLocaleDateString('es-MX')}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-slate-500 uppercase mb-1">ID</dt>
            <dd className="font-medium text-slate-900 font-mono text-xs">{proveedor.id}</dd>
          </div>
        </dl>
      </div>

      {/* Acciones */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <h3 className="font-semibold text-slate-900 mb-4">Acciones</h3>
        <div className="flex gap-3">
          <a
            href={`/admin/empresas/${params.id}/compras/nueva?proveedor=${params.proveedorId}`}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            📋 Nueva Orden de Compra
          </a>
          <a
            href={`/admin/empresas/${params.id}/proveedores/${params.proveedorId}/editar`}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Editar Información
          </a>
          {proveedor.activo ? (
            <button className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700">
              Desactivar Proveedor
            </button>
          ) : (
            <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700">
              Activar Proveedor
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
