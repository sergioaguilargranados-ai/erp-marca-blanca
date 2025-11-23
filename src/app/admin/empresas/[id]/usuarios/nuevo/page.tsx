import { db } from '@/lib/db'
import { empresas, usuarios, roles, sucursales, planes } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { redirect } from 'next/navigation'
import bcrypt from 'bcryptjs'

export default async function NuevoUsuarioPage({ params }: { params: { id: string } }) {
  const [empresaData] = await db
    .select({
      empresa: empresas,
      plan: planes,
    })
    .from(empresas)
    .leftJoin(planes, eq(empresas.planId, planes.id))
    .where(eq(empresas.id, params.id))
    .limit(1)

  if (!empresaData) {
    redirect('/admin/empresas')
  }

  const { empresa, plan } = empresaData

  // Obtener roles y sucursales de la empresa
  const rolesEmpresa = await db
    .select()
    .from(roles)
    .where(eq(roles.empresaId, params.id))
    .orderBy(roles.esPredefinido, roles.nombre)

  const sucursalesEmpresa = await db
    .select()
    .from(sucursales)
    .where(eq(sucursales.empresaId, params.id))

  // Verificar límite de usuarios
  const totalUsuarios = await db
    .select()
    .from(usuarios)
    .where(eq(usuarios.empresaId, params.id))

  const maxUsuarios = plan?.maxUsuarios

  const crear = async (formData: FormData) => {
    'use server'

    // Verificar límite
    if (maxUsuarios && totalUsuarios.length >= maxUsuarios) {
      redirect(`/admin/empresas/${params.id}/usuarios?error=limite-alcanzado`)
    }

    const nombre = formData.get('nombre') as string
    const email = formData.get('email') as string
    const telefono = formData.get('telefono') as string
    const password = formData.get('password') as string
    const rolId = formData.get('rolId') as string
    const sucursalPrincipal = formData.get('sucursalPrincipal') as string

    // Verificar que el email no exista
    const [emailExistente] = await db
      .select()
      .from(usuarios)
      .where(eq(usuarios.email, email))
      .limit(1)

    if (emailExistente) {
      redirect(`/admin/empresas/${params.id}/usuarios/nuevo?error=email-existente`)
    }

    // Hash de contraseña
    const passwordHash = await bcrypt.hash(password, 10)

    // Crear usuario
    await db.insert(usuarios).values({
      empresaId: params.id,
      nombre,
      email,
      telefono: telefono || null,
      passwordHash,
      rolId: rolId || null,
      sucursalPrincipal: sucursalPrincipal || null,
      activo: true,
      bloqueado: false,
      emailVerificado: false,
    })

    // Actualizar contador de uso
    await db
      .update(empresas)
      .set({
        usoUsuarios: totalUsuarios.length + 1,
        updatedAt: new Date(),
      })
      .where(eq(empresas.id, params.id))

    redirect(`/admin/empresas/${params.id}/usuarios?success=usuario-creado`)
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Nuevo Usuario</h1>
            <p className="text-slate-600 mt-1">Para {empresa.nombre}</p>
          </div>
          <a
            href={`/admin/empresas/${params.id}/usuarios`}
            className="text-slate-600 hover:text-slate-900"
          >
            ← Volver
          </a>
        </div>

        {maxUsuarios && totalUsuarios.length >= maxUsuarios && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800 font-semibold">
              ⚠️ Límite de usuarios alcanzado
            </p>
            <p className="text-red-700 text-sm mt-1">
              Esta empresa ya tiene {totalUsuarios.length} usuarios (máximo: {maxUsuarios}).
              Actualiza el plan para agregar más usuarios.
            </p>
          </div>
        )}

        <form action={crear} className="space-y-6">
          {/* Información Personal */}
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-4">
              Información Personal
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Nombre Completo *
                </label>
                <input
                  type="text"
                  name="nombre"
                  required
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Juan Pérez"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="usuario@empresa.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    name="telefono"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="+52 55 1234 5678"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Contraseña *
                </label>
                <input
                  type="password"
                  name="password"
                  required
                  minLength={8}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="••••••••"
                />
                <p className="text-xs text-slate-500 mt-1">
                  Mínimo 8 caracteres
                </p>
              </div>
            </div>
          </div>

          {/* Asignación */}
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-4">
              Asignación
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Rol
                </label>
                <select
                  name="rolId"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="">Sin rol asignado</option>
                  {rolesEmpresa.map((rol) => (
                    <option key={rol.id} value={rol.id}>
                      {rol.nombre} {rol.esPredefinido && '(Predefinido)'}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-slate-500 mt-1">
                  El rol determina los permisos del usuario
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Sucursal Principal
                </label>
                <select
                  name="sucursalPrincipal"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="">Sin sucursal asignada</option>
                  {sucursalesEmpresa.map((sucursal) => (
                    <option key={sucursal.id} value={sucursal.id}>
                      {sucursal.nombre}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-slate-500 mt-1">
                  Sucursal por defecto del usuario
                </p>
              </div>
            </div>
          </div>

          {/* Información */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>Nota:</strong> El usuario recibirá un email con las instrucciones para acceder al sistema.
              Podrá cambiar su contraseña en el primer inicio de sesión.
            </p>
          </div>

          {/* Botones */}
          <div className="flex gap-3 pt-4 border-t border-slate-200">
            <button
              type="submit"
              disabled={maxUsuarios ? totalUsuarios.length >= maxUsuarios : false}
              className="flex-1 bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Crear Usuario
            </button>
            <a
              href={`/admin/empresas/${params.id}/usuarios`}
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
