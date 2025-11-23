import { db } from '@/lib/db'
import { empresas, sucursales } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'
import { redirect } from 'next/navigation'

export default async function SucursalDetallesPage({
  params
}: {
  params: { id: string; sucursalId: string }
}) {
  const [empresaData] = await db
    .select({
      empresa: empresas,
      sucursal: sucursales,
    })
    .from(sucursales)
    .leftJoin(empresas, eq(sucursales.empresaId, empresas.id))
    .where(and(
      eq(sucursales.id, params.sucursalId),
      eq(sucursales.empresaId, params.id)
    ))
    .limit(1)

  if (!empresaData || !empresaData.sucursal) {
    redirect(`/admin/empresas/${params.id}/sucursales`)
  }

  const { empresa, sucursal } = empresaData

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-slate-900">{sucursal.nombre}</h1>
            <span className={`px-3 py-1 text-sm font-semibold rounded-full border ${
              sucursal.activa
                ? 'bg-green-100 text-green-800 border-green-200'
                : 'bg-red-100 text-red-800 border-red-200'
            }`}>
              {sucursal.activa ? 'Activa' : 'Inactiva'}
            </span>
          </div>
          <p className="text-slate-600">
            Empresa: {empresa?.nombre}
          </p>
          {sucursal.codigo && (
            <p className="text-sm text-slate-500 font-mono mt-1">
              Código: #{sucursal.codigo}
            </p>
          )}
        </div>
        <div className="flex gap-2">
          <a
            href={`/admin/empresas/${params.id}/sucursales/${params.sucursalId}/editar`}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Editar
          </a>
          <a
            href={`/admin/empresas/${params.id}/sucursales`}
            className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300"
          >
            ← Volver
          </a>
        </div>
      </div>

      {/* Grid de información */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Ubicación */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <span>📍</span> Ubicación
          </h3>
          <dl className="space-y-3">
            {sucursal.direccion && (
              <div>
                <dt className="text-xs text-slate-500 uppercase">Dirección</dt>
                <dd className="text-sm font-medium text-slate-900">{sucursal.direccion}</dd>
              </div>
            )}
            {sucursal.ciudad && (
              <div>
                <dt className="text-xs text-slate-500 uppercase">Ciudad</dt>
                <dd className="text-sm font-medium text-slate-900">{sucursal.ciudad}</dd>
              </div>
            )}
            {sucursal.estado && (
              <div>
                <dt className="text-xs text-slate-500 uppercase">Estado</dt>
                <dd className="text-sm font-medium text-slate-900">{sucursal.estado}</dd>
              </div>
            )}
            {sucursal.codigoPostal && (
              <div>
                <dt className="text-xs text-slate-500 uppercase">Código Postal</dt>
                <dd className="text-sm font-medium text-slate-900">{sucursal.codigoPostal}</dd>
              </div>
            )}
            <div>
              <dt className="text-xs text-slate-500 uppercase">País</dt>
              <dd className="text-sm font-medium text-slate-900">
                {sucursal.pais === 'MEX' ? 'México' : sucursal.pais === 'USA' ? 'Estados Unidos' : sucursal.pais}
              </dd>
            </div>
          </dl>
        </div>

        {/* Contacto */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <span>📞</span> Contacto
          </h3>
          <dl className="space-y-3">
            {sucursal.telefono ? (
              <div>
                <dt className="text-xs text-slate-500 uppercase">Teléfono</dt>
                <dd className="text-sm font-medium text-slate-900">{sucursal.telefono}</dd>
              </div>
            ) : (
              <div className="text-sm text-slate-400">No hay teléfono registrado</div>
            )}
            {sucursal.email ? (
              <div>
                <dt className="text-xs text-slate-500 uppercase">Email</dt>
                <dd className="text-sm font-medium text-slate-900">{sucursal.email}</dd>
              </div>
            ) : (
              <div className="text-sm text-slate-400">No hay email registrado</div>
            )}
          </dl>
        </div>

        {/* Configuración */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <span>⚙️</span> Configuración
          </h3>
          <dl className="space-y-3">
            <div>
              <dt className="text-xs text-slate-500 uppercase">Moneda</dt>
              <dd className="text-sm font-medium text-slate-900">
                {sucursal.moneda === 'MXN' ? 'Pesos Mexicanos (MXN)' : 'Dólares (USD)'}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-slate-500 uppercase">Tasa de IVA</dt>
              <dd className="text-sm font-medium text-slate-900">{sucursal.tasaIva}%</dd>
            </div>
            <div>
              <dt className="text-xs text-slate-500 uppercase">Registrada</dt>
              <dd className="text-sm font-medium text-slate-900">
                {new Date(sucursal.createdAt).toLocaleDateString('es-MX')}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-slate-500 uppercase">Última actualización</dt>
              <dd className="text-sm font-medium text-slate-900">
                {new Date(sucursal.updatedAt).toLocaleDateString('es-MX')}
              </dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Datos Fiscales */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
          <span>🧾</span> Información Fiscal
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <dt className="text-xs text-slate-500 uppercase mb-1">RFC</dt>
            <dd className="text-sm font-medium text-slate-900 font-mono">
              {sucursal.rfc || <span className="text-slate-400">No registrado</span>}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-slate-500 uppercase mb-1">Razón Social</dt>
            <dd className="text-sm font-medium text-slate-900">
              {sucursal.razonSocial || <span className="text-slate-400">No registrada</span>}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-slate-500 uppercase mb-1">Régimen Fiscal</dt>
            <dd className="text-sm font-medium text-slate-900 font-mono">
              {sucursal.regimenFiscal || <span className="text-slate-400">No registrado</span>}
            </dd>
          </div>
        </div>
      </div>

      {/* Acciones */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <h3 className="font-semibold text-slate-900 mb-4">Acciones</h3>
        <div className="flex gap-3">
          <a
            href={`/admin/empresas/${params.id}/sucursales/${params.sucursalId}/editar`}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Editar Información
          </a>
          {sucursal.activa ? (
            <button className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700">
              Desactivar Sucursal
            </button>
          ) : (
            <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
              Activar Sucursal
            </button>
          )}
          <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
            Eliminar Sucursal
          </button>
        </div>
      </div>
    </div>
  )
}
