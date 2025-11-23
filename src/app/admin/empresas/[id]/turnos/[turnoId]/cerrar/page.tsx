import { db } from '@/lib/db'
import { empresas, turnos, cajas, usuarios, ventas, movimientosCaja } from '@/lib/db/schema'
import { eq, and, between } from 'drizzle-orm'
import { redirect } from 'next/navigation'
import { FormularioCierreTurno } from './form-cierre'

export default async function CerrarTurnoPage({
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

  // Verificar que el turno está abierto
  if (turno.estado === 'cerrado') {
    return (
      <div className="max-w-2xl mx-auto mt-12">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-yellow-900 mb-2">
            ⚠️ Este turno ya está cerrado
          </h2>
          <p className="text-yellow-800 mb-4">
            El turno fue cerrado el {new Date(turno.fechaCierre!).toLocaleString('es-MX')}
          </p>
          <a
            href={`/admin/empresas/${params.id}/turnos/${params.turnoId}`}
            className="inline-block px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
          >
            Ver Detalles del Turno
          </a>
        </div>
      </div>
    )
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
      between(ventas.createdAt, turno.fechaApertura, new Date())
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

  const totalVentas = ventasEfectivo + ventasTarjeta + ventasTransferencia

  const ingresosAdicionales = movimientosTurno
    .filter(m => m.tipo === 'ingreso')
    .reduce((sum, m) => sum + Number(m.monto), 0)

  const retiros = movimientosTurno
    .filter(m => m.tipo === 'retiro')
    .reduce((sum, m) => sum + Number(m.monto), 0)

  const efectivoEsperado = Number(turno.fondoInicial) + ventasEfectivo + ingresosAdicionales - retiros

  return (
    <div className="max-w-5xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Cerrar Turno</h1>
            <p className="text-slate-600 mt-1 capitalize">
              {turno.tipoTurno} - {caja.nombre}
            </p>
            <p className="text-sm text-slate-500 mt-1">
              Cajero: {usuario?.nombre} | Empresa: {empresa?.nombre}
            </p>
          </div>
          <a
            href={`/admin/empresas/${params.id}/turnos/${params.turnoId}`}
            className="text-slate-600 hover:text-slate-900"
          >
            ← Volver
          </a>
        </div>

        {/* Resumen del Turno */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
          <h3 className="font-semibold text-blue-900 mb-4">📊 Resumen del Turno</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-medium text-blue-800 mb-3">Ventas</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-blue-700">Efectivo:</span>
                  <span className="font-semibold text-blue-900">${ventasEfectivo.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-700">Tarjeta:</span>
                  <span className="font-semibold text-blue-900">${ventasTarjeta.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-700">Transferencia:</span>
                  <span className="font-semibold text-blue-900">${ventasTransferencia.toFixed(2)}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-blue-300">
                  <span className="font-semibold text-blue-900">Total Ventas:</span>
                  <span className="font-bold text-lg text-blue-900">${totalVentas.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-blue-800 mb-3">Efectivo Esperado</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-blue-700">Fondo inicial:</span>
                  <span className="font-semibold text-blue-900">${Number(turno.fondoInicial).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-700">+ Ventas efectivo:</span>
                  <span className="font-semibold text-green-700">+${ventasEfectivo.toFixed(2)}</span>
                </div>
                {ingresosAdicionales > 0 && (
                  <div className="flex justify-between">
                    <span className="text-blue-700">+ Ingresos:</span>
                    <span className="font-semibold text-green-700">+${ingresosAdicionales.toFixed(2)}</span>
                  </div>
                )}
                {retiros > 0 && (
                  <div className="flex justify-between">
                    <span className="text-blue-700">- Retiros:</span>
                    <span className="font-semibold text-red-700">-${retiros.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between pt-2 border-t border-blue-300">
                  <span className="font-semibold text-blue-900">Efectivo Esperado:</span>
                  <span className="font-bold text-2xl text-blue-900">${efectivoEsperado.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Formulario de Cierre */}
        <FormularioCierreTurno
          empresaId={params.id}
          turnoId={params.turnoId}
          efectivoEsperado={efectivoEsperado}
          ventasEfectivo={ventasEfectivo}
          ventasTarjeta={ventasTarjeta}
          ventasTransferencia={ventasTransferencia}
          totalVentas={totalVentas}
          ingresosAdicionales={ingresosAdicionales}
          retiros={retiros}
        />
      </div>
    </div>
  )
}
