import { db } from '@/lib/db'
import { empresas, sucursales, cajas } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { redirect } from 'next/navigation'

export default async function CajasPage({ params }: { params: { id: string } }) {
  const [empresa] = await db
    .select()
    .from(empresas)
    .where(eq(empresas.id, params.id))
    .limit(1)

  if (!empresa) {
    redirect('/admin/empresas')
  }

  // Obtener sucursales
  const sucursalesEmpresa = await db
    .select()
    .from(sucursales)
    .where(eq(sucursales.empresaId, params.id))

  // Obtener cajas con sucursales
  const cajasEmpresa = await db
    .select({
      caja: cajas,
      sucursal: sucursales,
    })
    .from(cajas)
    .leftJoin(sucursales, eq(cajas.sucursalId, sucursales.id))
    .where(eq(cajas.empresaId, params.id))
    .orderBy(cajas.createdAt)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Cajas Registradoras</h1>
          <p className="text-slate-600 mt-1">
            Gestión de cajas de {empresa.nombre}
          </p>
          <p className="text-sm text-slate-500 mt-1">
            {cajasEmpresa.length} cajas registradas
          </p>
        </div>
        <div className="flex gap-2">
          <a
            href={`/admin/empresas/${params.id}/turnos`}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            📊 Ver Turnos
          </a>
          <a
            href={`/admin/empresas/${params.id}/cajas/nueva`}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
          >
            + Nueva Caja
          </a>
          <a
            href={`/admin/empresas/${params.id}`}
            className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300"
          >
            ← Volver
          </a>
        </div>
      </div>

      {/* Grid de cajas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cajasEmpresa.map(({ caja, sucursal }) => (
          <div
            key={caja.id}
            className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">{caja.nombre}</h3>
                {caja.codigo && (
                  <p className="text-sm text-slate-500 font-mono mt-1">#{caja.codigo}</p>
                )}
              </div>
              <span
                className={`px-2 py-1 text-xs font-semibold rounded ${
                  caja.activa
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {caja.activa ? 'Activa' : 'Inactiva'}
              </span>
            </div>

            <div className="space-y-2 text-sm mb-4">
              <div className="flex items-center gap-2">
                <span className="text-slate-400">🏢</span>
                <span className="text-slate-600">{sucursal?.nombre || 'Sin sucursal'}</span>
              </div>
              {caja.ubicacion && (
                <div className="flex items-center gap-2">
                  <span className="text-slate-400">📍</span>
                  <span className="text-slate-600">{caja.ubicacion}</span>
                </div>
              )}
              {caja.descripcion && (
                <div className="text-slate-600 text-xs mt-2">
                  {caja.descripcion}
                </div>
              )}
            </div>

            <div className="flex gap-2 pt-4 border-t border-slate-200">
              <a
                href={`/admin/empresas/${params.id}/cajas/${caja.id}`}
                className="flex-1 text-center px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
              >
                Ver
              </a>
              <a
                href={`/admin/empresas/${params.id}/cajas/${caja.id}/editar`}
                className="flex-1 text-center px-3 py-2 bg-slate-200 text-slate-700 text-sm rounded-lg hover:bg-slate-300"
              >
                Editar
              </a>
            </div>
          </div>
        ))}

        {cajasEmpresa.length === 0 && (
          <div className="col-span-full text-center py-12 bg-white rounded-lg border-2 border-dashed border-slate-300">
            <div className="text-6xl mb-4">🏪</div>
            <p className="text-slate-500 mb-4">No hay cajas registradas</p>
            <a
              href={`/admin/empresas/${params.id}/cajas/nueva`}
              className="inline-block px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
            >
              Crear Primera Caja
            </a>
          </div>
        )}
      </div>
    </div>
  )
}
