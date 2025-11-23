import { db } from '@/lib/db'
import { planes, empresas } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export default async function PlanesPage() {
  // Obtener todos los planes
  const todosPlanes = await db.select().from(planes).orderBy(planes.moneda, planes.nombre)

  // Contar empresas por plan
  const todasEmpresas = await db.select().from(empresas)

  const planesConConteo = await Promise.all(
    todosPlanes.map(async (plan) => {
      const empresasConPlan = todasEmpresas.filter(e => e.planId === plan.id)
      return {
        ...plan,
        empresasCount: empresasConPlan.length
      }
    })
  )

  // Agrupar por moneda
  const planesMXN = planesConConteo.filter(p => p.moneda === 'MXN')
  const planesUSD = planesConConteo.filter(p => p.moneda === 'USD')

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Planes de Suscripción</h1>
          <p className="text-slate-600 mt-1">
            Gestiona los planes disponibles para las empresas
          </p>
        </div>
        <a href="/admin/planes/nuevo" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          Nuevo Plan
        </a>
      </div>

      {/* Planes MXN */}
      <div>
        <h2 className="text-xl font-semibold text-slate-900 mb-4">Planes en MXN</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {planesMXN.map((plan) => (
            <div key={plan.id} className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
              {/* Header del plan */}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">{plan.nombre}</h3>
                  <p className="text-sm text-slate-600">{plan.descripcion}</p>
                </div>
                <span className={`px-2 py-1 text-xs font-semibold rounded ${plan.activo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {plan.activo ? 'Activo' : 'Inactivo'}
                </span>
              </div>

              {/* Precio */}
              <div className="mb-4">
                {plan.precioMensual ? (
                  <>
                    <div className="text-3xl font-bold text-slate-900">
                      ${plan.precioMensual} <span className="text-lg text-slate-600">MXN</span>
                    </div>
                    <div className="text-sm text-slate-600">por mes</div>
                    {plan.precioAnual && (
                      <div className="text-sm text-emerald-600 mt-1">
                        ${plan.precioAnual} MXN/año (15% desc.)
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-2xl font-bold text-slate-900">Personalizado</div>
                )}
              </div>

              {/* Límites */}
              <div className="space-y-2 mb-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600">Sucursales:</span>
                  <span className="font-medium text-slate-900">{plan.maxSucursales}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Usuarios:</span>
                  <span className="font-medium text-slate-900">
                    {plan.maxUsuarios ? plan.maxUsuarios : 'Ilimitados'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Productos:</span>
                  <span className="font-medium text-slate-900">
                    {plan.maxProductos ? plan.maxProductos : 'Ilimitados'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Transacciones/mes:</span>
                  <span className="font-medium text-slate-900">
                    {plan.maxTransaccionesMes ? plan.maxTransaccionesMes : 'Ilimitadas'}
                  </span>
                </div>
              </div>

              {/* Empresas usando este plan */}
              <div className="pt-4 border-t border-slate-200 mb-4">
                <div className="text-sm text-slate-600">
                  <span className="font-semibold text-slate-900">{plan.empresasCount}</span> empresa{plan.empresasCount !== 1 ? 's' : ''} usando este plan
                </div>
              </div>

              {/* Acciones */}
              <div className="flex gap-2">
                <a href={`/admin/planes/${plan.id}/editar`} className="flex-1 text-center px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700">
                  Editar
                </a>
                <a href={`/admin/planes/${plan.id}`} className="flex-1 text-center px-3 py-2 bg-slate-200 text-slate-700 text-sm rounded-lg hover:bg-slate-300">
                  Ver
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Planes USD */}
      <div>
        <h2 className="text-xl font-semibold text-slate-900 mb-4">Planes en USD</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {planesUSD.map((plan) => (
            <div key={plan.id} className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
              {/* Header del plan */}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">{plan.nombre}</h3>
                  <p className="text-sm text-slate-600">{plan.descripcion}</p>
                </div>
                <span className={`px-2 py-1 text-xs font-semibold rounded ${plan.activo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {plan.activo ? 'Activo' : 'Inactivo'}
                </span>
              </div>

              {/* Precio */}
              <div className="mb-4">
                {plan.precioMensual ? (
                  <>
                    <div className="text-3xl font-bold text-slate-900">
                      ${plan.precioMensual} <span className="text-lg text-slate-600">USD</span>
                    </div>
                    <div className="text-sm text-slate-600">por mes</div>
                    {plan.precioAnual && (
                      <div className="text-sm text-emerald-600 mt-1">
                        ${plan.precioAnual} USD/año (15% desc.)
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-2xl font-bold text-slate-900">Personalizado</div>
                )}
              </div>

              {/* Límites */}
              <div className="space-y-2 mb-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600">Sucursales:</span>
                  <span className="font-medium text-slate-900">{plan.maxSucursales}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Usuarios:</span>
                  <span className="font-medium text-slate-900">
                    {plan.maxUsuarios ? plan.maxUsuarios : 'Ilimitados'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Productos:</span>
                  <span className="font-medium text-slate-900">
                    {plan.maxProductos ? plan.maxProductos : 'Ilimitados'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Transacciones/mes:</span>
                  <span className="font-medium text-slate-900">
                    {plan.maxTransaccionesMes ? plan.maxTransaccionesMes : 'Ilimitadas'}
                  </span>
                </div>
              </div>

              {/* Empresas usando este plan */}
              <div className="pt-4 border-t border-slate-200 mb-4">
                <div className="text-sm text-slate-600">
                  <span className="font-semibold text-slate-900">{plan.empresasCount}</span> empresa{plan.empresasCount !== 1 ? 's' : ''} usando este plan
                </div>
              </div>

              {/* Acciones */}
              <div className="flex gap-2">
                <a href={`/admin/planes/${plan.id}/editar`} className="flex-1 text-center px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700">
                  Editar
                </a>
                <a href={`/admin/planes/${plan.id}`} className="flex-1 text-center px-3 py-2 bg-slate-200 text-slate-700 text-sm rounded-lg hover:bg-slate-300">
                  Ver
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
