import { db } from '@/lib/db'
import { empresas, usuarios } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { redirect } from 'next/navigation'

export default async function AprobarEmpresaPage({ params }: { params: { id: string } }) {
  const [empresa] = await db
    .select()
    .from(empresas)
    .where(eq(empresas.id, params.id))
    .limit(1)

  if (!empresa) {
    redirect('/admin')
  }

  const aprobar = async () => {
    'use server'

    // Actualizar estado de la empresa a 'prueba' (30 días gratis)
    await db
      .update(empresas)
      .set({
        estado: 'prueba',
        fechaActivacion: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(empresas.id, params.id))

    // Activar el usuario administrador
    await db
      .update(usuarios)
      .set({
        activo: true,
        updatedAt: new Date(),
      })
      .where(eq(usuarios.empresaId, params.id))

    // Crear roles predefinidos para la empresa
    const { seedRoles } = await import('@/lib/db/seed-roles')
    await seedRoles(params.id)

    // TODO: Enviar email de aprobación a la empresa

    redirect('/admin?success=empresa-aprobada')
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-6">
          Aprobar Empresa
        </h1>

        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6 mb-6">
          <h2 className="font-semibold text-emerald-900 mb-2">
            ¿Estás seguro de aprobar esta empresa?
          </h2>
          <p className="text-emerald-800 text-sm">
            La empresa podrá acceder al sistema y comenzará su período de prueba de 30 días.
          </p>
        </div>

        <div className="space-y-3 mb-8">
          <div className="flex justify-between">
            <span className="text-slate-600">Nombre:</span>
            <span className="font-semibold text-slate-900">{empresa.nombre}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-600">Subdominio:</span>
            <span className="font-mono text-slate-900">{empresa.subdominio}.tudominio.com</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-600">Contacto:</span>
            <span className="text-slate-900">{empresa.nombreContacto}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-600">Email:</span>
            <span className="text-slate-900">{empresa.emailContacto}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-600">Teléfono:</span>
            <span className="text-slate-900">{empresa.telefonoContacto || 'No proporcionado'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-600">Registrado:</span>
            <span className="text-slate-900">{new Date(empresa.createdAt).toLocaleString('es-MX')}</span>
          </div>
        </div>

        <form action={aprobar} className="flex gap-3">
          <button
            type="submit"
            className="flex-1 bg-emerald-600 text-white py-3 rounded-lg font-medium hover:bg-emerald-700 transition-colors"
          >
            Aprobar y Activar
          </button>
          <a
            href="/admin"
            className="flex-1 text-center bg-slate-200 text-slate-700 py-3 rounded-lg font-medium hover:bg-slate-300 transition-colors"
          >
            Cancelar
          </a>
        </form>
      </div>
    </div>
  )
}
