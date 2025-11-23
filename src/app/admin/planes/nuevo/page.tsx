import { db } from '@/lib/db'
import { planes } from '@/lib/db/schema'
import { redirect } from 'next/navigation'

export default function NuevoPlanPage() {
  const crear = async (formData: FormData) => {
    'use server'

    const nombre = formData.get('nombre') as string
    const descripcion = formData.get('descripcion') as string
    const precioMensual = formData.get('precioMensual') as string
    const precioAnual = formData.get('precioAnual') as string
    const moneda = formData.get('moneda') as string
    const maxSucursales = formData.get('maxSucursales') as string
    const maxUsuarios = formData.get('maxUsuarios') as string
    const maxProductos = formData.get('maxProductos') as string
    const maxTransaccionesMes = formData.get('maxTransaccionesMes') as string
    const maxAlmacenamientoGb = formData.get('maxAlmacenamientoGb') as string

    await db.insert(planes).values({
      nombre,
      descripcion: descripcion || null,
      precioMensual: precioMensual || null,
      precioAnual: precioAnual || null,
      moneda,
      maxSucursales: parseInt(maxSucursales),
      maxUsuarios: maxUsuarios ? parseInt(maxUsuarios) : null,
      maxProductos: maxProductos ? parseInt(maxProductos) : null,
      maxTransaccionesMes: maxTransaccionesMes ? parseInt(maxTransaccionesMes) : null,
      maxAlmacenamientoGb: maxAlmacenamientoGb ? parseInt(maxAlmacenamientoGb) : null,
      activo: true,
    })

    redirect('/admin/planes?success=plan-creado')
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-slate-900">
            Crear Nuevo Plan
          </h1>
          <a href="/admin/planes" className="text-slate-600 hover:text-slate-900">
            ← Volver
          </a>
        </div>

        <form action={crear} className="space-y-8">
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
                    required
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ej: Pro Plus"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Moneda *
                  </label>
                  <select
                    name="moneda"
                    required
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="MXN">MXN - Pesos Mexicanos</option>
                    <option value="USD">USD - Dólares</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Descripción
                </label>
                <textarea
                  name="descripcion"
                  rows={3}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Descripción breve del plan..."
                />
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
                    step="0.01"
                    min="0"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="999.00"
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
                    step="0.01"
                    min="0"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="10189.00"
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    Recomendado: 15% descuento sobre mensual
                  </p>
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
                    required
                    min="1"
                    max="99"
                    defaultValue="99"
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
                    min="1"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ilimitado"
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    Dejar vacío para ilimitados
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Máximo de Productos
                  </label>
                  <input
                    type="number"
                    name="maxProductos"
                    min="1"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ilimitado"
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    Dejar vacío para ilimitados
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Transacciones por Mes
                  </label>
                  <input
                    type="number"
                    name="maxTransaccionesMes"
                    min="1"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ilimitado"
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    Dejar vacío para ilimitadas
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Almacenamiento (GB)
                  </label>
                  <input
                    type="number"
                    name="maxAlmacenamientoGb"
                    min="1"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ilimitado"
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    Dejar vacío para ilimitado
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Nota */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>Nota:</strong> El plan se creará activo por defecto. Puedes desactivarlo más tarde si es necesario.
            </p>
          </div>

          {/* Botones */}
          <div className="flex gap-3 pt-4 border-t border-slate-200">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Crear Plan
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
