import { db } from '@/lib/db'
import { empresas, proveedores, productos, sucursales } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { redirect } from 'next/navigation'

export default async function NuevaOrdenCompraPage({ params }: { params: { id: string } }) {
  const [empresa] = await db
    .select()
    .from(empresas)
    .where(eq(empresas.id, params.id))
    .limit(1)

  if (!empresa) {
    redirect('/admin/empresas')
  }

  // Obtener proveedores activos
  const proveedoresList = await db
    .select()
    .from(proveedores)
    .where(eq(proveedores.empresaId, params.id))
    .orderBy(proveedores.nombre)

  // Obtener sucursales
  const sucursalesList = await db
    .select()
    .from(sucursales)
    .where(eq(sucursales.empresaId, params.id))
    .orderBy(sucursales.nombre)

  // Obtener productos
  const productosList = await db
    .select()
    .from(productos)
    .where(eq(productos.empresaId, params.id))
    .orderBy(productos.nombre)
    .limit(100)

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Nueva Orden de Compra</h1>
            <p className="text-slate-600 mt-1">Crear orden de compra para {empresa.nombre}</p>
          </div>
          <a
            href={`/admin/empresas/${params.id}/compras`}
            className="text-slate-600 hover:text-slate-900"
          >
            ← Volver
          </a>
        </div>

        <div className="space-y-6">
          {/* Información General */}
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Información General</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Proveedor *
                </label>
                <select
                  required
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg"
                >
                  <option value="">Seleccionar proveedor...</option>
                  {proveedoresList.map(p => (
                    <option key={p.id} value={p.id}>{p.nombre}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Sucursal *
                </label>
                <select
                  required
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg"
                >
                  <option value="">Seleccionar sucursal...</option>
                  {sucursalesList.map(s => (
                    <option key={s.id} value={s.id}>{s.nombre}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Fecha Esperada
                </label>
                <input
                  type="date"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Términos de Pago
                </label>
                <input
                  type="text"
                  placeholder="Ej: 30 días"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg"
                />
              </div>
            </div>
          </div>

          {/* Productos */}
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Productos</h3>
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-6">
              <p className="text-sm text-slate-600 text-center">
                Funcionalidad de agregar productos en desarrollo...
                <br />
                Por ahora, puede crear la orden desde el API.
              </p>
            </div>
          </div>

          {/* Observaciones */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Observaciones
            </label>
            <textarea
              rows={4}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg"
              placeholder="Notas adicionales sobre la orden de compra..."
            />
          </div>

          {/* Botones */}
          <div className="flex gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700"
            >
              Crear Orden de Compra
            </button>
            <a
              href={`/admin/empresas/${params.id}/compras`}
              className="flex-1 text-center bg-slate-200 text-slate-700 py-3 rounded-lg font-medium hover:bg-slate-300"
            >
              Cancelar
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
