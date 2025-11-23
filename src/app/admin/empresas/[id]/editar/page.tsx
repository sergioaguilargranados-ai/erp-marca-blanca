import { db } from '@/lib/db'
import { empresas } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { redirect } from 'next/navigation'

export default async function EditarEmpresaPage({ params }: { params: { id: string } }) {
  const [empresa] = await db
    .select()
    .from(empresas)
    .where(eq(empresas.id, params.id))
    .limit(1)

  if (!empresa) {
    redirect('/admin/empresas')
  }

  const actualizar = async (formData: FormData) => {
    'use server'

    const nombre = formData.get('nombre') as string
    const nombreContacto = formData.get('nombreContacto') as string
    const emailContacto = formData.get('emailContacto') as string
    const telefonoContacto = formData.get('telefonoContacto') as string
    const nombreSistema = formData.get('nombreSistema') as string
    const colorPrimario = formData.get('colorPrimario') as string
    const colorSecundario = formData.get('colorSecundario') as string

    await db
      .update(empresas)
      .set({
        nombre,
        nombreContacto,
        emailContacto,
        telefonoContacto,
        nombreSistema: nombreSistema || nombre,
        colorPrimario: colorPrimario || null,
        colorSecundario: colorSecundario || null,
        updatedAt: new Date(),
      })
      .where(eq(empresas.id, params.id))

    redirect(`/admin/empresas/${params.id}?success=empresa-actualizada`)
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-slate-900">
            Editar Empresa
          </h1>
          <a href={`/admin/empresas/${params.id}`} className="text-slate-600 hover:text-slate-900">
            ← Volver
          </a>
        </div>

        <form action={actualizar} className="space-y-8">
          {/* Información General */}
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-4">
              Información General
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Nombre de la Empresa *
                </label>
                <input
                  type="text"
                  name="nombre"
                  defaultValue={empresa.nombre}
                  required
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Subdominio
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={empresa.subdominio}
                    disabled
                    className="flex-1 px-4 py-3 border border-slate-300 rounded-lg bg-slate-50 text-slate-500"
                  />
                  <span className="text-slate-600">.tudominio.com</span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  El subdominio no se puede cambiar una vez creado
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Nombre del Sistema (White Label)
                </label>
                <input
                  type="text"
                  name="nombreSistema"
                  defaultValue={empresa.nombreSistema || empresa.nombre}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Nombre que verá el cliente en el sistema"
                />
                <p className="text-xs text-slate-500 mt-1">
                  Si no se especifica, se usará el nombre de la empresa
                </p>
              </div>
            </div>
          </div>

          {/* Contacto */}
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-4">
              Información de Contacto
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Nombre del Contacto *
                </label>
                <input
                  type="text"
                  name="nombreContacto"
                  defaultValue={empresa.nombreContacto || ''}
                  required
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Email de Contacto *
                  </label>
                  <input
                    type="email"
                    name="emailContacto"
                    defaultValue={empresa.emailContacto}
                    required
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    name="telefonoContacto"
                    defaultValue={empresa.telefonoContacto || ''}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Personalización (White Label) */}
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-4">
              Personalización (White Label)
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Color Primario
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      name="colorPrimario"
                      defaultValue={empresa.colorPrimario || '#3B82F6'}
                      className="h-12 w-20 rounded-lg border border-slate-300"
                    />
                    <input
                      type="text"
                      value={empresa.colorPrimario || '#3B82F6'}
                      readOnly
                      className="flex-1 px-4 py-3 border border-slate-300 rounded-lg bg-slate-50 font-mono text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Color Secundario
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      name="colorSecundario"
                      defaultValue={empresa.colorSecundario || '#10B981'}
                      className="h-12 w-20 rounded-lg border border-slate-300"
                    />
                    <input
                      type="text"
                      value={empresa.colorSecundario || '#10B981'}
                      readOnly
                      className="flex-1 px-4 py-3 border border-slate-300 rounded-lg bg-slate-50 font-mono text-sm"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <strong>Nota:</strong> Los colores se aplicarán en todo el sistema de la empresa para mantener su identidad corporativa.
                </p>
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
              href={`/admin/empresas/${params.id}`}
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
