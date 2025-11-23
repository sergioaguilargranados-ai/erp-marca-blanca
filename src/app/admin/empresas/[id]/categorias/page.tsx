import { db } from '@/lib/db'
import { empresas, categorias } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { redirect } from 'next/navigation'

export default async function CategoriasPage({ params }: { params: { id: string } }) {
  const [empresa] = await db
    .select()
    .from(empresas)
    .where(eq(empresas.id, params.id))
    .limit(1)

  if (!empresa) {
    redirect('/admin/empresas')
  }

  const categoriasEmpresa = await db
    .select()
    .from(categorias)
    .where(eq(categorias.empresaId, params.id))
    .orderBy(categorias.nombre)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Categorías de Productos</h1>
          <p className="text-slate-600 mt-1">
            Organiza tus productos en {empresa.nombre}
          </p>
          <p className="text-sm text-slate-500 mt-1">
            {categoriasEmpresa.length} categorías registradas
          </p>
        </div>
        <div className="flex gap-2">
          <a
            href={`/admin/empresas/${params.id}/categorias/nueva`}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
          >
            + Nueva Categoría
          </a>
          <a
            href={`/admin/empresas/${params.id}`}
            className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300"
          >
            ← Volver
          </a>
        </div>
      </div>

      {/* Grid de categorías */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categoriasEmpresa.map((categoria) => (
          <div
            key={categoria.id}
            className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">{categoria.nombre}</h3>
                {categoria.codigo && (
                  <p className="text-sm text-slate-500 font-mono mt-1">#{categoria.codigo}</p>
                )}
              </div>
              <span
                className={`px-2 py-1 text-xs font-semibold rounded ${
                  categoria.activa
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {categoria.activa ? 'Activa' : 'Inactiva'}
              </span>
            </div>

            {categoria.descripcion && (
              <p className="text-sm text-slate-600 mb-4 line-clamp-2">
                {categoria.descripcion}
              </p>
            )}

            <div className="flex gap-2 pt-4 border-t border-slate-200">
              <a
                href={`/admin/empresas/${params.id}/categorias/${categoria.id}`}
                className="flex-1 text-center px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
              >
                Ver
              </a>
              <a
                href={`/admin/empresas/${params.id}/categorias/${categoria.id}/editar`}
                className="flex-1 text-center px-3 py-2 bg-slate-200 text-slate-700 text-sm rounded-lg hover:bg-slate-300"
              >
                Editar
              </a>
            </div>
          </div>
        ))}

        {categoriasEmpresa.length === 0 && (
          <div className="col-span-full text-center py-12 bg-white rounded-lg border-2 border-dashed border-slate-300">
            <div className="text-6xl mb-4">📦</div>
            <p className="text-slate-500 mb-4">No hay categorías registradas</p>
            <a
              href={`/admin/empresas/${params.id}/categorias/nueva`}
              className="inline-block px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
            >
              Crear Primera Categoría
            </a>
          </div>
        )}
      </div>
    </div>
  )
}
