import { db } from '@/lib/db'
import { empresas, empleados, sucursales } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'
import { redirect } from 'next/navigation'

export default async function EmpleadoDetallesPage({
  params
}: {
  params: { id: string; empleadoId: string }
}) {
  const [empleadoData] = await db
    .select({
      empleado: empleados,
      empresa: empresas,
      sucursal: sucursales,
    })
    .from(empleados)
    .leftJoin(empresas, eq(empleados.empresaId, empresas.id))
    .leftJoin(sucursales, eq(empleados.sucursalId, sucursales.id))
    .where(and(
      eq(empleados.id, params.empleadoId),
      eq(empleados.empresaId, params.id)
    ))
    .limit(1)

  if (!empleadoData || !empleadoData.empleado) {
    redirect(`/admin/empresas/${params.id}/empleados`)
  }

  const { empleado, empresa, sucursal } = empleadoData

  const nombreCompleto = [
    empleado.nombre,
    empleado.apellidoPaterno,
    empleado.apellidoMaterno
  ].filter(Boolean).join(' ')

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-slate-900">{nombreCompleto}</h1>
            <span className={`px-3 py-1 text-sm font-semibold rounded-full border ${
              empleado.activo
                ? 'bg-green-100 text-green-800 border-green-200'
                : 'bg-red-100 text-red-800 border-red-200'
            }`}>
              {empleado.activo ? 'Activo' : 'Inactivo'}
            </span>
          </div>
          <p className="text-slate-600">{empresa?.nombre}</p>
          {empleado.numeroEmpleado && (
            <p className="text-sm text-slate-500 mt-1 font-mono">
              #{empleado.numeroEmpleado}
            </p>
          )}
        </div>
        <div className="flex gap-2">
          <a
            href={`/admin/empresas/${params.id}/empleados/${params.empleadoId}/editar`}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Editar
          </a>
          <a
            href={`/admin/empresas/${params.id}/empleados`}
            className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300"
          >
            ← Volver
          </a>
        </div>
      </div>

      {/* Información del Empleado */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Información Personal */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <h3 className="font-semibold text-slate-900 mb-4">Información Personal</h3>
          <dl className="space-y-3">
            <div>
              <dt className="text-xs text-slate-500 uppercase mb-1">Nombre Completo</dt>
              <dd className="text-sm font-medium text-slate-900">{nombreCompleto}</dd>
            </div>
            {empleado.email && (
              <div>
                <dt className="text-xs text-slate-500 uppercase mb-1">Email</dt>
                <dd className="text-sm font-medium text-slate-900">{empleado.email}</dd>
              </div>
            )}
            {empleado.telefono && (
              <div>
                <dt className="text-xs text-slate-500 uppercase mb-1">Teléfono</dt>
                <dd className="text-sm font-medium text-slate-900">{empleado.telefono}</dd>
              </div>
            )}
          </dl>
        </div>

        {/* Información Laboral */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <h3 className="font-semibold text-slate-900 mb-4">Información Laboral</h3>
          <dl className="space-y-3">
            {empleado.puesto && (
              <div>
                <dt className="text-xs text-slate-500 uppercase mb-1">Puesto</dt>
                <dd className="text-sm font-medium text-slate-900">{empleado.puesto}</dd>
              </div>
            )}
            {empleado.departamento && (
              <div>
                <dt className="text-xs text-slate-500 uppercase mb-1">Departamento</dt>
                <dd className="text-sm font-medium text-slate-900">{empleado.departamento}</dd>
              </div>
            )}
            {sucursal && (
              <div>
                <dt className="text-xs text-slate-500 uppercase mb-1">Sucursal</dt>
                <dd className="text-sm font-medium text-slate-900">{sucursal.nombre}</dd>
              </div>
            )}
            {empleado.fechaIngreso && (
              <div>
                <dt className="text-xs text-slate-500 uppercase mb-1">Fecha de Ingreso</dt>
                <dd className="text-sm font-medium text-slate-900">
                  {new Date(empleado.fechaIngreso).toLocaleDateString('es-MX')}
                </dd>
              </div>
            )}
          </dl>
        </div>

        {/* Información Salarial */}
        {empleado.salario && (
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
            <h3 className="font-semibold text-slate-900 mb-4">Información Salarial</h3>
            <dl className="space-y-3">
              <div>
                <dt className="text-xs text-slate-500 uppercase mb-1">Salario Mensual</dt>
                <dd className="text-2xl font-bold text-green-600">
                  ${Number(empleado.salario).toFixed(2)}
                </dd>
              </div>
            </dl>
          </div>
        )}

        {/* Notas */}
        {empleado.notas && (
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
            <h3 className="font-semibold text-slate-900 mb-4">Notas</h3>
            <p className="text-sm text-slate-700 whitespace-pre-wrap">{empleado.notas}</p>
          </div>
        )}
      </div>

      {/* Información del Sistema */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <h3 className="font-semibold text-slate-900 mb-4">Información del Sistema</h3>
        <dl className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
          <div>
            <dt className="text-xs text-slate-500 uppercase mb-1">Registrado</dt>
            <dd className="font-medium text-slate-900">
              {new Date(empleado.createdAt).toLocaleDateString('es-MX')}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-slate-500 uppercase mb-1">Última actualización</dt>
            <dd className="font-medium text-slate-900">
              {new Date(empleado.updatedAt).toLocaleDateString('es-MX')}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-slate-500 uppercase mb-1">ID</dt>
            <dd className="font-medium text-slate-900 font-mono text-xs">{empleado.id}</dd>
          </div>
        </dl>
      </div>

      {/* Acciones */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <h3 className="font-semibold text-slate-900 mb-4">Acciones</h3>
        <div className="flex gap-3">
          <a
            href={`/admin/empresas/${params.id}/empleados/${params.empleadoId}/editar`}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Editar Información
          </a>
          {empleado.activo ? (
            <button className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700">
              Desactivar Empleado
            </button>
          ) : (
            <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700">
              Activar Empleado
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
