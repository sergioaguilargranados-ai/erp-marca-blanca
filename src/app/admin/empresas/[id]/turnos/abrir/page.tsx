import { db } from '@/lib/db'
import { empresas, cajas, sucursales, turnos, usuarios } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'
import { redirect } from 'next/navigation'
import { FormularioAperturaTurno } from './form-apertura'

export default async function AbrirTurnoPage({
  params,
  searchParams
}: {
  params: { id: string }
  searchParams: { caja?: string }
}) {
  const [empresa] = await db
    .select()
    .from(empresas)
    .where(eq(empresas.id, params.id))
    .limit(1)

  if (!empresa) {
    redirect('/admin/empresas')
  }

  // Obtener cajas activas con sucursales
  const cajasActivas = await db
    .select({
      caja: cajas,
      sucursal: sucursales,
    })
    .from(cajas)
    .leftJoin(sucursales, eq(cajas.sucursalId, sucursales.id))
    .where(and(
      eq(cajas.empresaId, params.id),
      eq(cajas.activa, true)
    ))

  // Obtener usuarios para seleccionar cajero
  const usuariosEmpresa = await db
    .select()
    .from(usuarios)
    .where(and(
      eq(usuarios.empresaId, params.id),
      eq(usuarios.activo, true)
    ))

  // Verificar si hay cajas con turnos abiertos
  const turnosAbiertos = await db
    .select({
      turno: turnos,
      caja: cajas,
    })
    .from(turnos)
    .leftJoin(cajas, eq(turnos.cajaId, cajas.id))
    .where(and(
      eq(turnos.estado, 'abierto'),
      eq(cajas.empresaId, params.id)
    ))

  const cajasConTurnoAbierto = turnosAbiertos.map(t => t.turno.cajaId)

  // Filtrar cajas disponibles (sin turno abierto)
  const cajasDisponibles = cajasActivas.filter(
    c => !cajasConTurnoAbierto.includes(c.caja.id)
  )

  if (cajasDisponibles.length === 0 && cajasActivas.length > 0) {
    return (
      <div className="max-w-2xl mx-auto mt-12">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-yellow-900 mb-2">
            ⚠️ Todas las cajas tienen turnos abiertos
          </h2>
          <p className="text-yellow-800 mb-4">
            Debes cerrar un turno antes de abrir uno nuevo.
          </p>
          <div className="flex gap-3">
            <a
              href={`/admin/empresas/${params.id}/turnos`}
              className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
            >
              Ver Turnos Abiertos
            </a>
            <a
              href={`/admin/empresas/${params.id}/cajas`}
              className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300"
            >
              ← Volver
            </a>
          </div>
        </div>
      </div>
    )
  }

  if (cajasActivas.length === 0) {
    return (
      <div className="max-w-2xl mx-auto mt-12">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-yellow-900 mb-2">
            ⚠️ No hay cajas activas
          </h2>
          <p className="text-yellow-800 mb-4">
            Debes crear al menos una caja activa antes de abrir un turno.
          </p>
          <a
            href={`/admin/empresas/${params.id}/cajas/nueva`}
            className="inline-block px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
          >
            Crear Caja
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Abrir Turno de Caja</h1>
            <p className="text-slate-600 mt-1">Iniciar un nuevo turno de trabajo</p>
            <p className="text-sm text-slate-500 mt-1">Empresa: {empresa.nombre}</p>
          </div>
          <a
            href={`/admin/empresas/${params.id}/turnos`}
            className="text-slate-600 hover:text-slate-900"
          >
            ← Volver
          </a>
        </div>

        {turnosAbiertos.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-blue-900 mb-2">ℹ️ Turnos Abiertos Actualmente</h3>
            <div className="space-y-1 text-sm text-blue-800">
              {turnosAbiertos.map(({ turno, caja }) => (
                <p key={turno.id}>
                  • {caja?.nombre} - Abierto desde {new Date(turno.fechaApertura).toLocaleString('es-MX')}
                </p>
              ))}
            </div>
          </div>
        )}

        <FormularioAperturaTurno
          empresaId={params.id}
          cajasDisponibles={cajasDisponibles.map(({ caja, sucursal }) => ({
            id: caja.id,
            nombre: caja.nombre,
            codigo: caja.codigo,
            sucursalNombre: sucursal?.nombre || 'N/A'
          }))}
          usuarios={usuariosEmpresa.map(u => ({
            id: u.id,
            nombre: u.nombre
          }))}
          cajaPreseleccionada={searchParams.caja}
        />
      </div>
    </div>
  )
}
