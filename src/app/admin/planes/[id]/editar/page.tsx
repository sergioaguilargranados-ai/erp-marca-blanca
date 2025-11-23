import { db } from '@/lib/db'
import { planes } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { redirect } from 'next/navigation'

export default async function EditarPlanPage({ params }: { params: { id: string } }) {
  const [plan] = await db
    .select()
    .from(planes)
    .where(eq(planes.id, params.id))
    .limit(1)

  if (!plan) {
    redirect('/admin/planes')
  }

  const actualizar = async (formData: FormData) => {
    'use server'

    const nombre = formData.get('nombre') as string
    const descripcion = formData.get('descripcion') as string
    const precioMensual = formData.get('precioMensual') as string
    const precioAnual = formData.get('precioAnual') as string
    const maxSucursales = formData.get('maxSucursales') as string
    const maxUsuarios = formData.get('maxUsuarios') as string
    const maxProductos = formData.get('maxProductos') as string
    const maxTransaccionesMes = formData.get('maxTransaccionesMes') as string
    const maxAlmacenamientoGb = formData.get('maxAlmacenamientoGb') as string
    const activo = formData.get('activo') === 'true'

    await db
      .update(planes)
      .set({
        nombre,
        descripcion: descripcion || null,
        precioMensual: precioMensual || null,
        precioAnual: precioAnual || null,
        maxSucursales: parseInt(maxSucursales),
        maxUsuarios: maxUsuarios ? parseInt(maxUsuarios) : null,
        maxProductos: maxProductos ? parseInt(maxProductos) : null,
        maxTransaccionesMes: maxTransaccionesMes ? parseInt(maxTransaccionesMes) : null,
        maxAlmacenamientoGb: maxAlmacenamientoGb ? parseInt(maxAlmacenamientoGb) : null,
        activo,
        updatedAt: new Date(),
      })
      .where(eq(planes.id, params.id))

    redirect('/admin/planes?success=plan-actualizado')
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-slate-900">
            Editar Plan
          </h1>
          <a href="/admin/planes" className="text-slate-600 hover:text-slate-900">
            ← Volver
          </a>
        </div>

        <form action={actualizar} className="space-y-8">
          {/* Información Básica */}
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-4">
              Información Básica
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Nombre del Plan *
                  </label>
                  <input
                    type="text"
                    name="nombre"
                    defaultValue={plan.nombre}
                    required
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Moneda
                  </label>
                  <input
                    type="text"
                    value={plan.moneda}
                    disabled
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg bg-slate-50 text-slate-500"
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    La moneda no se puede cambiar
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Descripción
                </label>
                <textarea
                  name="descripcion"
                  defaultValue={plan.descripcion || ''}
                  rows={3}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="activo"
                    value="true"
                    defaultChecked={plan.activo}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <span className="text-sm font-medium text-slate-700">
                    Plan activo (disponible para nuevas empresas)
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Precios */}
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-4">
              Precios
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Precio Mensual
                  </label>
                  <input
                    type="number"
                    name="precioMensual"
                    defaultValue={plan.precioMensual || ''}
                    step="0.01"
                    min="0"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    Dejar vacío para planes personalizados
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Precio Anual
                  </label>
                  <input
                    type="number"
                    name="precioAnual"
                    defaultValue={plan.precioAnual || ''}
                    step="0.01"
                    min="0"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Límites */}
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-4">
              Límites del Plan
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Máximo de Sucursales *
                  </label>
                  <input
                    type="number"
                    name="maxSucursales"
                    defaultValue={plan.maxSucursales}
                    required
                    min="1"
                    max="99"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Máximo de Usuarios
                  </label>
                  <input
                    type="number"
                    name="maxUsuarios"
                    defaultValue={plan.maxUsuarios || ''}
                    min="1"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ilimitado"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Máximo de Productos
                  </label>
                  <input
                    type="number"
                    name="maxProductos"
                    defaultValue={plan.maxProductos || ''}
                    min="1"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ilimitado"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Transacciones por Mes
                  </label>
                  <input
                    type="number"
                    name="maxTransaccionesMes"
                    defaultValue={plan.maxTransaccionesMes || ''}
                    min="1"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ilimitado"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Almacenamiento (GB)
                  </label>
                  <input
                    type="number"
                    name="maxAlmacenamientoGb"
                    defaultValue={plan.maxAlmacenamientoGb || ''}
                    min="1"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ilimitado"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Advertencia */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-800">
              <strong>Nota:</strong> Los cambios afectarán a todas las empresas con este plan.
              Si reduces límites, asegúrate de que ninguna empresa exceda los nuevos límites.
            </p>
          </div>

          {/* Botones */}
          <div className="flex gap-3 pt-4 border-t border-slate-200">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Guardar Cambios
            </button>
            <a
              href="/admin/planes"
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
