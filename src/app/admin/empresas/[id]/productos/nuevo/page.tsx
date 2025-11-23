import { db } from '@/lib/db'
import { empresas, categorias } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { redirect } from 'next/navigation'
import { FormularioProducto } from './form'

export default async function NuevoProductoPage({ params }: { params: { id: string } }) {
  const [empresa] = await db
    .select()
    .from(empresas)
    .where(eq(empresas.id, params.id))
    .limit(1)

  if (!empresa) {
    redirect('/admin/empresas')
  }

  // Obtener categorías
  const categoriasEmpresa = await db
    .select()
    .from(categorias)
    .where(eq(categorias.empresaId, params.id))
    .orderBy(categorias.nombre)

  return (
    <div className="max-w-5xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Nuevo Producto</h1>
            <p className="text-slate-600 mt-1">Para {empresa.nombre}</p>
          </div>
          <a
            href={`/admin/empresas/${params.id}/productos`}
            className="text-slate-600 hover:text-slate-900"
          >
            ← Volver
          </a>
        </div>

        <FormularioProducto
          empresaId={params.id}
          categorias={categoriasEmpresa.map(c => ({ id: c.id, nombre: c.nombre }))}
        />

      </div>
    </div>
  )
}
