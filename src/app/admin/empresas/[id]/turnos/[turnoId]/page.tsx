import { db } from '@/lib/db'
import { empresas, turnos, cajas, usuarios, ventas, movimientosCaja } from '@/lib/db/schema'
import { eq, and, between } from 'drizzle-orm'
import { redirect } from 'next/navigation'

export default async function TurnoDetallesPage({
  params
}: {
  params: { id: string; turnoId: string }
}) {
  const [turnoData] = await db
    .select({
      turno: turnos,
      caja: cajas,
      usuario: usuarios,
    })
    .from(turnos)
    .leftJoin(cajas, eq(turnos.cajaId, cajas.id))
    .leftJoin(usuarios, eq(turnos.usuarioId, usuarios.id))
    .where(eq(turnos.id, params.turnoId))
    .limit(1)

  if (!turnoData) {
    redirect(`/admin/empresas/${params.id}/turnos`)
  }

  const { turno, caja, usuario } = turnoData

  // Verificar que el turno pertenece a una caja de esta empresa
  if (!caja || caja.empresaId !== params.id) {
    redirect(`/admin/empresas/${params.id}/turnos`)
  }

  const [empresa] = await db
    .select()
    .from(empresas)
    .where(eq(empresas.id, params.id))
    .limit(1)

  // Obtener ventas del turno
  const ventasTurno = await db
    .select()
    .from(ventas)
    .where(and(
      eq(ventas.empresaId, params.id),
      between(ventas.createdAt, turno.fechaApertura, turno.fechaCierre || new Date())
    ))

  // Obtener movimientos de caja del turno
  const movimientosTurno = await db
    .select()
    .from(movimientosCaja)
    .where(eq(movimientosCaja.turnoId, params.turnoId))

  // Calcular totales
  const ventasEfectivo = ventasTurno
    .filter(v => v.metodoPago === 'efectivo' && v.estado === 'completada')
    .reduce((sum, v) => sum + Number(v.total), 0)

  const ventasTarjeta = ventasTurno
    .filter(v => v.metodoPago === 'tarjeta' && v.estado === 'completada')
    .reduce((sum, v) => sum + Number(v.total), 0)

  const ventasTransferencia = ventasTurno
    .filter(v => v.metodoPago === 'transferencia' && v.estado === 'completada')
    .reduce((sum, v) => sum + Number(v.total), 0)

  const totalVentasCalculado = ventasEfectivo + ventasTarjeta + ventasTransferencia

  const ingresosAdicionales = movimientosTurno
    .filter(m => m.tipo === 'ingreso')
    .reduce((sum, m) => sum + Number(m.monto), 0)

  const retiros = movimientosTurno
    .filter(m => m.tipo === 'retiro')
    .reduce((sum, m) => sum + Number(m.monto), 0)

  const efectivoEsperado = Number(turno.fondoInicial) + ventasEfectivo + ingresosAdicionales - retiros

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-slate-900 capitalize">Turno {turno.tipoTurno}</h1>
            <span className={`px-3 py-1 text-sm font-semibold rounded-full border ${
              turno.estado === 'abierto'
                ? 'bg-green-100 text-green-800 border-green-200'
                : 'bg-slate-100 text-slate-800 border-slate-200'
            }`}>
              {turno.estado}
            </span>
          </div>
          <p className="text-slate-600">{empresa?.nombre}</p>
          <p className="text-sm text-slate-500 mt-1">
            {caja.nombre} - {usuario?.nombre}
          </p>
        </div>
        <div className="flex gap-2">
          {turno.estado === 'abierto' && (
            <a
              href={`/admin/empresas/${params.id}/turnos/${params.turnoId}/cerrar`}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              🔒 Cerrar Turno
            </a>
          )}
          <a
            href={`/admin/empresas/${params.id}/turnos`}
            className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300"
          >
            ← Volver
          </a>
        </div>
      </div>

      {/* Información del Turno */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <h3 className="font-semibold text-slate-900 mb-4">Información del Turno</h3>
          <dl className="space-y-3 text-sm">
            <div>
              <dt className="text-xs text-slate-500 uppercase mb-1">Apertura</dt>
              <dd className="font-medium text-slate-900">
                {new Date(turno.fechaApertura).toLocaleString('es-MX')}
              </dd>
            </div>
            {turno.fechaCierre && (
              <div>
                <dt className="text-xs text-slate-500 uppercase mb-1">Cierre</dt>
                <dd className="font-medium text-slate-900">
                  {new Date(turno.fechaCierre).toLocaleString('es-MX')}
                </dd>
              </div>
            )}
            <div>
              <dt className="text-xs text-slate-500 uppercase mb-1">Duración</dt>
              <dd className="font-medium text-slate-900">
                {turno.fechaCierre
                  ? `${Math.round((new Date(turno.fechaCierre).getTime() - new Date(turno.fechaApertura).getTime()) / (1000 * 60 * 60))} horas`
                  : 'En curso'
                }
              </dd>
            </div>
            <div>
              <dt className="text-xs text-slate-500 uppercase mb-1">Fondo Inicial</dt>
              <dd className="font-medium text-green-600">
                ${Number(turno.fondoInicial).toFixed(2)}
              </dd>
            </div>
          </dl>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <h3 className="font-semibold text-slate-900 mb-4">Ventas por Método de Pago</h3>
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-slate-600">Efectivo:</dt>
              <dd className="font-semibold text-green-600">
                ${ventasEfectivo.toFixed(2)}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-600">Tarjeta:</dt>
              <dd className="font-semibold text-blue-600">
                ${ventasTarjeta.toFixed(2)}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-600">Transferencia:</dt>
              <dd className="font-semibold text-purple-600">
                ${ventasTransferencia.toFixed(2)}
              </dd>
            </div>
            <div className="flex justify-between pt-3 border-t border-slate-200">
              <dt className="font-semibold text-slate-900">Total:</dt>
              <dd className="font-bold text-lg text-slate-900">
                ${totalVentasCalculado.toFixed(2)}
              </dd>
            </div>
            <div className="text-xs text-slate-500">
              {ventasTurno.filter(v => v.estado === 'completada').length} ventas completadas
            </div>
          </dl>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <h3 className="font-semibold text-slate-900 mb-4">Movimientos de Caja</h3>
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-slate-600">Ingresos adicionales:</dt>
              <dd className="font-semibold text-green-600">
                +${ingresosAdicionales.toFixed(2)}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-600">Retiros:</dt>
              <dd className="font-semibold text-red-600">
                -${retiros.toFixed(2)}
              </dd>
            </div>
            <div className="flex justify-between pt-3 border-t border-slate-200">
              <dt className="font-semibold text-slate-900">Efectivo esperado:</dt>
              <dd className="font-bold text-lg text-slate-900">
                ${efectivoEsperado.toFixed(2)}
              </dd>
            </div>
            <div className="text-xs text-slate-500">
              {movimientosTurno.length} movimiento{movimientosTurno.length !== 1 ? 's' : ''}
            </div>
          </dl>
        </div>
      </div>

      {/* Efectivo Esperado vs Real */}
      {turno.estado === 'cerrado' && turno.efectivoContado && (
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <h3 className="font-semibold text-slate-900 mb-4">Cuadre de Caja</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <dt className="text-xs text-slate-500 uppercase mb-1">Efectivo Esperado</dt>
              <dd className="text-2xl font-bold text-slate-900">
                ${Number(turno.efectivoEsperado).toFixed(2)}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-slate-500 uppercase mb-1">Efectivo Contado</dt>
              <dd className="text-2xl font-bold text-blue-600">
                ${Number(turno.efectivoContado).toFixed(2)}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-slate-500 uppercase mb-1">Diferencia</dt>
              <dd className={`text-2xl font-bold ${
                Number(turno.diferencia) === 0
                  ? 'text-green-600'
                  : Number(turno.diferencia) > 0
                  ? 'text-green-600'
                  : 'text-red-600'
              }`}>
                {Number(turno.diferencia) > 0 && '+'}
                ${Number(turno.diferencia).toFixed(2)}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-slate-500 uppercase mb-1">Estado</dt>
              <dd>
                {Number(turno.diferencia) === 0 ? (
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                    ✓ Cuadrado
                  </span>
                ) : (
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-semibold">
                    ⚠ Con diferencia
                  </span>
                )}
              </dd>
            </div>
          </div>
        </div>
      )}

      {/* Observaciones */}
      {(turno.observacionesApertura || turno.observacionesCierre) && (
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <h3 className="font-semibold text-slate-900 mb-4">Observaciones</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {turno.observacionesApertura && (
              <div>
                <h4 className="text-sm font-medium text-slate-700 mb-2">Apertura:</h4>
                <p className="text-sm text-slate-600 whitespace-pre-wrap">
                  {turno.observacionesApertura}
                </p>
              </div>
            )}
            {turno.observacionesCierre && (
              <div>
                <h4 className="text-sm font-medium text-slate-700 mb-2">Cierre:</h4>
                <p className="text-sm text-slate-600 whitespace-pre-wrap">
                  {turno.observacionesCierre}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Movimientos de Caja */}
      {movimientosTurno.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-slate-200">
          <div className="p-6 border-b border-slate-200">
            <h3 className="font-semibold text-slate-900">
              Movimientos de Caja ({movimientosTurno.length})
            </h3>
          </div>
          <div className="divide-y divide-slate-200">
            {movimientosTurno.map((movimiento) => (
              <div key={movimiento.id} className="p-4 hover:bg-slate-50">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        movimiento.tipo === 'ingreso'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {movimiento.tipo}
                      </span>
                      <span className="font-medium text-slate-900">{movimiento.concepto}</span>
                    </div>
                    {movimiento.observaciones && (
                      <p className="text-sm text-slate-600 mt-1">{movimiento.observaciones}</p>
                    )}
                    <p className="text-xs text-slate-500 mt-1">
                      {new Date(movimiento.createdAt).toLocaleString('es-MX')}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className={`text-lg font-bold ${
                      movimiento.tipo === 'ingreso' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {movimiento.tipo === 'ingreso' ? '+' : '-'}${Number(movimiento.monto).toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Acciones */}
      {turno.estado === 'abierto' && (
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <h3 className="font-semibold text-slate-900 mb-4">Acciones</h3>
          <div className="flex gap-3">
            <a
              href={`/admin/empresas/${params.id}/turnos/${params.turnoId}/movimiento`}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              💵 Registrar Movimiento
            </a>
            <a
              href={`/admin/empresas/${params.id}/turnos/${params.turnoId}/cerrar`}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              🔒 Cerrar Turno
            </a>
          </div>
        </div>
      )}
    </div>
  )
}
