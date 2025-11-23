import { db } from '@/lib/db'
import { empresas, clientes } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'
import { redirect } from 'next/navigation'

export default async function EditarClientePage({
  params
}: {
  params: { id: string; clienteId: string }
}) {
  const [clienteData] = await db
    .select({
      cliente: clientes,
      empresa: empresas,
    })
    .from(clientes)
    .leftJoin(empresas, eq(clientes.empresaId, empresas.id))
    .where(and(
      eq(clientes.id, params.clienteId),
      eq(clientes.empresaId, params.id)
    ))
    .limit(1)

  if (!clienteData || !clienteData.cliente) {
    redirect(`/admin/empresas/${params.id}/clientes`)
  }

  const { cliente, empresa } = clienteData

  const actualizar = async (formData: FormData) => {
    'use server'

    const nombre = formData.get('nombre') as string
    const email = formData.get('email') as string
    const telefono = formData.get('telefono') as string
    const direccion = formData.get('direccion') as string
    const rfc = formData.get('rfc') as string
    const razonSocial = formData.get('razonSocial') as string
    const regimenFiscal = formData.get('regimenFiscal') as string
    const usoCfdi = formData.get('usoCfdi') as string
    const codigoPostal = formData.get('codigoPostal') as string
    const tipo = formData.get('tipo') as string
    const notas = formData.get('notas') as string
    const activo = formData.get('activo') === 'true'

    await db
      .update(clientes)
      .set({
        nombre,
        email: email || null,
        telefono: telefono || null,
        direccion: direccion || null,
        rfc: rfc || null,
        razonSocial: razonSocial || null,
        regimenFiscal: regimenFiscal || null,
        usoCfdi: usoCfdi || null,
        codigoPostal: codigoPostal || null,
        tipo: tipo || 'minorista',
        notas: notas || null,
        activo,
        updatedAt: new Date(),
      })
      .where(eq(clientes.id, params.clienteId))

    redirect(`/admin/empresas/${params.id}/clientes/${params.clienteId}?success=cliente-actualizado`)
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Editar Cliente</h1>
            <p className="text-slate-600 mt-1">{cliente.nombre}</p>
            <p className="text-sm text-slate-500 mt-1">Empresa: {empresa?.nombre}</p>
          </div>
          <a
            href={`/admin/empresas/${params.id}/clientes/${params.clienteId}`}
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
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Nombre del Cliente *
                </label>
                <input
                  type="text"
                  name="nombre"
                  defaultValue={cliente.nombre}
                  required
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    defaultValue={cliente.email || ''}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    name="telefono"
                    defaultValue={cliente.telefono || ''}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Tipo de Cliente
                  </label>
                  <select
                    name="tipo"
                    defaultValue={cliente.tipo}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="minorista">Minorista</option>
                    <option value="mayorista">Mayorista</option>
                    <option value="especial">Especial</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Dirección
                </label>
                <textarea
                  name="direccion"
                  defaultValue={cliente.direccion || ''}
                  rows={2}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="activo"
                    value="true"
                    defaultChecked={cliente.activo}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <span className="text-sm font-medium text-slate-700">
                    Cliente activo
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Datos Fiscales */}
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-4">
              Datos Fiscales (Opcional)
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    RFC
                  </label>
                  <input
                    type="text"
                    name="rfc"
                    defaultValue={cliente.rfc || ''}
                    maxLength={13}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent uppercase"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Razón Social
                  </label>
                  <input
                    type="text"
                    name="razonSocial"
                    defaultValue={cliente.razonSocial || ''}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Régimen Fiscal
                  </label>
                  <input
                    type="text"
                    name="regimenFiscal"
                    defaultValue={cliente.regimenFiscal || ''}
                    maxLength={3}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Uso de CFDI
                  </label>
                  <select
                    name="usoCfdi"
                    defaultValue={cliente.usoCfdi || ''}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Seleccionar...</option>
                    <option value="G01">G01 - Adquisición de mercancías</option>
                    <option value="G03">G03 - Gastos en general</option>
                    <option value="D01">D01 - Honorarios médicos</option>
                    <option value="D02">D02 - Gastos médicos</option>
                    <option value="D03">D03 - Gastos funerales</option>
                    <option value="D04">D04 - Donativos</option>
                    <option value="P01">P01 - Por definir</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Código Postal
                  </label>
                  <input
                    type="text"
                    name="codigoPostal"
                    defaultValue={cliente.codigoPostal || ''}
                    maxLength={10}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Notas */}
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-4">
              Notas Adicionales
            </h3>
            <textarea
              name="notas"
              defaultValue={cliente.notas || ''}
              rows={3}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
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
              href={`/admin/empresas/${params.id}/clientes/${params.clienteId}`}
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
