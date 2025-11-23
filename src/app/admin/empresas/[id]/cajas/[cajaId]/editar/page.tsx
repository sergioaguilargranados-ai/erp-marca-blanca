import { db } from '@/lib/db'
import { empresas, cajas, sucursales } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'
import { redirect } from 'next/navigation'

export default async function EditarCajaPage({
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

  const { caja, empresa } = cajaData

  const sucursalesEmpresa = await db
    .select()
    .from(sucursales)
    .where(eq(sucursales.empresaId, params.id))

  const actualizar = async (formData: FormData) => {
    'use server'

    const nombre = formData.get('nombre') as string
    const codigo = formData.get('codigo') as string
    const sucursalId = formData.get('sucursalId') as string
    const ubicacion = formData.get('ubicacion') as string
    const descripcion = formData.get('descripcion') as string
    const activa = formData.get('activa') === 'true'

    await db
      .update(cajas)
      .set({
        nombre,
        codigo: codigo || null,
        sucursalId,
        ubicacion: ubicacion || null,
        descripcion: descripcion || null,
        activa,
        updatedAt: new Date(),
      })
      .where(eq(cajas.id, params.cajaId))

    redirect(`/admin/empresas/${params.id}/cajas/${params.cajaId}?success=caja-actualizada`)
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Editar Caja</h1>
            <p className="text-slate-600 mt-1">{caja.nombre}</p>
            <p className="text-sm text-slate-500 mt-1">Empresa: {empresa?.nombre}</p>
          </div>
          <a
            href={`/admin/empresas/${params.id}/cajas/${params.cajaId}`}
            className="text-slate-600 hover:text-slate-900"
          >
            ← Volver
          </a>
        </div>

        <form action={actualizar} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Nombre de la Caja *
            </label>
            <input
              type="text"
              name="nombre"
              defaultValue={caja.nombre}
              required
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Código
              </label>
              <input
                type="text"
                name="codigo"
                defaultValue={caja.codigo || ''}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Sucursal *
              </label>
              <select
                name="sucursalId"
                defaultValue={caja.sucursalId}
                required
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              >
                {sucursalesEmpresa.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.nombre}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Ubicación
            </label>
            <input
              type="text"
              name="ubicacion"
              defaultValue={caja.ubicacion || ''}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Descripción
            </label>
            <textarea
              name="descripcion"
              defaultValue={caja.descripcion || ''}
              rows={3}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="activa"
                value="true"
                defaultChecked={caja.activa}
                className="w-4 h-4 text-emerald-600 rounded"
              />
              <span className="text-sm font-medium text-slate-700">
                Caja activa
              </span>
            </label>
            <p className="text-xs text-slate-500 mt-1 ml-6">
              Las cajas inactivas no pueden abrir nuevos turnos
            </p>
          </div>

          <div className="flex gap-3 pt-4 border-t border-slate-200">
            <button
              type="submit"
              className="flex-1 bg-emerald-600 text-white py-3 rounded-lg font-medium hover:bg-emerald-700 transition-colors"
            >
              Guardar Cambios
            </button>
            <a
              href={`/admin/empresas/${params.id}/cajas/${params.cajaId}`}
              className="flex-1 text-center bg-slate-200 text-slate-700 py-3 rounded-lg font-medium hover:bg-slate-300 transition-colors"
            >
              Cancelar
            </a>
          </div>
        </form>
      </div>
    </div>
  )
}
