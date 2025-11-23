import { db } from '@/lib/db'
import { empresas, empleados, sucursales } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'
import { redirect } from 'next/navigation'

export default async function EditarEmpleadoPage({
  params
}: {
  params: { id: string; empleadoId: string }
}) {
  const [empleadoData] = await db
    .select({
      empleado: empleados,
      empresa: empresas,
    })
    .from(empleados)
    .leftJoin(empresas, eq(empleados.empresaId, empresas.id))
    .where(and(
      eq(empleados.id, params.empleadoId),
      eq(empleados.empresaId, params.id)
    ))
    .limit(1)

  if (!empleadoData || !empleadoData.empleado) {
    redirect(`/admin/empresas/${params.id}/empleados`)
  }

  const { empleado, empresa } = empleadoData

  // Obtener sucursales
  const sucursalesList = await db
    .select()
    .from(sucursales)
    .where(eq(sucursales.empresaId, params.id))
    .orderBy(sucursales.nombre)

  const actualizar = async (formData: FormData) => {
    'use server'

    const datos = {
      sucursalId: (formData.get('sucursalId') as string) || undefined,
      nombre: formData.get('nombre') as string,
      apellidoPaterno: (formData.get('apellidoPaterno') as string) || undefined,
      apellidoMaterno: (formData.get('apellidoMaterno') as string) || undefined,
      email: (formData.get('email') as string) || undefined,
      telefono: (formData.get('telefono') as string) || undefined,
      numeroEmpleado: (formData.get('numeroEmpleado') as string) || undefined,
      puesto: (formData.get('puesto') as string) || undefined,
      departamento: (formData.get('departamento') as string) || undefined,
      salario: (formData.get('salario') as string) || undefined,
      fechaIngreso: formData.get('fechaIngreso')
        ? new Date(formData.get('fechaIngreso') as string)
        : undefined,
      notas: (formData.get('notas') as string) || undefined,
      activo: formData.get('activo') === 'true',
      updatedAt: new Date(),
    }

    await db
      .update(empleados)
      .set(datos)
      .where(eq(empleados.id, params.empleadoId))

    redirect(`/admin/empresas/${params.id}/empleados/${params.empleadoId}?success=empleado-actualizado`)
  }

  const nombreCompleto = [
    empleado.nombre,
    empleado.apellidoPaterno,
    empleado.apellidoMaterno
  ].filter(Boolean).join(' ')

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Editar Empleado</h1>
            <p className="text-slate-600 mt-1">{nombreCompleto}</p>
            <p className="text-sm text-slate-500 mt-1">Empresa: {empresa?.nombre}</p>
          </div>
          <a
            href={`/admin/empresas/${params.id}/empleados/${params.empleadoId}`}
            className="text-slate-600 hover:text-slate-900"
          >
            ← Volver
          </a>
        </div>

        <form action={actualizar} className="space-y-8">
          {/* Información Personal */}
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Información Personal</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Nombre *
                </label>
                <input
                  type="text"
                  name="nombre"
                  defaultValue={empleado.nombre}
                  required
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Apellido Paterno
                </label>
                <input
                  type="text"
                  name="apellidoPaterno"
                  defaultValue={empleado.apellidoPaterno || ''}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Apellido Materno
                </label>
                <input
                  type="text"
                  name="apellidoMaterno"
                  defaultValue={empleado.apellidoMaterno || ''}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  defaultValue={empleado.email || ''}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Teléfono
                </label>
                <input
                  type="tel"
                  name="telefono"
                  defaultValue={empleado.telefono || ''}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg"
                />
              </div>
            </div>
          </div>

          {/* Información Laboral */}
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Información Laboral</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Número de Empleado
                </label>
                <input
                  type="text"
                  name="numeroEmpleado"
                  defaultValue={empleado.numeroEmpleado || ''}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Sucursal
                </label>
                <select
                  name="sucursalId"
                  defaultValue={empleado.sucursalId || ''}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg"
                >
                  <option value="">Sin asignar</option>
                  {sucursalesList.map(s => (
                    <option key={s.id} value={s.id}>{s.nombre}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Puesto
                </label>
                <input
                  type="text"
                  name="puesto"
                  defaultValue={empleado.puesto || ''}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Departamento
                </label>
                <input
                  type="text"
                  name="departamento"
                  defaultValue={empleado.departamento || ''}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Salario Mensual
                </label>
                <input
                  type="number"
                  name="salario"
                  defaultValue={empleado.salario || ''}
                  step="0.01"
                  min="0"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Fecha de Ingreso
                </label>
                <input
                  type="date"
                  name="fechaIngreso"
                  defaultValue={empleado.fechaIngreso ? new Date(empleado.fechaIngreso).toISOString().split('T')[0] : ''}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg"
                />
              </div>
            </div>
          </div>

          {/* Notas */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Notas / Observaciones
            </label>
            <textarea
              name="notas"
              defaultValue={empleado.notas || ''}
              rows={4}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg"
            />
          </div>

          {/* Estado */}
          <div>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="activo"
                value="true"
                defaultChecked={empleado.activo}
                className="w-4 h-4 text-blue-600 rounded"
              />
              <span className="text-sm font-medium text-slate-700">
                Empleado activo
              </span>
            </label>
          </div>

          {/* Botones */}
          <div className="flex gap-3 pt-4 border-t border-slate-200">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700"
            >
              Guardar Cambios
            </button>
            <a
              href={`/admin/empresas/${params.id}/empleados/${params.empleadoId}`}
              className="flex-1 text-center bg-slate-200 text-slate-700 py-3 rounded-lg font-medium hover:bg-slate-300"
            >
              Cancelar
            </a>
          </div>
        </form>
      </div>
    </div>
  )
}
