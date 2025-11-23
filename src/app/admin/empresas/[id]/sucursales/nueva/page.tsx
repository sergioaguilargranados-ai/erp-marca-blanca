import { db } from '@/lib/db'
import { empresas, sucursales, planes } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { redirect } from 'next/navigation'

export default async function NuevaSucursalPage({ params }: { params: { id: string } }) {
  const [empresaData] = await db
    .select({
      empresa: empresas,
      plan: planes,
    })
    .from(empresas)
    .leftJoin(planes, eq(empresas.planId, planes.id))
    .where(eq(empresas.id, params.id))
    .limit(1)

  if (!empresaData) {
    redirect('/admin/empresas')
  }

  const { empresa, plan } = empresaData

  // Verificar límite de sucursales
  const totalSucursales = await db
    .select()
    .from(sucursales)
    .where(eq(sucursales.empresaId, params.id))

  const maxSucursales = plan?.maxSucursales || 99

  const crear = async (formData: FormData) => {
    'use server'

    // Verificar límite
    if (totalSucursales.length >= maxSucursales) {
      redirect(`/admin/empresas/${params.id}/sucursales?error=limite-alcanzado`)
    }

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

    await db.insert(sucursales).values({
      empresaId: params.id,
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
      activa: true,
    })

    // Actualizar contador de uso
    await db
      .update(empresas)
      .set({
        usoSucursales: totalSucursales.length + 1,
        updatedAt: new Date(),
      })
      .where(eq(empresas.id, params.id))

    redirect(`/admin/empresas/${params.id}/sucursales?success=sucursal-creada`)
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Nueva Sucursal</h1>
            <p className="text-slate-600 mt-1">Para {empresa.nombre}</p>
          </div>
          <a
            href={`/admin/empresas/${params.id}/sucursales`}
            className="text-slate-600 hover:text-slate-900"
          >
            ← Volver
          </a>
        </div>

        {totalSucursales.length >= maxSucursales && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800 font-semibold">
              ⚠️ Límite de sucursales alcanzado
            </p>
            <p className="text-red-700 text-sm mt-1">
              Esta empresa ya tiene {totalSucursales.length} sucursales (máximo: {maxSucursales}).
              Actualiza el plan para agregar más sucursales.
            </p>
          </div>
        )}

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
                    Nombre de la Sucursal *
                  </label>
                  <input
                    type="text"
                    name="nombre"
                    required
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="Sucursal Centro"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Código (opcional)
                  </label>
                  <input
                    type="text"
                    name="codigo"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="SUC-001"
                  />
                </div>
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
                  rows={2}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="Calle Principal #123, Colonia Centro"
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
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="Ciudad de México"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Estado
                  </label>
                  <input
                    type="text"
                    name="estado"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="CDMX"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Código Postal
                  </label>
                  <input
                    type="text"
                    name="codigoPostal"
                    maxLength={10}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="01000"
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
                    defaultValue="MEX"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
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
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="+52 55 1234 5678"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="sucursal@empresa.com"
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
                    defaultValue="MXN"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
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
                    defaultValue="16.00"
                    step="0.01"
                    min="0"
                    max="100"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
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
                    maxLength={13}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="XAXX010101000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Régimen Fiscal (Clave SAT)
                  </label>
                  <input
                    type="text"
                    name="regimenFiscal"
                    maxLength={3}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="601"
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
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="Mi Empresa S.A. de C.V."
                />
              </div>
            </div>
          </div>

          {/* Botones */}
          <div className="flex gap-3 pt-4 border-t border-slate-200">
            <button
              type="submit"
              disabled={totalSucursales.length >= maxSucursales}
              className="flex-1 bg-emerald-600 text-white py-3 rounded-lg font-medium hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Crear Sucursal
            </button>
            <a
              href={`/admin/empresas/${params.id}/sucursales`}
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
