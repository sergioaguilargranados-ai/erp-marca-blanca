import { db } from '@/lib/db'
import { empresas, planes, usuarios } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { redirect } from 'next/navigation'

export default async function EmpresaDetallesPage({ params }: { params: { id: string } }) {
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

  // Obtener usuarios de la empresa
  const usuariosEmpresa = await db
    .select()
    .from(usuarios)
    .where(eq(usuarios.empresaId, params.id))

  const estadoColors = {
    pendiente: 'bg-orange-100 text-orange-800 border-orange-200',
    prueba: 'bg-blue-100 text-blue-800 border-blue-200',
    activa: 'bg-green-100 text-green-800 border-green-200',
    suspendida: 'bg-red-100 text-red-800 border-red-200',
    cancelada: 'bg-slate-100 text-slate-800 border-slate-200',
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-slate-900">{empresa.nombre}</h1>
            <span className={`px-3 py-1 text-sm font-semibold rounded-full border ${estadoColors[empresa.estado as keyof typeof estadoColors]}`}>
              {empresa.estado}
            </span>
          </div>
          <p className="text-slate-600 font-mono">
            {empresa.subdominio}.tudominio.com
          </p>
        </div>
        <div className="flex gap-2">
          <a href={`/admin/empresas/${empresa.id}/editar`} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Editar
          </a>
          <a href="/admin/empresas" className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300">
            Volver
          </a>
        </div>
      </div>

      {/* Grid de información */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Información General */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <h3 className="font-semibold text-slate-900 mb-4">Información General</h3>
          <dl className="space-y-3">
            <div>
              <dt className="text-xs text-slate-500 uppercase">Plan</dt>
              <dd className="text-sm font-medium text-slate-900">{plan?.nombre || 'Sin plan'}</dd>
            </div>
            <div>
              <dt className="text-xs text-slate-500 uppercase">Precio</dt>
              <dd className="text-sm font-medium text-slate-900">
                {plan?.precioMensual ? `$${plan.precioMensual} ${plan.moneda}/mes` : 'Personalizado'}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-slate-500 uppercase">Contacto</dt>
              <dd className="text-sm font-medium text-slate-900">{empresa.nombreContacto}</dd>
            </div>
            <div>
              <dt className="text-xs text-slate-500 uppercase">Email</dt>
              <dd className="text-sm font-medium text-slate-900">{empresa.emailContacto}</dd>
            </div>
            <div>
              <dt className="text-xs text-slate-500 uppercase">Teléfono</dt>
              <dd className="text-sm font-medium text-slate-900">{empresa.telefonoContacto || 'No proporcionado'}</dd>
            </div>
          </dl>
        </div>

        {/* Fechas */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <h3 className="font-semibold text-slate-900 mb-4">Fechas</h3>
          <dl className="space-y-3">
            <div>
              <dt className="text-xs text-slate-500 uppercase">Registro</dt>
              <dd className="text-sm font-medium text-slate-900">
                {new Date(empresa.createdAt).toLocaleDateString('es-MX')}
              </dd>
            </div>
            {empresa.fechaInicioPrueba && (
              <div>
                <dt className="text-xs text-slate-500 uppercase">Inicio Prueba</dt>
                <dd className="text-sm font-medium text-slate-900">
                  {new Date(empresa.fechaInicioPrueba).toLocaleDateString('es-MX')}
                </dd>
              </div>
            )}
            {empresa.fechaFinPrueba && (
              <div>
                <dt className="text-xs text-slate-500 uppercase">Fin Prueba</dt>
                <dd className="text-sm font-medium text-slate-900">
                  {new Date(empresa.fechaFinPrueba).toLocaleDateString('es-MX')}
                </dd>
              </div>
            )}
            {empresa.fechaActivacion && (
              <div>
                <dt className="text-xs text-slate-500 uppercase">Activación</dt>
                <dd className="text-sm font-medium text-slate-900">
                  {new Date(empresa.fechaActivacion).toLocaleDateString('es-MX')}
                </dd>
              </div>
            )}
            {empresa.proximoPago && (
              <div>
                <dt className="text-xs text-slate-500 uppercase">Próximo Pago</dt>
                <dd className="text-sm font-medium text-slate-900">
                  {new Date(empresa.proximoPago).toLocaleDateString('es-MX')}
                </dd>
              </div>
            )}
          </dl>
        </div>

        {/* Uso */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <h3 className="font-semibold text-slate-900 mb-4">Uso Actual</h3>
          <dl className="space-y-3">
            <div>
              <dt className="text-xs text-slate-500 uppercase">Usuarios</dt>
              <dd className="text-sm font-medium text-slate-900">
                {empresa.usoUsuarios} {plan?.maxUsuarios ? `/ ${plan.maxUsuarios}` : '/ ∞'}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-slate-500 uppercase">Sucursales</dt>
              <dd className="text-sm font-medium text-slate-900">
                {empresa.usoSucursales} / {plan?.maxSucursales || 99}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-slate-500 uppercase">Productos</dt>
              <dd className="text-sm font-medium text-slate-900">
                {empresa.usoProductos} {plan?.maxProductos ? `/ ${plan.maxProductos}` : '/ ∞'}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-slate-500 uppercase">Transacciones (mes)</dt>
              <dd className="text-sm font-medium text-slate-900">
                {empresa.usoTransaccionesMes} {plan?.maxTransaccionesMes ? `/ ${plan.maxTransaccionesMes}` : '/ ∞'}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-slate-500 uppercase">Almacenamiento</dt>
              <dd className="text-sm font-medium text-slate-900">
                {(empresa.usoAlmacenamientoMb / 1024).toFixed(2)} GB
                {plan?.maxAlmacenamientoGb ? ` / ${plan.maxAlmacenamientoGb} GB` : ' / ∞'}
              </dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Usuarios */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <h3 className="font-semibold text-slate-900 mb-4">
          Usuarios ({usuariosEmpresa.length})
        </h3>
        <div className="space-y-2">
          {usuariosEmpresa.map((usuario) => (
            <div key={usuario.id} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
              <div>
                <div className="font-medium text-slate-900">{usuario.nombre}</div>
                <div className="text-sm text-slate-600">{usuario.email}</div>
              </div>
              <div className="flex items-center gap-3">
                {usuario.emailVerificado && (
                  <span className="text-xs text-green-600">✓ Verificado</span>
                )}
                <span className={`text-xs px-2 py-1 rounded ${usuario.activo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {usuario.activo ? 'Activo' : 'Inactivo'}
                </span>
                {usuario.bloqueado && (
                  <span className="text-xs px-2 py-1 rounded bg-red-100 text-red-800">
                    Bloqueado
                  </span>
                )}
              </div>
            </div>
          ))}
          {usuariosEmpresa.length === 0 && (
            <div className="text-center py-8 text-slate-500">
              No hay usuarios registrados
            </div>
          )}
        </div>
      </div>

      {/* Gestión */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <h3 className="font-semibold text-slate-900 mb-4">Gestión</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <a href={`/admin/empresas/${empresa.id}/sucursales`} className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-center hover:bg-emerald-700">
            🏢 Sucursales
          </a>

          <a href={`/admin/empresas/${empresa.id}/roles`} className="px-4 py-2 bg-purple-600 text-white rounded-lg text-center hover:bg-purple-700">
            🔐 Roles y Permisos
          </a>

          <a href={`/admin/empresas/${empresa.id}/usuarios`} className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-center hover:bg-indigo-700">
            👥 Usuarios
          </a>

          <a href={`/admin/empresas/${empresa.id}/clientes`} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-center hover:bg-blue-700">
            👤 Clientes
          </a>

          <a href={`/admin/empresas/${empresa.id}/productos`} className="px-4 py-2 bg-orange-600 text-white rounded-lg text-center hover:bg-orange-700">
            📦 Productos
          </a>

          <a href={`/admin/empresas/${empresa.id}/inventario`} className="px-4 py-2 bg-teal-600 text-white rounded-lg text-center hover:bg-teal-700">
            📊 Inventario
          </a>

          <a href={`/admin/empresas/${empresa.id}/ventas`} className="px-4 py-2 bg-green-600 text-white rounded-lg text-center hover:bg-green-700">
            🛒 Ventas
          </a>

          <a href={`/admin/empresas/${empresa.id}/cajas`} className="px-4 py-2 bg-yellow-600 text-white rounded-lg text-center hover:bg-yellow-700">
            🏪 Cajas
          </a>

          <a href={`/admin/empresas/${empresa.id}/turnos`} className="px-4 py-2 bg-purple-600 text-white rounded-lg text-center hover:bg-purple-700">
            ⏰ Turnos
          </a>

          <a href={`/admin/empresas/${empresa.id}/facturacion`} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-center hover:bg-blue-700">
            💰 Facturación
          </a>

          <a href={`/admin/empresas/${empresa.id}/reportes`} className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-center hover:bg-indigo-700">
            📊 Reportes
          </a>

          <a href={`/admin/empresas/${empresa.id}/proveedores`} className="px-4 py-2 bg-amber-600 text-white rounded-lg text-center hover:bg-amber-700">
            📦 Proveedores
          </a>

          <a href={`/admin/empresas/${empresa.id}/compras`} className="px-4 py-2 bg-pink-600 text-white rounded-lg text-center hover:bg-pink-700">
            🛒 Compras
          </a>
        </div>
      </div>

      {/* Acciones */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <h3 className="font-semibold text-slate-900 mb-4">Acciones Administrativas</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {empresa.estado === 'pendiente' && (
            <a href={`/admin/empresas/${empresa.id}/aprobar`} className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-center hover:bg-emerald-700">
              Aprobar Empresa
            </a>
          )}

          {(empresa.estado === 'prueba' || empresa.estado === 'activa') && (
            <a href={`/admin/empresas/${empresa.id}/suspender`} className="px-4 py-2 bg-orange-600 text-white rounded-lg text-center hover:bg-orange-700">
              Suspender
            </a>
          )}

          {empresa.estado === 'suspendida' && (
            <a href={`/admin/empresas/${empresa.id}/reactivar`} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-center hover:bg-blue-700">
              Reactivar
            </a>
          )}

          <a href={`/admin/empresas/${empresa.id}/cambiar-plan`} className="px-4 py-2 bg-purple-600 text-white rounded-lg text-center hover:bg-purple-700">
            Cambiar Plan
          </a>

          <a href={`/admin/empresas/${empresa.id}/editar`} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-center hover:bg-blue-700">
            Editar Información
          </a>

          <a href={`/admin/empresas/${empresa.id}/cancelar`} className="px-4 py-2 bg-red-600 text-white rounded-lg text-center hover:bg-red-700">
            Cancelar Empresa
          </a>
        </div>
      </div>
    </div>
  )
}
