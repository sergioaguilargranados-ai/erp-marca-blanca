import { db } from '@/lib/db'
import { empresas, sucursales } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { redirect } from 'next/navigation'
import { FormularioAjusteInventario } from './form-ajuste'

export default async function AjustarInventarioPage({ params }: { params: { id: string } }) {
  const [empresa] = await db
    .select()
    .from(empresas)
    .where(eq(empresas.id, params.id))
    .limit(1)

  if (!empresa) {
    redirect('/admin/empresas')
  }

  // Obtener sucursales
  const sucursalesEmpresa = await db
    .select()
    .from(sucursales)
    .where(eq(sucursales.empresaId, params.id))

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Ajustar Inventario</h1>
            <p className="text-slate-600 mt-1">Entrada o salida manual de stock</p>
          </div>
          <a
            href={`/admin/empresas/${params.id}/inventario`}
            className="text-slate-600 hover:text-slate-900"
          >
            ← Volver
          </a>
        </div>

        <FormularioAjusteInventario
          empresaId={params.id}
          sucursales={sucursalesEmpresa.map((s) => ({ id: s.id, nombre: s.nombre }))}
        />
      </div>
    </div>
  )
}
