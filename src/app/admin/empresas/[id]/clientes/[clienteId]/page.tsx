import { db } from '@/lib/db'
import { empresas, clientes } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'
import { redirect } from 'next/navigation'

export default async function ClienteDetallesPage({
  params
}: {
  params: { id: string; clienteId: string }
}) {
  const [clienteData] = await db
    .select({
      cliente: clientes,
      empresa: empresas,
    })
    .from(clientes)
    .leftJoin(empresas, eq(clientes.empresaId, empresas.id))
    .where(and(
      eq(clientes.id, params.clienteId),
      eq(clientes.empresaId, params.id)
    ))
    .limit(1)

  if (!clienteData || !clienteData.cliente) {
    redirect(`/admin/empresas/${params.id}/clientes`)
  }

  const { cliente, empresa } = clienteData

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-slate-900">{cliente.nombre}</h1>
            <span className={`px-3 py-1 text-sm font-semibold rounded-full border ${
              cliente.activo
                ? 'bg-green-100 text-green-800 border-green-200'
                : 'bg-red-100 text-red-800 border-red-200'
            }`}>
              {cliente.activo ? 'Activo' : 'Inactivo'}
            </span>
          </div>
          <p className="text-slate-600">{empresa?.nombre}</p>
        </div>
        <div className="flex gap-2">
          <a
            href={`/admin/empresas/${params.id}/clientes/${params.clienteId}/editar`}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Editar
          </a>
          <a
            href={`/admin/empresas/${params.id}/clientes`}
            className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300"
          >
            ← Volver
          </a>
        </div>
      </div>

      {/* Información */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Información Básica */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <span>👤</span> Información Básica
          </h3>
          <dl className="space-y-3">
            <div>
              <dt className="text-xs text-slate-500 uppercase mb-1">Nombre</dt>
              <dd className="text-sm font-medium text-slate-900">{cliente.nombre}</dd>
            </div>
            <div>
              <dt className="text-xs text-slate-500 uppercase mb-1">Tipo de Cliente</dt>
              <dd>
                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  cliente.tipo === 'mayorista'
                    ? 'bg-purple-100 text-purple-800'
                    : cliente.tipo === 'especial'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {cliente.tipo}
                </span>
              </dd>
            </div>
            {cliente.puntos > 0 && (
              <div>
                <dt className="text-xs text-slate-500 uppercase mb-1">Puntos</dt>
                <dd className="text-sm font-medium text-slate-900">{cliente.puntos}</dd>
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
            {cliente.email ? (
              <div>
                <dt className="text-xs text-slate-500 uppercase mb-1">Email</dt>
                <dd className="text-sm font-medium text-slate-900">{cliente.email}</dd>
              </div>
            ) : (
              <div className="text-sm text-slate-400">No hay email registrado</div>
            )}
            {cliente.telefono ? (
              <div>
                <dt className="text-xs text-slate-500 uppercase mb-1">Teléfono</dt>
                <dd className="text-sm font-medium text-slate-900">{cliente.telefono}</dd>
              </div>
            ) : (
              <div className="text-sm text-slate-400">No hay teléfono registrado</div>
            )}
            {cliente.direccion && (
              <div>
                <dt className="text-xs text-slate-500 uppercase mb-1">Dirección</dt>
                <dd className="text-sm font-medium text-slate-900">{cliente.direccion}</dd>
              </div>
            )}
          </dl>
        </div>
      </div>

      {/* Datos Fiscales */}
      {(cliente.rfc || cliente.razonSocial) && (
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <span>🧾</span> Información Fiscal
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {cliente.rfc && (
              <div>
                <dt className="text-xs text-slate-500 uppercase mb-1">RFC</dt>
                <dd className="text-sm font-medium text-slate-900 font-mono">{cliente.rfc}</dd>
              </div>
            )}
            {cliente.razonSocial && (
              <div>
                <dt className="text-xs text-slate-500 uppercase mb-1">Razón Social</dt>
                <dd className="text-sm font-medium text-slate-900">{cliente.razonSocial}</dd>
              </div>
            )}
            {cliente.regimenFiscal && (
              <div>
                <dt className="text-xs text-slate-500 uppercase mb-1">Régimen Fiscal</dt>
                <dd className="text-sm font-medium text-slate-900 font-mono">{cliente.regimenFiscal}</dd>
              </div>
            )}
            {cliente.usoCfdi && (
              <div>
                <dt className="text-xs text-slate-500 uppercase mb-1">Uso de CFDI</dt>
                <dd className="text-sm font-medium text-slate-900 font-mono">{cliente.usoCfdi}</dd>
              </div>
            )}
            {cliente.codigoPostal && (
              <div>
                <dt className="text-xs text-slate-500 uppercase mb-1">Código Postal</dt>
                <dd className="text-sm font-medium text-slate-900">{cliente.codigoPostal}</dd>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Notas */}
      {cliente.notas && (
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <span>📝</span> Notas
          </h3>
          <p className="text-sm text-slate-700 whitespace-pre-wrap">{cliente.notas}</p>
        </div>
      )}

      {/* Información Adicional */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <h3 className="font-semibold text-slate-900 mb-4">Información del Sistema</h3>
        <dl className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
          <div>
            <dt className="text-xs text-slate-500 uppercase mb-1">Registrado</dt>
            <dd className="font-medium text-slate-900">
              {new Date(cliente.createdAt).toLocaleDateString('es-MX')}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-slate-500 uppercase mb-1">Última actualización</dt>
            <dd className="font-medium text-slate-900">
              {new Date(cliente.updatedAt).toLocaleDateString('es-MX')}
            </dd>
          </div>
          {cliente.creditoActivo && (
            <div>
              <dt className="text-xs text-slate-500 uppercase mb-1">Límite de Crédito</dt>
              <dd className="font-medium text-slate-900">
                ${Number(cliente.limiteCredito || 0).toFixed(2)}
              </dd>
            </div>
          )}
        </dl>
      </div>

      {/* Acciones */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <h3 className="font-semibold text-slate-900 mb-4">Acciones</h3>
        <div className="flex gap-3">
          <a
            href={`/admin/empresas/${params.id}/clientes/${params.clienteId}/editar`}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Editar Información
          </a>
          {cliente.activo ? (
            <button className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700">
              Desactivar Cliente
            </button>
          ) : (
            <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
              Activar Cliente
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
