import { db } from '@/lib/db'
import { empresas, sucursales, cajas } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { redirect } from 'next/navigation'

export default async function NuevaCajaPage({ params }: { params: { id: string } }) {
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

  const crear = async (formData: FormData) => {
    'use server'

    const nombre = formData.get('nombre') as string
    const codigo = formData.get('codigo') as string
    const sucursalId = formData.get('sucursalId') as string
    const ubicacion = formData.get('ubicacion') as string
    const descripcion = formData.get('descripcion') as string

    await db.insert(cajas).values({
      empresaId: params.id,
      sucursalId,
      nombre,
      codigo: codigo || null,
      ubicacion: ubicacion || null,
      descripcion: descripcion || null,
      activa: true,
    })

    redirect(`/admin/empresas/${params.id}/cajas?success=caja-creada`)
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Nueva Caja Registradora</h1>
            <p className="text-slate-600 mt-1">Para {empresa.nombre}</p>
          </div>
          <a
            href={`/admin/empresas/${params.id}/cajas`}
            className="text-slate-600 hover:text-slate-900"
          >
            ← Volver
          </a>
        </div>

        <form action={crear} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Nombre de la Caja *
            </label>
            <input
              type="text"
              name="nombre"
              required
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              placeholder="Caja 1, Caja Principal..."
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
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="CAJ-001"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Sucursal *
              </label>
              <select
                name="sucursalId"
                required
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              >
                <option value="">Seleccionar sucursal...</option>
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
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              placeholder="Planta baja, Mostrador 1..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Descripción
            </label>
            <textarea
              name="descripcion"
              rows={3}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              placeholder="Información adicional sobre esta caja..."
            />
          </div>

          <div className="flex gap-3 pt-4 border-t border-slate-200">
            <button
              type="submit"
              className="flex-1 bg-emerald-600 text-white py-3 rounded-lg font-medium hover:bg-emerald-700 transition-colors"
            >
              Crear Caja
            </button>
            <a
              href={`/admin/empresas/${params.id}/cajas`}
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
