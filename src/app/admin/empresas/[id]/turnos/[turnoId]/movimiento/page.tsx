import { db } from '@/lib/db'
import { empresas, turnos, cajas, usuarios } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { redirect } from 'next/navigation'
import { FormularioMovimientoCaja } from './form-movimiento'

export default async function RegistrarMovimientoPage({
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
            No se pueden registrar movimientos en un turno cerrado.
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

  // Obtener usuarios para autorización (opcional)
  const usuariosEmpresa = await db
    .select()
    .from(usuarios)
    .where(eq(usuarios.empresaId, params.id))

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Registrar Movimiento de Caja</h1>
            <p className="text-slate-600 mt-1 capitalize">
              Turno {turno.tipoTurno} - {caja.nombre}
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

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-blue-900 mb-2">ℹ️ Información</h3>
          <p className="text-sm text-blue-800">
            Los movimientos de caja afectan el efectivo esperado al cierre del turno.
            Los ingresos suman al efectivo, los retiros restan.
          </p>
        </div>

        <FormularioMovimientoCaja
          empresaId={params.id}
          turnoId={params.turnoId}
          usuarios={usuariosEmpresa.map(u => ({ id: u.id, nombre: u.nombre }))}
        />
      </div>
    </div>
  )
}
