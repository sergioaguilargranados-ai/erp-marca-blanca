import { db } from '@/lib/db'
import { empresas, usuarios } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { redirect } from 'next/navigation'

export default async function CancelarEmpresaPage({ params }: { params: { id: string } }) {
  const [empresa] = await db
    .select()
    .from(empresas)
    .where(eq(empresas.id, params.id))
    .limit(1)

  if (!empresa) {
    redirect('/admin/empresas')
  }

  const cancelar = async (formData: FormData) => {
    'use server'

    const motivo = formData.get('motivo') as string
    const eliminarDatos = formData.get('eliminarDatos') === 'true'

    if (eliminarDatos) {
      // TODO: Eliminar todos los datos relacionados (usuarios, sucursales, productos, etc.)
      // Por ahora solo marcamos como cancelada
      await db
        .update(empresas)
        .set({
          estado: 'cancelada',
          fechaCancelacion: new Date(),
          motivoCancelacion: motivo,
          updatedAt: new Date(),
        })
        .where(eq(empresas.id, params.id))
    } else {
      // Solo marcar como cancelada, mantener datos
      await db
        .update(empresas)
        .set({
          estado: 'cancelada',
          fechaCancelacion: new Date(),
          motivoCancelacion: motivo,
          updatedAt: new Date(),
        })
        .where(eq(empresas.id, params.id))
    }

    // Desactivar todos los usuarios
    await db
      .update(usuarios)
      .set({
        activo: false,
        bloqueado: true,
        razonBloqueo: `Empresa cancelada: ${motivo}`,
        updatedAt: new Date(),
      })
      .where(eq(usuarios.empresaId, params.id))

    // TODO: Enviar email de cancelación
    // TODO: Generar reporte final
    // TODO: Procesar reembolsos si aplica

    redirect('/admin/empresas?success=empresa-cancelada')
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-6">
          Cancelar Empresa
        </h1>

        <div className="bg-red-50 border-2 border-red-300 rounded-lg p-6 mb-6">
          <h2 className="font-semibold text-red-900 mb-2 flex items-center gap-2">
            <span className="text-2xl">⚠️</span>
            Esta es una acción IRREVERSIBLE
          </h2>
          <p className="text-red-800 text-sm mb-3">
            Al cancelar esta empresa:
          </p>
          <ul className="list-disc list-inside text-red-800 text-sm space-y-1 mb-3">
            <li>Se bloqueará el acceso de todos los usuarios</li>
            <li>La empresa no podrá usar el sistema</li>
            <li>Se detendrá la facturación</li>
            <li>El subdominio quedará liberado</li>
          </ul>
          <p className="text-red-900 font-semibold text-sm">
            ⚠️ Puedes optar por eliminar todos los datos o mantenerlos archivados
          </p>
        </div>

        <div className="space-y-3 mb-8 pb-6 border-b border-slate-200">
          <div className="flex justify-between">
            <span className="text-slate-600">Empresa:</span>
            <span className="font-semibold text-slate-900">{empresa.nombre}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-600">Subdominio:</span>
            <span className="font-mono text-slate-900">{empresa.subdominio}.tudominio.com</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-600">Estado actual:</span>
            <span className="text-slate-900">{empresa.estado}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-600">Usuarios:</span>
            <span className="text-slate-900">{empresa.usoUsuarios}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-600">Sucursales:</span>
            <span className="text-slate-900">{empresa.usoSucursales}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-600">Productos:</span>
            <span className="text-slate-900">{empresa.usoProductos}</span>
          </div>
        </div>

        <form action={cancelar} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Motivo de cancelación *
            </label>
            <textarea
              name="motivo"
              required
              rows={4}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="Explica el motivo de la cancelación..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-3">
              ¿Qué hacer con los datos?
            </label>
            <div className="space-y-3">
              <label className="flex items-start gap-3 p-4 border-2 border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50">
                <input
                  type="radio"
                  name="eliminarDatos"
                  value="false"
                  defaultChecked
                  className="mt-1"
                />
                <div>
                  <div className="font-medium text-slate-900">Mantener datos archivados</div>
                  <div className="text-sm text-slate-600">
                    Los datos se conservarán por 90 días. La empresa puede reactivarse.
                  </div>
                </div>
              </label>

              <label className="flex items-start gap-3 p-4 border-2 border-red-200 rounded-lg cursor-pointer hover:bg-red-50">
                <input
                  type="radio"
                  name="eliminarDatos"
                  value="true"
                  className="mt-1"
                />
                <div>
                  <div className="font-medium text-red-900">Eliminar todos los datos</div>
                  <div className="text-sm text-red-700">
                    ⚠️ PELIGRO: Todos los datos se eliminarán permanentemente. Esta acción NO se puede deshacer.
                  </div>
                </div>
              </label>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-800">
              <strong>Importante:</strong> Antes de cancelar, asegúrate de:
            </p>
            <ul className="list-disc list-inside text-sm text-yellow-800 mt-2 space-y-1">
              <li>Haber notificado a la empresa</li>
              <li>Procesar reembolsos pendientes (si aplica)</li>
              <li>Generar reportes finales</li>
              <li>Descargar backup de datos importantes</li>
            </ul>
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              className="flex-1 bg-red-600 text-white py-3 rounded-lg font-medium hover:bg-red-700 transition-colors"
            >
              Confirmar Cancelación
            </button>
            <a
              href={`/admin/empresas/${params.id}`}
              className="flex-1 text-center bg-slate-200 text-slate-700 py-3 rounded-lg font-medium hover:bg-slate-300 transition-colors"
            >
              Volver Atrás
            </a>
          </div>
        </form>
      </div>
    </div>
  )
}
