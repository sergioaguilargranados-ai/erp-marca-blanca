import { db } from '@/lib/db'
import { empresas, usuarios } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { redirect } from 'next/navigation'

export default async function ReactivarEmpresaPage({ params }: { params: { id: string } }) {
  const [empresa] = await db
    .select()
    .from(empresas)
    .where(eq(empresas.id, params.id))
    .limit(1)

  if (!empresa || empresa.estado !== 'suspendida') {
    redirect('/admin/empresas')
  }

  const reactivar = async () => {
    'use server'

    // Determinar el nuevo estado (prueba o activa según fechas)
    const ahora = new Date()
    let nuevoEstado: string = 'activa'

    if (empresa.fechaFinPrueba && new Date(empresa.fechaFinPrueba) > ahora) {
      nuevoEstado = 'prueba'
    }

    // Actualizar estado de la empresa
    await db
      .update(empresas)
      .set({
        estado: nuevoEstado,
        fechaSuspension: null,
        updatedAt: new Date(),
      })
      .where(eq(empresas.id, params.id))

    // Desbloquear todos los usuarios de la empresa
    await db
      .update(usuarios)
      .set({
        bloqueado: false,
        razonBloqueo: null,
        updatedAt: new Date(),
      })
      .where(eq(usuarios.empresaId, params.id))

    // TODO: Enviar email de reactivación

    redirect(`/admin/empresas/${params.id}?success=empresa-reactivada`)
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-6">
          Reactivar Empresa
        </h1>

        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6 mb-6">
          <h2 className="font-semibold text-emerald-900 mb-2">
            ¿Estás seguro de reactivar esta empresa?
          </h2>
          <p className="text-emerald-800 text-sm mb-3">
            Esta acción:
          </p>
          <ul className="list-disc list-inside text-emerald-800 text-sm space-y-1">
            <li>Desbloqueará el acceso de todos los usuarios</li>
            <li>La empresa podrá usar el sistema normalmente</li>
            <li>Se restaurará el servicio completo</li>
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
            <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-sm">Suspendida</span>
          </div>
          {empresa.motivoCancelacion && (
            <div>
              <div className="text-slate-600 mb-1">Motivo de suspensión:</div>
              <div className="text-sm text-slate-900 bg-slate-50 p-3 rounded">
                {empresa.motivoCancelacion}
              </div>
            </div>
          )}
          {empresa.fechaSuspension && (
            <div className="flex justify-between">
              <span className="text-slate-600">Fecha de suspensión:</span>
              <span className="text-slate-900">
                {new Date(empresa.fechaSuspension).toLocaleDateString('es-MX')}
              </span>
            </div>
          )}
        </div>

        <form action={reactivar} className="flex gap-3">
          <button
            type="submit"
            className="flex-1 bg-emerald-600 text-white py-3 rounded-lg font-medium hover:bg-emerald-700 transition-colors"
          >
            Reactivar Empresa
          </button>
          <a
            href={`/admin/empresas/${params.id}`}
            className="flex-1 text-center bg-slate-200 text-slate-700 py-3 rounded-lg font-medium hover:bg-slate-300 transition-colors"
          >
            Cancelar
          </a>
        </form>
      </div>
    </div>
  )
}
