import { db } from '@/lib/db'
import { empresas, usuarios, roles, sucursales } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { redirect } from 'next/navigation'

export default async function UsuariosEmpresaPage({ params }: { params: { id: string } }) {
  const [empresa] = await db
    .select()
    .from(empresas)
    .where(eq(empresas.id, params.id))
    .limit(1)

  if (!empresa) {
    redirect('/admin/empresas')
  }

  // Obtener todos los usuarios con sus roles y sucursales
  const usuariosEmpresa = await db
    .select({
      usuario: usuarios,
      rol: roles,
      sucursal: sucursales,
    })
    .from(usuarios)
    .leftJoin(roles, eq(usuarios.rolId, roles.id))
    .leftJoin(sucursales, eq(usuarios.sucursalPrincipal, sucursales.id))
    .where(eq(usuarios.empresaId, params.id))
    .orderBy(usuarios.createdAt)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Usuarios</h1>
          <p className="text-slate-600 mt-1">
            Gestiona los usuarios de {empresa.nombre}
          </p>
          <p className="text-sm text-slate-500 mt-1">
            {usuariosEmpresa.length} usuarios registrados
          </p>
        </div>
        <div className="flex gap-2">
          <a
            href={`/admin/empresas/${params.id}/usuarios/nuevo`}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            + Nuevo Usuario
          </a>
          <a
            href={`/admin/empresas/${params.id}`}
            className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300"
          >
            ← Volver
          </a>
        </div>
      </div>

      {/* Lista de usuarios */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Usuario
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Rol
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Sucursal Principal
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Último Acceso
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {usuariosEmpresa.map(({ usuario, rol, sucursal }) => (
              <tr key={usuario.id} className="hover:bg-slate-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="font-medium text-slate-900">{usuario.nombre}</div>
                    <div className="text-sm text-slate-500">{usuario.email}</div>
                    {usuario.telefono && (
                      <div className="text-xs text-slate-400">{usuario.telefono}</div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {rol ? (
                    <div>
                      <div className="text-sm font-medium text-slate-900">{rol.nombre}</div>
                      {rol.esPredefinido && (
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                          Predefinido
                        </span>
                      )}
                    </div>
                  ) : (
                    <span className="text-sm text-slate-400">Sin rol asignado</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {sucursal ? (
                    <div className="text-sm text-slate-900">{sucursal.nombre}</div>
                  ) : (
                    <span className="text-sm text-slate-400">Sin sucursal</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex flex-col gap-1">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      usuario.activo
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {usuario.activo ? 'Activo' : 'Inactivo'}
                    </span>
                    {usuario.bloqueado && (
                      <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                        Bloqueado
                      </span>
                    )}
                    {usuario.emailVerificado && (
                      <span className="text-xs text-green-600">✓ Email verificado</span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                  {usuario.ultimoLogin
                    ? new Date(usuario.ultimoLogin).toLocaleDateString('es-MX')
                    : 'Nunca'
                  }
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end gap-2">
                    <a href={`/admin/empresas/${params.id}/usuarios/${usuario.id}`} className="text-indigo-600 hover:text-indigo-900">
                      Ver
                    </a>
                    <a href={`/admin/empresas/${params.id}/usuarios/${usuario.id}/editar`} className="text-blue-600 hover:text-blue-900">
                      Editar
                    </a>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {usuariosEmpresa.length === 0 && (
          <div className="text-center py-12 text-slate-500">
            No hay usuarios registrados
          </div>
        )}
      </div>
    </div>
  )
}
