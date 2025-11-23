import { db } from '@/lib/db'
import { empresas, configuracionFacturacion } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { redirect } from 'next/navigation'

export default async function ConfigurarFacturacionPage({ params }: { params: { id: string } }) {
  const [empresa] = await db
    .select()
    .from(empresas)
    .where(eq(empresas.id, params.id))
    .limit(1)

  if (!empresa) {
    redirect('/admin/empresas')
  }

  // Obtener configuración existente
  const [config] = await db
    .select()
    .from(configuracionFacturacion)
    .where(eq(configuracionFacturacion.empresaId, params.id))
    .limit(1)

  const guardar = async (formData: FormData) => {
    'use server'

    const datos = {
      rfc: (formData.get('rfc') as string).toUpperCase(),
      razonSocial: formData.get('razonSocial') as string,
      regimenFiscal: formData.get('regimenFiscal') as string,
      codigoPostal: formData.get('codigoPostal') as string,
      serieDefault: formData.get('serieDefault') as string,
      folioInicial: formData.get('folioInicial') as string,
      pacProveedor: formData.get('pacProveedor') as string,
      pacUsuario: formData.get('pacUsuario') as string,
      pacPassword: formData.get('pacPassword') as string,
      pacApiKey: formData.get('pacApiKey') as string,
      pacModoSandbox: formData.get('pacModoSandbox') === 'true',
      emailEnvioAutomatico: formData.get('emailEnvioAutomatico') === 'true',
      emailAsunto: formData.get('emailAsunto') as string,
      emailMensaje: formData.get('emailMensaje') as string,
    }

    if (config) {
      // Actualizar
      await db
        .update(configuracionFacturacion)
        .set({
          ...datos,
          folioActual: datos.folioInicial, // Reset folio si se cambia el inicial
          updatedAt: new Date(),
        })
        .where(eq(configuracionFacturacion.id, config.id))
    } else {
      // Crear
      await db.insert(configuracionFacturacion).values({
        empresaId: params.id,
        ...datos,
        folioActual: datos.folioInicial,
      })
    }

    redirect(`/admin/empresas/${params.id}/facturacion?success=configuracion-guardada`)
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Configuración de Facturación</h1>
            <p className="text-slate-600 mt-1">CFDI 4.0 para {empresa.nombre}</p>
          </div>
          <a
            href={`/admin/empresas/${params.id}/facturacion`}
            className="text-slate-600 hover:text-slate-900"
          >
            ← Volver
          </a>
        </div>

        <form action={guardar} className="space-y-8">
          {/* Datos Fiscales del Emisor */}
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <span>🏢</span> Datos Fiscales del Emisor
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    RFC *
                  </label>
                  <input
                    type="text"
                    name="rfc"
                    defaultValue={config?.rfc || ''}
                    required
                    maxLength={13}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent uppercase"
                    placeholder="ABC123456XYZ"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Código Postal *
                  </label>
                  <input
                    type="text"
                    name="codigoPostal"
                    defaultValue={config?.codigoPostal || ''}
                    required
                    maxLength={5}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="01000"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Razón Social *
                </label>
                <input
                  type="text"
                  name="razonSocial"
                  defaultValue={config?.razonSocial || ''}
                  required
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="MI EMPRESA S.A. DE C.V."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Régimen Fiscal *
                </label>
                <select
                  name="regimenFiscal"
                  defaultValue={config?.regimenFiscal || ''}
                  required
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Seleccionar régimen...</option>
                  <option value="601">601 - General de Ley Personas Morales</option>
                  <option value="603">603 - Personas Morales con Fines no Lucrativos</option>
                  <option value="605">605 - Sueldos y Salarios e Ingresos Asimilados</option>
                  <option value="606">606 - Arrendamiento</option>
                  <option value="608">608 - Demás ingresos</option>
                  <option value="610">610 - Residentes en el Extranjero sin Establecimiento Permanente en México</option>
                  <option value="611">611 - Ingresos por Dividendos (socios y accionistas)</option>
                  <option value="612">612 - Personas Físicas con Actividades Empresariales y Profesionales</option>
                  <option value="614">614 - Ingresos por intereses</option>
                  <option value="616">616 - Sin obligaciones fiscales</option>
                  <option value="620">620 - Sociedades Cooperativas de Producción</option>
                  <option value="621">621 - Incorporación Fiscal</option>
                  <option value="622">622 - Actividades Agrícolas, Ganaderas, Silvícolas y Pesqueras</option>
                  <option value="623">623 - Opcional para Grupos de Sociedades</option>
                  <option value="624">624 - Coordinados</option>
                  <option value="625">625 - Régimen de las Actividades Empresariales con ingresos a través de Plataformas Tecnológicas</option>
                  <option value="626">626 - Régimen Simplificado de Confianza</option>
                </select>
              </div>
            </div>
          </div>

          {/* Configuración de Folios */}
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <span>🔢</span> Configuración de Folios
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Serie por Defecto
                </label>
                <input
                  type="text"
                  name="serieDefault"
                  defaultValue={config?.serieDefault || 'A'}
                  maxLength={25}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent uppercase"
                  placeholder="A"
                />
                <p className="text-xs text-slate-500 mt-1">Ej: A, B, FACT, etc.</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Folio Inicial *
                </label>
                <input
                  type="number"
                  name="folioInicial"
                  defaultValue={config?.folioInicial || '1'}
                  required
                  min="1"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            {config && (
              <p className="text-sm text-blue-600 mt-2">
                Folio actual: {config.folioActual}
              </p>
            )}
          </div>

          {/* Configuración del PAC */}
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <span>🔐</span> Proveedor de Certificación (PAC)
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Proveedor PAC *
                </label>
                <select
                  name="pacProveedor"
                  defaultValue={config?.pacProveedor || 'facturama'}
                  required
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="facturama">Facturama</option>
                  <option value="finkok">Finkok</option>
                  <option value="otro">Otro PAC</option>
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Usuario / RFC del PAC
                  </label>
                  <input
                    type="text"
                    name="pacUsuario"
                    defaultValue={config?.pacUsuario || ''}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Contraseña del PAC
                  </label>
                  <input
                    type="password"
                    name="pacPassword"
                    defaultValue={config?.pacPassword || ''}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  API Key
                </label>
                <input
                  type="text"
                  name="pacApiKey"
                  defaultValue={config?.pacApiKey || ''}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-xs text-slate-500 mt-1">
                  Opcional, según el PAC seleccionado
                </p>
              </div>

              <div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="pacModoSandbox"
                    value="true"
                    defaultChecked={config?.pacModoSandbox ?? true}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <span className="text-sm font-medium text-slate-700">
                    Modo Sandbox (Pruebas)
                  </span>
                </label>
                <p className="text-xs text-slate-500 ml-6 mt-1">
                  Usa el ambiente de pruebas del PAC. Desactiva para producción.
                </p>
              </div>
            </div>
          </div>

          {/* Configuración de Email */}
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <span>✉️</span> Configuración de Email
            </h3>
            <div className="space-y-4">
              <div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="emailEnvioAutomatico"
                    value="true"
                    defaultChecked={config?.emailEnvioAutomatico || false}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <span className="text-sm font-medium text-slate-700">
                    Enviar facturas automáticamente por email
                  </span>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Asunto del Email
                </label>
                <input
                  type="text"
                  name="emailAsunto"
                  defaultValue={config?.emailAsunto || 'Su factura electrónica'}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Mensaje del Email
                </label>
                <textarea
                  name="emailMensaje"
                  defaultValue={config?.emailMensaje || 'Adjunto encontrará su factura electrónica en formato XML y PDF.'}
                  rows={4}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Certificados CSD */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <h3 className="font-semibold text-yellow-900 mb-3">🔑 Certificados de Sello Digital (CSD)</h3>
            <p className="text-sm text-yellow-800 mb-4">
              Los certificados .cer y .key se deben cargar después de guardar la configuración inicial.
              Próximamente tendrás la opción de subirlos en esta pantalla.
            </p>
            {config?.certificadoVigente && (
              <div className="text-sm text-yellow-800">
                ✓ Certificado vigente hasta: {config.certificadoExpira ? new Date(config.certificadoExpira).toLocaleDateString('es-MX') : 'N/A'}
              </div>
            )}
          </div>

          {/* Botones */}
          <div className="flex gap-3 pt-4 border-t border-slate-200">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              {config ? 'Actualizar Configuración' : 'Guardar Configuración'}
            </button>
            <a
              href={`/admin/empresas/${params.id}/facturacion`}
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
