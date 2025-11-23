import { db } from '@/lib/db'
import { empresas, cajas, sucursales, turnos, usuarios } from '@/lib/db/schema'
import { eq, and, desc } from 'drizzle-orm'
import { redirect } from 'next/navigation'

export default async function CajaDetallesPage({
  params
}: {
  params: { id: string; cajaId: string }
}) {
  const [cajaData] = await db
    .select({
      caja: cajas,
      sucursal: sucursales,
      empresa: empresas,
    })
    .from(cajas)
    .leftJoin(sucursales, eq(cajas.sucursalId, sucursales.id))
    .leftJoin(empresas, eq(cajas.empresaId, empresas.id))
    .where(and(
      eq(cajas.id, params.cajaId),
      eq(cajas.empresaId, params.id)
    ))
    .limit(1)

  if (!cajaData || !cajaData.caja) {
    redirect(`/admin/empresas/${params.id}/cajas`)
  }

  const { caja, sucursal, empresa } = cajaData

  // Obtener turnos recientes de esta caja
  const turnosRecientes = await db
    .select({
      turno: turnos,
      usuario: usuarios,
    })
    .from(turnos)
    .leftJoin(usuarios, eq(turnos.usuarioId, usuarios.id))
    .where(eq(turnos.cajaId, params.cajaId))
    .orderBy(desc(turnos.createdAt))
    .limit(5)

  // Estadísticas
  const turnoAbierto = turnosRecientes.find(t => t.turno.estado === 'abierto')
  const totalTurnos = turnosRecientes.length

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-slate-900">{caja.nombre}</h1>
            <span className={`px-3 py-1 text-sm font-semibold rounded-full border ${
              caja.activa
                ? 'bg-green-100 text-green-800 border-green-200'
                : 'bg-red-100 text-red-800 border-red-200'
            }`}>
              {caja.activa ? 'Activa' : 'Inactiva'}
            </span>
            {turnoAbierto && (
              <span className="px-3 py-1 text-sm font-semibold rounded-full bg-blue-100 text-blue-800 border border-blue-200">
                Turno Abierto
              </span>
            )}
          </div>
          <p className="text-slate-600">{empresa?.nombre}</p>
          {caja.codigo && (
            <p className="text-sm text-slate-500 font-mono mt-1">#{caja.codigo}</p>
          )}
        </div>
        <div className="flex gap-2">
          <a
            href={`/admin/empresas/${params.id}/cajas/${params.cajaId}/editar`}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Editar
          </a>
          <a
            href={`/admin/empresas/${params.id}/cajas`}
            className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300"
          >
            ← Volver
          </a>
        </div>
      </div>

      {/* Información */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Información General */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <span>🏪</span> Información General
          </h3>
          <dl className="space-y-3">
            <div>
              <dt className="text-xs text-slate-500 uppercase mb-1">Nombre</dt>
              <dd className="text-sm font-medium text-slate-900">{caja.nombre}</dd>
            </div>
            {caja.codigo && (
              <div>
                <dt className="text-xs text-slate-500 uppercase mb-1">Código</dt>
                <dd className="text-sm font-medium text-slate-900 font-mono">{caja.codigo}</dd>
              </div>
            )}
            <div>
              <dt className="text-xs text-slate-500 uppercase mb-1">Sucursal</dt>
              <dd className="text-sm font-medium text-slate-900">{sucursal?.nombre || 'N/A'}</dd>
            </div>
            {caja.ubicacion && (
              <div>
                <dt className="text-xs text-slate-500 uppercase mb-1">Ubicación</dt>
                <dd className="text-sm font-medium text-slate-900">{caja.ubicacion}</dd>
              </div>
            )}
            <div>
              <dt className="text-xs text-slate-500 uppercase mb-1">Estado</dt>
              <dd>
                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  caja.activa
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {caja.activa ? 'Activa' : 'Inactiva'}
                </span>
              </dd>
            </div>
          </dl>
        </div>

        {/* Estadísticas */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <span>📊</span> Estadísticas
          </h3>
          <dl className="space-y-3">
            <div>
              <dt className="text-xs text-slate-500 uppercase mb-1">Estado Actual</dt>
              <dd className="text-sm font-medium text-slate-900">
                {turnoAbierto ? (
                  <span className="text-blue-600">Turno abierto</span>
                ) : (
                  <span className="text-slate-400">Sin turno activo</span>
                )}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-slate-500 uppercase mb-1">Total de Turnos</dt>
              <dd className="text-sm font-medium text-slate-900">{totalTurnos}</dd>
            </div>
            {turnoAbierto && (
              <>
                <div>
                  <dt className="text-xs text-slate-500 uppercase mb-1">Cajero Actual</dt>
                  <dd className="text-sm font-medium text-slate-900">
                    {turnosRecientes.find(t => t.turno.id === turnoAbierto.turno.id)?.usuario?.nombre || 'N/A'}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-slate-500 uppercase mb-1">Fondo Inicial</dt>
                  <dd className="text-sm font-medium text-slate-900">
                    ${Number(turnoAbierto.turno.fondoInicial).toFixed(2)}
                  </dd>
                </div>
              </>
            )}
          </dl>
        </div>
      </div>

      {/* Descripción */}
      {caja.descripcion && (
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <span>📝</span> Descripción
          </h3>
          <p className="text-sm text-slate-700 whitespace-pre-wrap">{caja.descripcion}</p>
        </div>
      )}

      {/* Turnos Recientes */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200">
        <div className="p-6 border-b border-slate-200 flex justify-between items-center">
          <h3 className="font-semibold text-slate-900">Turnos Recientes ({totalTurnos})</h3>
          <a
            href={`/admin/empresas/${params.id}/turnos?caja=${params.cajaId}`}
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            Ver todos →
          </a>
        </div>

        {turnosRecientes.length > 0 ? (
          <div className="divide-y divide-slate-200">
            {turnosRecientes.map(({ turno, usuario }) => (
              <div key={turno.id} className="p-4 hover:bg-slate-50">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-medium text-slate-900 capitalize">{turno.tipoTurno}</span>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        turno.estado === 'abierto'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-slate-100 text-slate-800'
                      }`}>
                        {turno.estado}
                      </span>
                    </div>
                    <div className="text-sm text-slate-600 space-y-1">
                      <p>Cajero: {usuario?.nombre || 'N/A'}</p>
                      <p>Apertura: {new Date(turno.fechaApertura).toLocaleString('es-MX')}</p>
                      {turno.fechaCierre && (
                        <p>Cierre: {new Date(turno.fechaCierre).toLocaleString('es-MX')}</p>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-slate-900">
                      ${Number(turno.totalVentas).toFixed(2)}
                    </div>
                    <div className="text-xs text-slate-500">Total ventas</div>
                    <a
                      href={`/admin/empresas/${params.id}/turnos/${turno.id}`}
                      className="text-sm text-blue-600 hover:text-blue-700 mt-2 inline-block"
                    >
                      Ver detalles →
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center text-slate-400">
            <div className="text-4xl mb-2">⏰</div>
            <p>No hay turnos registrados</p>
          </div>
        )}
      </div>

      {/* Información del Sistema */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <h3 className="font-semibold text-slate-900 mb-4">Información del Sistema</h3>
        <dl className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
          <div>
            <dt className="text-xs text-slate-500 uppercase mb-1">Creada</dt>
            <dd className="font-medium text-slate-900">
              {new Date(caja.createdAt).toLocaleDateString('es-MX')}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-slate-500 uppercase mb-1">Última actualización</dt>
            <dd className="font-medium text-slate-900">
              {new Date(caja.updatedAt).toLocaleDateString('es-MX')}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-slate-500 uppercase mb-1">ID</dt>
            <dd className="font-medium text-slate-900 font-mono text-xs">{caja.id}</dd>
          </div>
        </dl>
      </div>

      {/* Acciones */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <h3 className="font-semibold text-slate-900 mb-4">Acciones</h3>
        <div className="flex gap-3">
          {!turnoAbierto && caja.activa && (
            <a
              href={`/admin/empresas/${params.id}/turnos/abrir?caja=${params.cajaId}`}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              ✅ Abrir Turno
            </a>
          )}
          {turnoAbierto && (
            <a
              href={`/admin/empresas/${params.id}/turnos/${turnoAbierto.turno.id}/cerrar`}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              🔒 Cerrar Turno
            </a>
          )}
          <a
            href={`/admin/empresas/${params.id}/cajas/${params.cajaId}/editar`}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Editar Información
          </a>
          {caja.activa ? (
            <button className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700">
              Desactivar Caja
            </button>
          ) : (
            <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700">
              Activar Caja
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
