import { db } from '@/lib/db'
import { empresas, planes } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { redirect } from 'next/navigation'

export default async function CambiarPlanPage({ params }: { params: { id: string } }) {
  const [empresaData] = await db
    .select({
      empresa: empresas,
      planActual: planes,
    })
    .from(empresas)
    .leftJoin(planes, eq(empresas.planId, planes.id))
    .where(eq(empresas.id, params.id))
    .limit(1)

  if (!empresaData) {
    redirect('/admin/empresas')
  }

  const { empresa, planActual } = empresaData

  // Obtener todos los planes activos en la misma moneda
  const monedaPlan = planActual?.moneda || 'MXN'
  const planesDisponibles = await db
    .select()
    .from(planes)
    .where(eq(planes.activo, true))

  const cambiarPlan = async (formData: FormData) => {
    'use server'

    const nuevoPlanId = formData.get('planId') as string
    const notas = formData.get('notas') as string

    // Actualizar plan de la empresa
    await db
      .update(empresas)
      .set({
        planId: nuevoPlanId,
        updatedAt: new Date(),
      })
      .where(eq(empresas.id, params.id))

    // TODO: Registrar cambio en historial
    // TODO: Enviar email de notificación de cambio de plan
    // TODO: Ajustar próximo cobro si es necesario

    redirect(`/admin/empresas/${params.id}?success=plan-cambiado`)
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-6">
          Cambiar Plan de Suscripción
        </h1>

        {/* Plan actual */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
          <h2 className="font-semibold text-blue-900 mb-3">Plan Actual</h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-blue-800">Nombre:</span>
              <span className="font-semibold text-blue-900">{planActual?.nombre || 'Sin plan'}</span>
            </div>
            {planActual?.precioMensual && (
              <div className="flex justify-between">
                <span className="text-blue-800">Precio:</span>
                <span className="font-semibold text-blue-900">
                  ${planActual.precioMensual} {planActual.moneda}/mes
                </span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-blue-800">Usuarios:</span>
              <span className="font-semibold text-blue-900">
                {empresa.usoUsuarios} / {planActual?.maxUsuarios || '∞'}
              </span>
            </div>
          </div>
        </div>

        {/* Información de la empresa */}
        <div className="space-y-3 mb-8">
          <div className="flex justify-between">
            <span className="text-slate-600">Empresa:</span>
            <span className="font-semibold text-slate-900">{empresa.nombre}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-600">Subdominio:</span>
            <span className="font-mono text-slate-900">{empresa.subdominio}.tudominio.com</span>
          </div>
        </div>

        {/* Formulario de cambio */}
        <form action={cambiarPlan} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Nuevo Plan *
            </label>
            <select
              name="planId"
              required
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Selecciona un plan</option>
              {planesDisponibles.map((plan) => (
                <option
                  key={plan.id}
                  value={plan.id}
                  disabled={plan.id === empresa.planId}
                >
                  {plan.nombre} - {plan.precioMensual ? `$${plan.precioMensual} ${plan.moneda}/mes` : 'Personalizado'}
                  {plan.id === empresa.planId ? ' (Actual)' : ''}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Notas (opcional)
            </label>
            <textarea
              name="notas"
              rows={3}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Motivo del cambio, instrucciones especiales..."
            />
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-800">
              <strong>Nota:</strong> El cambio de plan será efectivo inmediatamente.
              El próximo cobro se ajustará al nuevo plan.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Cambiar Plan
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
