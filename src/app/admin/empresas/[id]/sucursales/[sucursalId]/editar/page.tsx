import { db } from '@/lib/db'
import { empresas, sucursales } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'
import { redirect } from 'next/navigation'

export default async function EditarSucursalPage({
  params
}: {
  params: { id: string; sucursalId: string }
}) {
  const [empresaData] = await db
    .select({
      empresa: empresas,
      sucursal: sucursales,
    })
    .from(sucursales)
    .leftJoin(empresas, eq(sucursales.empresaId, empresas.id))
    .where(and(
      eq(sucursales.id, params.sucursalId),
      eq(sucursales.empresaId, params.id)
    ))
    .limit(1)

  if (!empresaData || !empresaData.sucursal) {
    redirect(`/admin/empresas/${params.id}/sucursales`)
  }

  const { empresa, sucursal } = empresaData

  const actualizar = async (formData: FormData) => {
    'use server'

    const nombre = formData.get('nombre') as string
    const codigo = formData.get('codigo') as string
    const direccion = formData.get('direccion') as string
    const ciudad = formData.get('ciudad') as string
    const estado = formData.get('estado') as string
    const codigoPostal = formData.get('codigoPostal') as string
    const pais = formData.get('pais') as string
    const telefono = formData.get('telefono') as string
    const email = formData.get('email') as string
    const moneda = formData.get('moneda') as string
    const tasaIva = formData.get('tasaIva') as string
    const rfc = formData.get('rfc') as string
    const razonSocial = formData.get('razonSocial') as string
    const regimenFiscal = formData.get('regimenFiscal') as string
    const activa = formData.get('activa') === 'true'

    await db
      .update(sucursales)
      .set({
        nombre,
        codigo: codigo || null,
        direccion: direccion || null,
        ciudad: ciudad || null,
        estado: estado || null,
        codigoPostal: codigoPostal || null,
        pais: pais || 'MEX',
        telefono: telefono || null,
        email: email || null,
        moneda: moneda || 'MXN',
        tasaIva: tasaIva || '16.00',
        rfc: rfc || null,
        razonSocial: razonSocial || null,
        regimenFiscal: regimenFiscal || null,
        activa,
        updatedAt: new Date(),
      })
      .where(eq(sucursales.id, params.sucursalId))

    redirect(`/admin/empresas/${params.id}/sucursales/${params.sucursalId}?success=sucursal-actualizada`)
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Editar Sucursal</h1>
            <p className="text-slate-600 mt-1">{sucursal.nombre}</p>
            <p className="text-sm text-slate-500 mt-1">Empresa: {empresa?.nombre}</p>
          </div>
          <a
            href={`/admin/empresas/${params.id}/sucursales/${params.sucursalId}`}
            className="text-slate-600 hover:text-slate-900"
          >
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
                    Nombre de la Sucursal *
                  </label>
                  <input
                    type="text"
                    name="nombre"
                    defaultValue={sucursal.nombre}
                    required
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Código (opcional)
                  </label>
                  <input
                    type="text"
                    name="codigo"
                    defaultValue={sucursal.codigo || ''}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="activa"
                    value="true"
                    defaultChecked={sucursal.activa}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <span className="text-sm font-medium text-slate-700">
                    Sucursal activa
                  </span>
                </label>
                <p className="text-xs text-slate-500 mt-1 ml-6">
                  Las sucursales inactivas no pueden realizar operaciones
                </p>
              </div>
            </div>
          </div>

          {/* Ubicación */}
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-4">
              Ubicación
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Dirección
                </label>
                <textarea
                  name="direccion"
                  defaultValue={sucursal.direccion || ''}
                  rows={2}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Ciudad
                  </label>
                  <input
                    type="text"
                    name="ciudad"
                    defaultValue={sucursal.ciudad || ''}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Estado
                  </label>
                  <input
                    type="text"
                    name="estado"
                    defaultValue={sucursal.estado || ''}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Código Postal
                  </label>
                  <input
                    type="text"
                    name="codigoPostal"
                    defaultValue={sucursal.codigoPostal || ''}
                    maxLength={10}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    País
                  </label>
                  <select
                    name="pais"
                    defaultValue={sucursal.pais}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="MEX">México</option>
                    <option value="USA">Estados Unidos</option>
                    <option value="CAN">Canadá</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    name="telefono"
                    defaultValue={sucursal.telefono || ''}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    defaultValue={sucursal.email || ''}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Configuración Fiscal */}
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-4">
              Configuración Fiscal y Financiera
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Moneda
                  </label>
                  <select
                    name="moneda"
                    defaultValue={sucursal.moneda}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="MXN">MXN - Pesos Mexicanos</option>
                    <option value="USD">USD - Dólares</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Tasa de IVA (%)
                  </label>
                  <input
                    type="number"
                    name="tasaIva"
                    defaultValue={sucursal.tasaIva}
                    step="0.01"
                    min="0"
                    max="100"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    RFC
                  </label>
                  <input
                    type="text"
                    name="rfc"
                    defaultValue={sucursal.rfc || ''}
                    maxLength={13}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Régimen Fiscal (Clave SAT)
                  </label>
                  <input
                    type="text"
                    name="regimenFiscal"
                    defaultValue={sucursal.regimenFiscal || ''}
                    maxLength={3}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Razón Social
                </label>
                <input
                  type="text"
                  name="razonSocial"
                  defaultValue={sucursal.razonSocial || ''}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
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
              href={`/admin/empresas/${params.id}/sucursales/${params.sucursalId}`}
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
