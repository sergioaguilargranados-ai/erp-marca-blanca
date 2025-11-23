import { db } from '@/lib/db'
import { empresas, sucursales, usuarios } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { redirect } from 'next/navigation'
import { PuntoDeVenta } from './pdv-component'

export default async function PDVPage({ params }: { params: { id: string } }) {
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

  // Obtener usuarios (vendedores)
  const usuariosEmpresa = await db
    .select()
    .from(usuarios)
    .where(eq(usuarios.empresaId, params.id))

  if (sucursalesEmpresa.length === 0) {
    return (
      <div className="max-w-2xl mx-auto mt-12">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-yellow-900 mb-2">
            ⚠️ No hay sucursales registradas
          </h2>
          <p className="text-yellow-800 mb-4">
            Debes crear al menos una sucursal antes de usar el Punto de Venta.
          </p>
          <a
            href={`/admin/empresas/${params.id}/sucursales/nueva`}
            className="inline-block px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
          >
            Crear Sucursal
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col">
      <PuntoDeVenta
        empresaId={params.id}
        sucursales={sucursalesEmpresa.map(s => ({ id: s.id, nombre: s.nombre, tasaIva: s.tasaIva }))}
        usuarios={usuariosEmpresa.map(u => ({ id: u.id, nombre: u.nombre }))}
      />
    </div>
  )
}
