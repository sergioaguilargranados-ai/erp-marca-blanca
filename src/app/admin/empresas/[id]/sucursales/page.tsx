import { db } from '@/lib/db'
import { empresas, sucursales } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { redirect } from 'next/navigation'

export default async function SucursalesEmpresaPage({ params }: { params: { id: string } }) {
  const [empresa] = await db
    .select()
    .from(empresas)
    .where(eq(empresas.id, params.id))
    .limit(1)

  if (!empresa) {
    redirect('/admin/empresas')
  }

  const sucursalesEmpresa = await db
    .select()
    .from(sucursales)
    .where(eq(sucursales.empresaId, params.id))
    .orderBy(sucursales.createdAt)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Sucursales</h1>
          <p className="text-slate-600 mt-1">
            Gestiona las sucursales de {empresa.nombre}
          </p>
          <p className="text-sm text-slate-500 mt-1">
            {sucursalesEmpresa.length} / {empresa.usoSucursales} sucursales
          </p>
        </div>
        <div className="flex gap-2">
          <a
            href={`/admin/empresas/${params.id}/sucursales/nueva`}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
          >
            + Nueva Sucursal
          </a>
          <a
            href={`/admin/empresas/${params.id}`}
            className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300"
          >
            ← Volver
          </a>
        </div>
      </div>

      {/* Lista de sucursales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sucursalesEmpresa.map((sucursal) => (
          <div
            key={sucursal.id}
            className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">{sucursal.nombre}</h3>
                {sucursal.codigo && (
                  <p className="text-sm text-slate-500 font-mono">#{sucursal.codigo}</p>
                )}
              </div>
              <span
                className={`px-2 py-1 text-xs font-semibold rounded ${
                  sucursal.activa
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {sucursal.activa ? 'Activa' : 'Inactiva'}
              </span>
            </div>

            <div className="space-y-2 text-sm mb-4">
              {sucursal.direccion && (
                <div className="flex items-start gap-2">
                  <span className="text-slate-400">📍</span>
                  <div className="text-slate-600">
                    {sucursal.direccion}
                    {sucursal.ciudad && `, ${sucursal.ciudad}`}
                    {sucursal.estado && `, ${sucursal.estado}`}
                  </div>
                </div>
              )}
              {sucursal.telefono && (
                <div className="flex items-center gap-2">
                  <span className="text-slate-400">📞</span>
                  <span className="text-slate-600">{sucursal.telefono}</span>
                </div>
              )}
              {sucursal.email && (
                <div className="flex items-center gap-2">
                  <span className="text-slate-400">✉️</span>
                  <span className="text-slate-600">{sucursal.email}</span>
                </div>
              )}
              <div className="flex items-center gap-2 pt-2 border-t border-slate-200">
                <span className="text-slate-400">💰</span>
                <span className="text-slate-600">
                  {sucursal.moneda} - IVA {sucursal.tasaIva}%
                </span>
              </div>
            </div>

            <div className="flex gap-2">
              <a
                href={`/admin/empresas/${params.id}/sucursales/${sucursal.id}`}
                className="flex-1 text-center px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
              >
                Ver Detalles
              </a>
              <a
                href={`/admin/empresas/${params.id}/sucursales/${sucursal.id}/editar`}
                className="flex-1 text-center px-3 py-2 bg-slate-200 text-slate-700 text-sm rounded-lg hover:bg-slate-300"
              >
                Editar
              </a>
            </div>
          </div>
        ))}

        {sucursalesEmpresa.length === 0 && (
          <div className="col-span-full text-center py-12 bg-white rounded-lg border-2 border-dashed border-slate-300">
            <p className="text-slate-500 mb-4">No hay sucursales registradas</p>
            <a
              href={`/admin/empresas/${params.id}/sucursales/nueva`}
              className="inline-block px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
            >
              Crear Primera Sucursal
            </a>
          </div>
        )}
      </div>
    </div>
  )
}
