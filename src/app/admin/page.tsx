import { db } from '@/lib/db'
import { empresas } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { Building2, Users, Clock, TrendingUp, CheckCircle, XCircle, Sparkles, Activity } from 'lucide-react'
import Link from 'next/link'

export default async function SuperAdminDashboard() {
  // Obtener empresas pendientes
  const empresasPendientes = await db
    .select()
    .from(empresas)
    .where(eq(empresas.estado, 'pendiente'))

  // Contar empresas por estado
  const todasEmpresas = await db.select().from(empresas)
  const activas = todasEmpresas.filter(e => e.estado === 'activa').length
  const prueba = todasEmpresas.filter(e => e.estado === 'prueba').length
  const pendientes = empresasPendientes.length

  return (
    <div className="min-h-screen">
      {/* Fondo animado con gradiente */}
      <div className="fixed inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-blue-900/10 dark:to-slate-900 -z-10" />

      {/* Mesh background effect */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-100/50 via-transparent to-purple-100/50 dark:from-blue-900/20 dark:to-purple-900/20 -z-10" />

      <div className="relative space-y-8 p-8">
        {/* Header con efecto glass */}
        <div className="backdrop-blur-xl bg-white/70 dark:bg-slate-900/70 rounded-2xl border border-white/20 dark:border-slate-700/50 p-8 shadow-2xl animate-in fade-in slide-in-from-top duration-700">
          <div className="flex items-center gap-4 mb-2">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg shadow-blue-500/30">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Dashboard Super Admin
              </h1>
              <p className="text-slate-600 dark:text-slate-400 mt-1">
                Panel de control y gestión de tu plataforma ERP
              </p>
            </div>
          </div>
        </div>

        {/* Métricas principales con efectos premium */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-in fade-in slide-in-from-bottom duration-700">
          <MetricCard
            title="Empresas Activas"
            value={activas.toString()}
            icon={<Building2 className="h-8 w-8" />}
            change="+12%"
            changeType="positive"
            gradient="from-emerald-500 to-teal-600"
            iconBg="from-emerald-500 to-teal-600"
          />
          <MetricCard
            title="En Prueba"
            value={prueba.toString()}
            icon={<Clock className="h-8 w-8" />}
            change="+5%"
            changeType="neutral"
            gradient="from-blue-500 to-cyan-600"
            iconBg="from-blue-500 to-cyan-600"
          />
          <MetricCard
            title="Pendientes"
            value={pendientes.toString()}
            icon={<Users className="h-8 w-8" />}
            change={`+${pendientes}`}
            changeType={pendientes > 0 ? "warning" : "neutral"}
            gradient="from-orange-500 to-red-500"
            iconBg="from-orange-500 to-red-500"
          />
          <MetricCard
            title="Total"
            value={todasEmpresas.length.toString()}
            icon={<TrendingUp className="h-8 w-8" />}
            change="+18%"
            changeType="positive"
            gradient="from-purple-500 to-pink-600"
            iconBg="from-purple-500 to-pink-600"
          />
        </div>

        {/* Empresas pendientes con glass effect */}
        <div className="backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 rounded-2xl border border-white/20 dark:border-slate-700/50 p-8 shadow-2xl hover:shadow-3xl transition-all duration-300 animate-in fade-in slide-in-from-bottom duration-700 delay-100">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl">
                <Activity className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                Empresas Pendientes de Aprobación
              </h3>
            </div>
            {empresasPendientes.length > 0 && (
              <span className="bg-gradient-to-r from-orange-500 to-red-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg shadow-orange-500/30 animate-pulse">
                {empresasPendientes.length} pendiente{empresasPendientes.length !== 1 ? 's' : ''}
              </span>
            )}
          </div>

          {empresasPendientes.length === 0 ? (
            <div className="text-center py-16">
              <div className="inline-flex p-6 bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20 rounded-3xl mb-4">
                <CheckCircle className="h-16 w-16 text-green-600 dark:text-green-400" />
              </div>
              <p className="text-lg text-slate-600 dark:text-slate-400 font-medium">
                ¡Excelente! No hay empresas pendientes de aprobación
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {empresasPendientes.map((empresa, index) => (
                <div
                  key={empresa.id}
                  className="group backdrop-blur-md bg-white/60 dark:bg-slate-800/60 border border-slate-200/50 dark:border-slate-700/50 rounded-2xl p-6 hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-1 transition-all duration-300 animate-in fade-in slide-in-from-left"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex justify-between items-start gap-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg">
                          <Building2 className="h-5 w-5 text-white" />
                        </div>
                        <h4 className="text-xl font-bold text-slate-900 dark:text-white">
                          {empresa.nombre}
                        </h4>
                      </div>

                      <div className="space-y-2 ml-11">
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          <span className="font-semibold">Subdominio:</span>{' '}
                          <span className="font-mono px-2 py-1 bg-blue-100 dark:bg-blue-900/30 rounded-md text-blue-700 dark:text-blue-300">
                            {empresa.subdominio}.tudominio.com
                          </span>
                        </p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          <span className="font-semibold">Contacto:</span> {empresa.nombreContacto} • {empresa.emailContacto}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-500">
                          Registrado el {new Date(empresa.createdAt).toLocaleDateString('es-MX', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Link
                        href={`/admin/empresas/${empresa.id}/aprobar`}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-br from-emerald-500 to-green-600 text-white rounded-xl font-semibold shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40 hover:scale-105 active:scale-95 transition-all duration-200"
                      >
                        <CheckCircle className="h-5 w-5" />
                        Aprobar
                      </Link>
                      <Link
                        href={`/admin/empresas/${empresa.id}/rechazar`}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-br from-red-500 to-rose-600 text-white rounded-xl font-semibold shadow-lg shadow-red-500/30 hover:shadow-xl hover:shadow-red-500/40 hover:scale-105 active:scale-95 transition-all duration-200"
                      >
                        <XCircle className="h-5 w-5" />
                        Rechazar
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Actividad reciente */}
        <div className="backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 rounded-2xl border border-white/20 dark:border-slate-700/50 p-8 shadow-2xl animate-in fade-in slide-in-from-bottom duration-700 delay-200">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl">
              <Activity className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
              Actividad Reciente
            </h3>
          </div>

          <div className="text-center py-16">
            <div className="inline-flex p-6 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 rounded-3xl mb-4">
              <Activity className="h-16 w-16 text-slate-400 dark:text-slate-500" />
            </div>
            <p className="text-lg text-slate-600 dark:text-slate-400 font-medium">
              No hay actividad reciente
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-500 mt-2">
              Las acciones de los usuarios aparecerán aquí
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function MetricCard({
  title,
  value,
  icon,
  change,
  changeType,
  gradient,
  iconBg,
}: {
  title: string
  value: string
  icon: React.ReactNode
  change: string
  changeType: 'positive' | 'negative' | 'neutral' | 'warning'
  gradient: string
  iconBg: string
}) {
  const changeColor = {
    positive: 'text-green-600 dark:text-green-400',
    negative: 'text-red-600 dark:text-red-400',
    neutral: 'text-slate-600 dark:text-slate-400',
    warning: 'text-orange-600 dark:text-orange-400',
  }[changeType]

  const changeBg = {
    positive: 'bg-green-100 dark:bg-green-900/20',
    negative: 'bg-red-100 dark:bg-red-900/20',
    neutral: 'bg-slate-100 dark:bg-slate-800',
    warning: 'bg-orange-100 dark:bg-orange-900/20',
  }[changeType]

  return (
    <div className="group backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 rounded-2xl border border-white/20 dark:border-slate-700/50 p-6 shadow-xl hover:shadow-2xl hover:-translate-y-2 hover:scale-[1.02] transition-all duration-300 overflow-hidden relative">
      {/* Efecto de gradiente sutil en hover */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />

      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide">
            {title}
          </p>
          <div className={`p-3 bg-gradient-to-br ${iconBg} rounded-xl shadow-lg text-white group-hover:scale-110 transition-transform duration-300`}>
            {icon}
          </div>
        </div>

        <p className="text-4xl font-bold text-slate-900 dark:text-white mb-3">
          {value}
        </p>

        <div className={`inline-flex items-center gap-1 ${changeBg} ${changeColor} px-3 py-1 rounded-full text-xs font-bold`}>
          <TrendingUp className="h-3 w-3" />
          {change} vs mes anterior
        </div>
      </div>
    </div>
  )
}
