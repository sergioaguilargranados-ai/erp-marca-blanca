import { db } from '@/lib/db'
import { empresas, planes } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export default async function EmpresasPage() {
  // Obtener todas las empresas con su plan
  const todasEmpresas = await db
    .select({
      empresa: empresas,
      plan: planes,
    })
    .from(empresas)
    .leftJoin(planes, eq(empresas.planId, planes.id))
    .orderBy(empresas.createdAt)

  const estadoColors = {
    pendiente: 'bg-orange-100 text-orange-800',
    prueba: 'bg-blue-100 text-blue-800',
    activa: 'bg-green-100 text-green-800',
    suspendida: 'bg-red-100 text-red-800',
    cancelada: 'bg-slate-100 text-slate-800',
  }

  const estadoLabels = {
    pendiente: 'Pendiente',
    prueba: 'En Prueba',
    activa: 'Activa',
    suspendida: 'Suspendida',
    cancelada: 'Cancelada',
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Empresas</h1>
          <p className="text-slate-600 mt-1">
            Gestiona todas las empresas registradas
          </p>
        </div>
        <div className="text-sm text-slate-600">
          Total: {todasEmpresas.length} empresas
        </div>
      </div>

      {/* Filtros rápidos */}
      <div className="flex gap-2 flex-wrap">
        <a href="/admin/empresas?filter=all" className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium hover:bg-slate-50">
          Todas ({todasEmpresas.length})
        </a>
        <a href="/admin/empresas?filter=pendiente" className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium hover:bg-slate-50">
          Pendientes ({todasEmpresas.filter(e => e.empresa.estado === 'pendiente').length})
        </a>
        <a href="/admin/empresas?filter=prueba" className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium hover:bg-slate-50">
          En Prueba ({todasEmpresas.filter(e => e.empresa.estado === 'prueba').length})
        </a>
        <a href="/admin/empresas?filter=activa" className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium hover:bg-slate-50">
          Activas ({todasEmpresas.filter(e => e.empresa.estado === 'activa').length})
        </a>
        <a href="/admin/empresas?filter=suspendida" className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium hover:bg-slate-50">
          Suspendidas ({todasEmpresas.filter(e => e.empresa.estado === 'suspendida').length})
        </a>
      </div>

      {/* Lista de empresas */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Empresa
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Plan
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Contacto
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Uso
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {todasEmpresas.map(({ empresa, plan }) => (
              <tr key={empresa.id} className="hover:bg-slate-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="font-medium text-slate-900">{empresa.nombre}</div>
                    <div className="text-sm text-slate-500 font-mono">{empresa.subdominio}.tudominio.com</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-slate-900">{plan?.nombre || 'Sin plan'}</div>
                  {plan && (
                    <div className="text-xs text-slate-500">
                      {plan.precioMensual ? `$${plan.precioMensual} ${plan.moneda}/mes` : 'Personalizado'}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${estadoColors[empresa.estado as keyof typeof estadoColors]}`}>
                    {estadoLabels[empresa.estado as keyof typeof estadoLabels]}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-slate-900">{empresa.nombreContacto}</div>
                  <div className="text-xs text-slate-500">{empresa.emailContacto}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                  <div>{empresa.usoUsuarios} usuarios</div>
                  <div>{empresa.usoSucursales} sucursales</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end gap-2">
                    <a href={`/admin/empresas/${empresa.id}`} className="text-blue-600 hover:text-blue-900">
                      Ver
                    </a>
                    <a href={`/admin/empresas/${empresa.id}/editar`} className="text-emerald-600 hover:text-emerald-900">
                      Editar
                    </a>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {todasEmpresas.length === 0 && (
          <div className="text-center py-12 text-slate-500">
            No hay empresas registradas
          </div>
        )}
      </div>
    </div>
  )
}
