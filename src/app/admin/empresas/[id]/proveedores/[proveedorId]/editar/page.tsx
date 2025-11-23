import { db } from '@/lib/db'
import { empresas, proveedores } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'
import { redirect } from 'next/navigation'

export default async function EditarProveedorPage({
  params
}: {
  params: { id: string; proveedorId: string }
}) {
  const [proveedorData] = await db
    .select({
      proveedor: proveedores,
      empresa: empresas,
    })
    .from(proveedores)
    .leftJoin(empresas, eq(proveedores.empresaId, empresas.id))
    .where(and(
      eq(proveedores.id, params.proveedorId),
      eq(proveedores.empresaId, params.id)
    ))
    .limit(1)

  if (!proveedorData || !proveedorData.proveedor) {
    redirect(`/admin/empresas/${params.id}/proveedores`)
  }

  const { proveedor, empresa } = proveedorData

  const actualizar = async (formData: FormData) => {
    'use server'

    const datos = {
      nombre: formData.get('nombre') as string,
      nombreComercial: (formData.get('nombreComercial') as string) || undefined,
      rfc: (formData.get('rfc') as string) || undefined,
      razonSocial: (formData.get('razonSocial') as string) || undefined,
      regimenFiscal: (formData.get('regimenFiscal') as string) || undefined,
      usoCfdi: (formData.get('usoCfdi') as string) || undefined,
      calle: (formData.get('calle') as string) || undefined,
      numeroExterior: (formData.get('numeroExterior') as string) || undefined,
      numeroInterior: (formData.get('numeroInterior') as string) || undefined,
      colonia: (formData.get('colonia') as string) || undefined,
      ciudad: (formData.get('ciudad') as string) || undefined,
      estado: (formData.get('estado') as string) || undefined,
      codigoPostal: (formData.get('codigoPostal') as string) || undefined,
      pais: (formData.get('pais') as string) || 'México',
      telefono: (formData.get('telefono') as string) || undefined,
      email: (formData.get('email') as string) || undefined,
      sitioWeb: (formData.get('sitioWeb') as string) || undefined,
      nombreContacto: (formData.get('nombreContacto') as string) || undefined,
      telefonoContacto: (formData.get('telefonoContacto') as string) || undefined,
      emailContacto: (formData.get('emailContacto') as string) || undefined,
      diasCredito: (formData.get('diasCredito') as string) || '0',
      limiteCredito: (formData.get('limiteCredito') as string) || '0',
      descuentoDefault: (formData.get('descuentoDefault') as string) || '0',
      notas: (formData.get('notas') as string) || undefined,
      cuentaBancaria: (formData.get('cuentaBancaria') as string) || undefined,
      banco: (formData.get('banco') as string) || undefined,
      activo: formData.get('activo') === 'true',
      updatedAt: new Date(),
    }

    await db
      .update(proveedores)
      .set(datos)
      .where(eq(proveedores.id, params.proveedorId))

    redirect(`/admin/empresas/${params.id}/proveedores/${params.proveedorId}?success=proveedor-actualizado`)
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Editar Proveedor</h1>
            <p className="text-slate-600 mt-1">{proveedor.nombre}</p>
            <p className="text-sm text-slate-500 mt-1">Empresa: {empresa?.nombre}</p>
          </div>
          <a
            href={`/admin/empresas/${params.id}/proveedores/${params.proveedorId}`}
            className="text-slate-600 hover:text-slate-900"
          >
            ← Volver
          </a>
        </div>

        <form action={actualizar} className="space-y-8">
          {/* Información Básica */}
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <span>🏢</span> Información Básica
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Nombre del Proveedor *
                  </label>
                  <input
                    type="text"
                    name="nombre"
                    defaultValue={proveedor.nombre}
                    required
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Nombre Comercial
                  </label>
                  <input
                    type="text"
                    name="nombreComercial"
                    defaultValue={proveedor.nombreComercial || ''}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Datos Fiscales */}
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <span>📄</span> Datos Fiscales
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  RFC
                </label>
                <input
                  type="text"
                  name="rfc"
                  defaultValue={proveedor.rfc || ''}
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
                  defaultValue={proveedor.razonSocial || ''}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Régimen Fiscal
                </label>
                <select
                  name="regimenFiscal"
                  defaultValue={proveedor.regimenFiscal || ''}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Seleccionar...</option>
                  <option value="601">601 - General de Ley Personas Morales</option>
                  <option value="612">612 - Personas Físicas con Actividades Empresariales</option>
                  <option value="626">626 - Régimen Simplificado de Confianza</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Uso CFDI
                </label>
                <select
                  name="usoCfdi"
                  defaultValue={proveedor.usoCfdi || ''}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Seleccionar...</option>
                  <option value="G03">G03 - Gastos en general</option>
                  <option value="G01">G01 - Adquisición de mercancías</option>
                  <option value="P01">P01 - Por definir</option>
                </select>
              </div>
            </div>
          </div>

          {/* Dirección */}
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <span>📍</span> Dirección
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Calle
                  </label>
                  <input
                    type="text"
                    name="calle"
                    defaultValue={proveedor.calle || ''}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Número Exterior
                  </label>
                  <input
                    type="text"
                    name="numeroExterior"
                    defaultValue={proveedor.numeroExterior || ''}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Número Interior
                  </label>
                  <input
                    type="text"
                    name="numeroInterior"
                    defaultValue={proveedor.numeroInterior || ''}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Colonia
                  </label>
                  <input
                    type="text"
                    name="colonia"
                    defaultValue={proveedor.colonia || ''}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Ciudad
                  </label>
                  <input
                    type="text"
                    name="ciudad"
                    defaultValue={proveedor.ciudad || ''}
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
                    defaultValue={proveedor.codigoPostal || ''}
                    maxLength={5}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Estado
                  </label>
                  <input
                    type="text"
                    name="estado"
                    defaultValue={proveedor.estado || ''}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    País
                  </label>
                  <input
                    type="text"
                    name="pais"
                    defaultValue={proveedor.pais || 'México'}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Contacto */}
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <span>📞</span> Información de Contacto
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Teléfono
                </label>
                <input
                  type="tel"
                  name="telefono"
                  defaultValue={proveedor.telefono || ''}
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
                  defaultValue={proveedor.email || ''}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Sitio Web
                </label>
                <input
                  type="url"
                  name="sitioWeb"
                  defaultValue={proveedor.sitioWeb || ''}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Nombre de Contacto
                </label>
                <input
                  type="text"
                  name="nombreContacto"
                  defaultValue={proveedor.nombreContacto || ''}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Teléfono de Contacto
                </label>
                <input
                  type="tel"
                  name="telefonoContacto"
                  defaultValue={proveedor.telefonoContacto || ''}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Email de Contacto
                </label>
                <input
                  type="email"
                  name="emailContacto"
                  defaultValue={proveedor.emailContacto || ''}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Datos Comerciales */}
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <span>💼</span> Datos Comerciales
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Días de Crédito
                </label>
                <input
                  type="number"
                  name="diasCredito"
                  defaultValue={proveedor.diasCredito || '0'}
                  min="0"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Límite de Crédito
                </label>
                <input
                  type="number"
                  name="limiteCredito"
                  defaultValue={proveedor.limiteCredito || '0'}
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Descuento Default (%)
                </label>
                <input
                  type="number"
                  name="descuentoDefault"
                  defaultValue={proveedor.descuentoDefault || '0'}
                  min="0"
                  max="100"
                  step="0.01"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Información Bancaria */}
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <span>🏦</span> Información Bancaria
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Banco
                </label>
                <input
                  type="text"
                  name="banco"
                  defaultValue={proveedor.banco || ''}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Cuenta Bancaria / CLABE
                </label>
                <input
                  type="text"
                  name="cuentaBancaria"
                  defaultValue={proveedor.cuentaBancaria || ''}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
              defaultValue={proveedor.notas || ''}
              rows={4}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Estado */}
          <div>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="activo"
                value="true"
                defaultChecked={proveedor.activo}
                className="w-4 h-4 text-blue-600 rounded"
              />
              <span className="text-sm font-medium text-slate-700">
                Proveedor activo
              </span>
            </label>
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
              href={`/admin/empresas/${params.id}/proveedores/${params.proveedorId}`}
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
