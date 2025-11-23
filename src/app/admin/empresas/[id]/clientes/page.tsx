import { db } from '@/lib/db'
import { empresas, clientes } from '@/lib/db/schema'
import { eq, or, ilike, and } from 'drizzle-orm'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button-premium'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card-premium'
import { Badge } from '@/components/ui/badge-premium'
import { Users, UserPlus, ArrowLeft, Mail, Phone, MapPin, Calendar, TrendingUp } from 'lucide-react'

export default async function ClientesPage({
  params,
  searchParams
}: {
  params: { id: string }
  searchParams: { q?: string; tipo?: string }
}) {
  const [empresa] = await db
    .select()
    .from(empresas)
    .where(eq(empresas.id, params.id))
    .limit(1)

  if (!empresa) {
    redirect('/admin/empresas')
  }

  // Búsqueda y filtros
  const busqueda = searchParams.q || ''
  const tipoFiltro = searchParams.tipo || ''

  // Construir condiciones
  const condiciones: any[] = [eq(clientes.empresaId, params.id)]

  if (busqueda) {
    condiciones.push(
      or(
        ilike(clientes.nombre, `%${busqueda}%`),
        ilike(clientes.email, `%${busqueda}%`),
        ilike(clientes.rfc, `%${busqueda}%`)
      )
    )
  }

  if (tipoFiltro) {
    condiciones.push(eq(clientes.tipo, tipoFiltro))
  }

  const clientesEmpresa = await db
    .select()
    .from(clientes)
    .where(and(...condiciones))
    .orderBy(clientes.nombre)

  // Estadísticas
  const totalClientes = clientesEmpresa.length
  const clientesActivos = clientesEmpresa.filter(c => c.activo).length
  const personasFisicas = clientesEmpresa.filter(c => c.tipo === 'fisica').length
  const personasMorales = clientesEmpresa.filter(c => c.tipo === 'moral').length

  return (
    <div className="min-h-screen">
      {/* Animated gradient background */}
      <div className="fixed inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-blue-900/10 dark:to-slate-900 -z-10" />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-100/50 via-transparent to-purple-100/50 dark:from-blue-900/20 dark:to-purple-900/20 -z-10" />

      <div className="space-y-8 p-8">
        {/* Header Premium */}
        <Card variant="glass" className="shadow-2xl animate-in fade-in slide-in-from-top duration-700">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg shadow-blue-500/30">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                    Base de Clientes
                  </h1>
                  <p className="text-slate-600 dark:text-slate-400 mt-1 flex items-center gap-2">
                    <span>{empresa.nombre}</span>
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <Link href={`/admin/empresas/${params.id}/clientes/nuevo`}>
                  <Button variant="gradient" className="gap-2">
                    <UserPlus className="h-4 w-4" />
                    Nuevo Cliente
                  </Button>
                </Link>
                <Link href={`/admin/empresas/${params.id}`}>
                  <Button variant="glass" className="gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    Volver
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card variant="premium" className="animate-in fade-in slide-in-from-bottom duration-700">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl text-white">
                  <Users className="h-6 w-6" />
                </div>
                <div className="text-sm font-semibold text-slate-600 dark:text-slate-400">Total Clientes</div>
              </div>
              <div className="text-3xl font-bold text-slate-900 dark:text-white">{totalClientes}</div>
            </CardContent>
          </Card>

          <Card variant="premium" className="animate-in fade-in slide-in-from-bottom duration-700 delay-100">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl text-white">
                  <TrendingUp className="h-6 w-6" />
                </div>
                <div className="text-sm font-semibold text-slate-600 dark:text-slate-400">Activos</div>
              </div>
              <div className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                {clientesActivos}
              </div>
            </CardContent>
          </Card>

          <Card variant="premium" className="animate-in fade-in slide-in-from-bottom duration-700 delay-200">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl text-white">
                  <Users className="h-6 w-6" />
                </div>
                <div className="text-sm font-semibold text-slate-600 dark:text-slate-400">P. Físicas</div>
              </div>
              <div className="text-3xl font-bold text-slate-900 dark:text-white">{personasFisicas}</div>
            </CardContent>
          </Card>

          <Card variant="premium" className="animate-in fade-in slide-in-from-bottom duration-700 delay-300">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl text-white">
                  <Users className="h-6 w-6" />
                </div>
                <div className="text-sm font-semibold text-slate-600 dark:text-slate-400">P. Morales</div>
              </div>
              <div className="text-3xl font-bold text-slate-900 dark:text-white">{personasMorales}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filtros y búsqueda */}
        <Card variant="glass" className="shadow-xl animate-in fade-in slide-in-from-bottom duration-700 delay-200">
          <CardContent className="p-6">
            <form method="GET" className="flex gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  name="q"
                  defaultValue={busqueda}
                  placeholder="Buscar por nombre, email o RFC..."
                  className="w-full px-4 py-3 backdrop-blur-xl bg-white/60 dark:bg-slate-800/60 border-2 border-slate-200/50 dark:border-slate-700/50 rounded-xl
                           focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-400
                           transition-all duration-200
                           text-slate-900 dark:text-white placeholder:text-slate-400"
                />
              </div>
              <div>
                <select
                  name="tipo"
                  defaultValue={tipoFiltro}
                  className="px-4 py-3 backdrop-blur-xl bg-white/60 dark:bg-slate-800/60 border-2 border-slate-200/50 dark:border-slate-700/50 rounded-xl
                           focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-400
                           transition-all duration-200
                           text-slate-900 dark:text-white"
                >
                  <option value="">Todos los tipos</option>
                  <option value="fisica">Persona Física</option>
                  <option value="moral">Persona Moral</option>
                </select>
              </div>
              <Button variant="gradient" type="submit">
                Buscar
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Tabla Premium */}
        <Card variant="glass" className="shadow-xl animate-in fade-in slide-in-from-bottom duration-700 delay-300">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200/50 dark:divide-slate-700/50">
                <thead className="backdrop-blur-xl bg-slate-50/80 dark:bg-slate-800/80">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                      Cliente
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                      Contacto
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                      RFC
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                      Tipo
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200/50 dark:divide-slate-700/50">
                  {clientesEmpresa.map((cliente, index) => (
                    <tr
                      key={cliente.id}
                      className="group hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-colors animate-in fade-in slide-in-from-left duration-500"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {cliente.nombre}
                          </div>
                          {cliente.razonSocial && (
                            <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                              {cliente.razonSocial}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          {cliente.email && (
                            <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                              <Mail className="h-3 w-3" />
                              {cliente.email}
                            </div>
                          )}
                          {cliente.telefono && (
                            <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                              <Phone className="h-3 w-3" />
                              {cliente.telefono}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {cliente.rfc ? (
                          <code className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded text-sm font-mono text-slate-900 dark:text-white">
                            {cliente.rfc}
                          </code>
                        ) : (
                          <span className="text-sm text-slate-400">Sin RFC</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant={cliente.tipo === 'moral' ? 'info' : 'default'}>
                          {cliente.tipo === 'moral' ? 'Moral' : 'Física'}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        {cliente.activo ? (
                          <Badge variant="success">Activo</Badge>
                        ) : (
                          <Badge variant="destructive">Inactivo</Badge>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <Link href={`/admin/empresas/${params.id}/clientes/${cliente.id}`}>
                            <Button variant="ghost" size="sm" className="hover:text-blue-600">
                              Ver
                            </Button>
                          </Link>
                          <Link href={`/admin/empresas/${params.id}/clientes/${cliente.id}/editar`}>
                            <Button variant="ghost" size="sm" className="hover:text-emerald-600">
                              Editar
                            </Button>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {clientesEmpresa.length === 0 && (
                <div className="text-center py-16">
                  <div className="inline-flex p-6 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 rounded-3xl mb-4">
                    <Users className="h-16 w-16 text-slate-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                    No hay clientes registrados
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 mb-6">
                    {busqueda ? 'No se encontraron clientes con ese criterio' : 'Comienza agregando tu primer cliente'}
                  </p>
                  <Link href={`/admin/empresas/${params.id}/clientes/nuevo`}>
                    <Button variant="gradient" size="lg" className="gap-2">
                      <UserPlus className="h-5 w-5" />
                      Agregar Primer Cliente
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
