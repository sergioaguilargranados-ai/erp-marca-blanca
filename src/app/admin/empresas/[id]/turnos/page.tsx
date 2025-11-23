import { db } from '@/lib/db'
import { empresas, turnos, cajas, usuarios } from '@/lib/db/schema'
import { eq, desc, and } from 'drizzle-orm'
import { redirect } from 'next/navigation'

export default async function TurnosPage({
  params,
  searchParams
}: {
  params: { id: string }
  searchParams: { estado?: string }
}) {
  const [empresa] = await db
    .select()
    .from(empresas)
    .where(eq(empresas.id, params.id))
    .limit(1)

  if (!empresa) {
    redirect('/admin/empresas')
  }

  // Obtener cajas de la empresa
  const cajasEmpresa = await db
    .select()
    .from(cajas)
    .where(eq(cajas.empresaId, params.id))

  // Construir filtros
  const condiciones: any[] = []

  // Filtrar solo turnos de cajas de esta empresa
  const cajasIds = cajasEmpresa.map(c => c.id)
  if (cajasIds.length > 0) {
    condiciones.push(eq(turnos.cajaId, cajasIds[0])) // Temporal, mejorar con OR
  }

  if (searchParams.estado) {
    condiciones.push(eq(turnos.estado, searchParams.estado))
  }

  // Obtener turnos con relaciones
  const turnosEmpresa = await db
    .select({
      turno: turnos,
      caja: cajas,
      usuario: usuarios,
    })
    .from(turnos)
    .leftJoin(cajas, eq(turnos.cajaId, cajas.id))
    .leftJoin(usuarios, eq(turnos.usuarioId, usuarios.id))
    .where(condiciones.length > 0 ? and(...condiciones) : undefined)
    .orderBy(desc(turnos.createdAt))
    .limit(50)

  // Estadísticas
  const totalTurnos = turnosEmpresa.length
  const turnosAbiertos = turnosEmpresa.filter(t => t.turno.estado === 'abierto').length
  const turnosCerrados = turnosEmpresa.filter(t => t.turno.estado === 'cerrado').length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Turnos de Caja</h1>
          <p className="text-slate-600 mt-1">
            Control de turnos de {empresa.nombre}
          </p>
          <p className="text-sm text-slate-500 mt-1">
            {totalTurnos} turnos registrados
          </p>
        </div>
        <div className="flex gap-2">
          <a
            href={`/admin/empresas/${params.id}/turnos/abrir`}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            ✅ Abrir Turno
          </a>
          <a
            href={`/admin/empresas/${params.id}/cajas`}
            className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
          >
            🏪 Cajas
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <div className="flex items-center gap-3">
            <div className="text-3xl">📊</div>
            <div>
              <div className="text-2xl font-bold text-slate-900">{totalTurnos}</div>
              <div className="text-sm text-slate-600">Total turnos</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <div className="flex items-center gap-3">
            <div className="text-3xl">✅</div>
            <div>
              <div className="text-2xl font-bold text-green-600">{turnosAbiertos}</div>
              <div className="text-sm text-slate-600">Turnos abiertos</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <div className="flex items-center gap-3">
            <div className="text-3xl">🔒</div>
            <div>
              <div className="text-2xl font-bold text-slate-900">{turnosCerrados}</div>
              <div className="text-sm text-slate-600">Turnos cerrados</div>
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
              <option value="abierto">Abiertos</option>
              <option value="cerrado">Cerrados</option>
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
                href={`/admin/empresas/${params.id}/turnos`}
                className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300"
              >
                Limpiar
              </a>
            )}
          </div>
        </form>
      </div>

      {/* Tabla de turnos */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Turno
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Caja
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Cajero
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Apertura
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Cierre
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                Total Ventas
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
            {turnosEmpresa.map(({ turno, caja, usuario }) => (
              <tr key={turno.id} className="hover:bg-slate-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-slate-900 capitalize">
                    {turno.tipoTurno}
                  </div>
                  <div className="text-xs text-slate-500">
                    {new Date(turno.fechaApertura).toLocaleDateString('es-MX')}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-slate-900">{caja?.nombre || 'N/A'}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-slate-900">{usuario?.nombre || 'N/A'}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-slate-900">
                    {new Date(turno.fechaApertura).toLocaleTimeString('es-MX')}
                  </div>
                  <div className="text-xs text-slate-500">
                    Fondo: ${Number(turno.fondoInicial).toFixed(2)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {turno.fechaCierre ? (
                    <div className="text-sm text-slate-900">
                      {new Date(turno.fechaCierre).toLocaleTimeString('es-MX')}
                    </div>
                  ) : (
                    <span className="text-sm text-slate-400">En curso</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <div className="text-sm font-semibold text-slate-900">
                    ${Number(turno.totalVentas).toFixed(2)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      turno.estado === 'abierto'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-slate-100 text-slate-800'
                    }`}
                  >
                    {turno.estado}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <a
                    href={`/admin/empresas/${params.id}/turnos/${turno.id}`}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    Ver detalles
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {turnosEmpresa.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">⏰</div>
            <p className="text-slate-500 mb-4">No hay turnos registrados</p>
            <a
              href={`/admin/empresas/${params.id}/turnos/abrir`}
              className="inline-block px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Abrir Primer Turno
            </a>
          </div>
        )}
      </div>
    </div>
  )
}
