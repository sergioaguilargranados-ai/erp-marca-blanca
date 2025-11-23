import { db } from '@/lib/db'
import { empresas, usuarios } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { redirect } from 'next/navigation'

export default async function SuspenderEmpresaPage({ params }: { params: { id: string } }) {
  const [empresa] = await db
    .select()
    .from(empresas)
    .where(eq(empresas.id, params.id))
    .limit(1)

  if (!empresa) {
    redirect('/admin/empresas')
  }

  const suspender = async (formData: FormData) => {
    'use server'

    const motivo = formData.get('motivo') as string

    // Actualizar estado de la empresa a 'suspendida'
    await db
      .update(empresas)
      .set({
        estado: 'suspendida',
        fechaSuspension: new Date(),
        motivoCancelacion: motivo,
        updatedAt: new Date(),
      })
      .where(eq(empresas.id, params.id))

    // Bloquear todos los usuarios de la empresa
    await db
      .update(usuarios)
      .set({
        bloqueado: true,
        razonBloqueo: `Empresa suspendida: ${motivo}`,
        updatedAt: new Date(),
      })
      .where(eq(usuarios.empresaId, params.id))

    // TODO: Enviar email de suspensión

    redirect(`/admin/empresas/${params.id}?success=empresa-suspendida`)
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-6">
          Suspender Empresa
        </h1>

        <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
          <h2 className="font-semibold text-red-900 mb-2">
            ⚠️ ¿Estás seguro de suspender esta empresa?
          </h2>
          <p className="text-red-800 text-sm mb-3">
            Esta acción:
          </p>
          <ul className="list-disc list-inside text-red-800 text-sm space-y-1">
            <li>Bloqueará el acceso de todos los usuarios</li>
            <li>La empresa no podrá usar el sistema</li>
            <li>Los datos se mantendrán intactos</li>
            <li>Puedes reactivarla en cualquier momento</li>
          </ul>
        </div>

        <div className="space-y-3 mb-8">
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
        </div>

        <form action={suspender} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Motivo de suspensión *
            </label>
            <textarea
              name="motivo"
              required
              rows={4}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="Ej: Falta de pago, violación de términos..."
            />
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              className="flex-1 bg-red-600 text-white py-3 rounded-lg font-medium hover:bg-red-700 transition-colors"
            >
              Suspender Empresa
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
