import { db } from '@/lib/db'
import { empresas, ventas, productos, clientes } from '@/lib/db/schema'
import { eq, desc, sql, and, gte } from 'drizzle-orm'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { DashboardCharts } from '@/components/DashboardCharts'
import { Button } from '@/components/ui/button-premium'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card-premium'
import { Badge } from '@/components/ui/badge-premium'
import {
  TrendingUp,
  ShoppingCart,
  DollarSign,
  Users,
  BarChart3,
  ArrowLeft,
  Plus,
  Package,
  UserPlus,
  Receipt,
  Zap
} from 'lucide-react'

export default async function DashboardPage({ params }: { params: { id: string } }) {
  const [empresa] = await db
    .select()
    .from(empresas)
    .where(eq(empresas.id, params.id))
    .limit(1)

  if (!empresa) {
    redirect('/admin/empresas')
  }

  // Obtener datos de los últimos 30 días
  const fechaInicio = new Date()
  fechaInicio.setDate(fechaInicio.getDate() - 30)

  // Ventas por día (últimos 30 días)
  const ventasPorDia = await db
    .select({
      fecha: sql<string>`DATE(${ventas.createdAt})`.as('fecha'),
      total: sql<number>`SUM(CAST(${ventas.total} AS DECIMAL))`.as('total'),
      cantidad: sql<number>`COUNT(*)`.as('cantidad'),
    })
    .from(ventas)
    .where(and(
      eq(ventas.empresaId, params.id),
      eq(ventas.estado, 'completada'),
      gte(ventas.createdAt, fechaInicio)
    ))
    .groupBy(sql`DATE(${ventas.createdAt})`)
    .orderBy(sql`DATE(${ventas.createdAt})`)

  // KPIs principales
  const totalVentas = await db
    .select({
      total: sql<number>`SUM(CAST(${ventas.total} AS DECIMAL))`,
      cantidad: sql<number>`COUNT(*)`,
    })
    .from(ventas)
    .where(and(
      eq(ventas.empresaId, params.id),
      eq(ventas.estado, 'completada'),
      gte(ventas.createdAt, fechaInicio)
    ))

  // Productos más vendidos (últimos 30 días)
  const topProductos = await db
    .select({
      producto: productos.nombre,
      cantidadVendida: sql<number>`COUNT(*)`,
      totalVentas: sql<number>`SUM(CAST(${ventas.total} AS DECIMAL))`,
    })
    .from(ventas)
    .innerJoin(productos, eq(ventas.empresaId, productos.empresaId))
    .where(and(
      eq(ventas.empresaId, params.id),
      eq(ventas.estado, 'completada'),
      gte(ventas.createdAt, fechaInicio)
    ))
    .groupBy(productos.nombre)
    .orderBy(desc(sql`SUM(CAST(${ventas.total} AS DECIMAL))`))
    .limit(5)

  // Clientes nuevos por mes
  const clientesPorMes = await db
    .select({
      mes: sql<string>`TO_CHAR(${clientes.createdAt}, 'YYYY-MM')`.as('mes'),
      total: sql<number>`COUNT(*)`.as('total'),
    })
    .from(clientes)
    .where(eq(clientes.empresaId, params.id))
    .groupBy(sql`TO_CHAR(${clientes.createdAt}, 'YYYY-MM')`)
    .orderBy(sql`TO_CHAR(${clientes.createdAt}, 'YYYY-MM')`)
    .limit(6)

  const kpis = totalVentas[0] || { total: 0, cantidad: 0 }
  const promedioVenta = kpis.cantidad > 0 ? Number(kpis.total) / kpis.cantidad : 0

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
                  <BarChart3 className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                    Dashboard Analytics
                  </h1>
                  <p className="text-slate-600 dark:text-slate-400 mt-1 flex items-center gap-2">
                    <span>Análisis avanzado de</span>
                    <Badge variant="gradient" className="font-semibold">
                      {empresa.nombre}
                    </Badge>
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <Link href={`/admin/empresas/${params.id}/reportes`}>
                  <Button variant="gradient" className="gap-2">
                    <BarChart3 className="h-4 w-4" />
                    Ver Reportes
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

        {/* KPIs Premium */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <KPICard
            icon={<DollarSign className="h-8 w-8" />}
            title="Total Vendido"
            value={`$${Number(kpis.total || 0).toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
            subtitle="Últimos 30 días"
            gradient="from-blue-500 to-cyan-600"
            delay={0}
          />
          <KPICard
            icon={<ShoppingCart className="h-8 w-8" />}
            title="Ventas Realizadas"
            value={String(kpis.cantidad || 0)}
            subtitle="Transacciones"
            gradient="from-emerald-500 to-teal-600"
            delay={100}
          />
          <KPICard
            icon={<TrendingUp className="h-8 w-8" />}
            title="Ticket Promedio"
            value={`$${promedioVenta.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
            subtitle="Por venta"
            gradient="from-purple-500 to-pink-600"
            delay={200}
          />
          <KPICard
            icon={<Users className="h-8 w-8" />}
            title="Clientes Activos"
            value={String(empresa.usoProductos || 0)}
            subtitle="Total registrados"
            gradient="from-orange-500 to-red-600"
            delay={300}
          />
        </div>

        {/* Charts Premium */}
        <div className="animate-in fade-in slide-in-from-bottom duration-700 delay-200">
          <DashboardCharts
            ventasPorDia={ventasPorDia}
            topProductos={topProductos}
            clientesPorMes={clientesPorMes}
          />
        </div>

        {/* Quick Actions Premium */}
        <Card variant="glass" className="shadow-xl animate-in fade-in slide-in-from-bottom duration-700 delay-300">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-2xl">Acciones Rápidas</CardTitle>
            </div>
            <CardDescription>
              Accesos directos a las funciones más utilizadas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <QuickActionCard
                href={`/admin/empresas/${params.id}/ventas/nueva`}
                icon={<Receipt className="h-6 w-6" />}
                title="Nueva Venta"
                description="Registrar venta rápida"
                gradient="from-blue-500 to-cyan-600"
                hoverColor="hover:border-blue-400"
                delay={0}
              />
              <QuickActionCard
                href={`/admin/empresas/${params.id}/productos/nuevo`}
                icon={<Package className="h-6 w-6" />}
                title="Nuevo Producto"
                description="Agregar al catálogo"
                gradient="from-emerald-500 to-teal-600"
                hoverColor="hover:border-emerald-400"
                delay={100}
              />
              <QuickActionCard
                href={`/admin/empresas/${params.id}/clientes/nuevo`}
                icon={<UserPlus className="h-6 w-6" />}
                title="Nuevo Cliente"
                description="Registrar cliente"
                gradient="from-purple-500 to-pink-600"
                hoverColor="hover:border-purple-400"
                delay={200}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function KPICard({
  icon,
  title,
  value,
  subtitle,
  gradient,
  delay = 0
}: {
  icon: React.ReactNode
  title: string
  value: string
  subtitle: string
  gradient: string
  delay?: number
}) {
  return (
    <Card
      variant="premium"
      className="group overflow-hidden animate-in fade-in slide-in-from-bottom duration-700"
      style={{ animationDelay: `${delay}ms` }}
    >
      <CardContent className="p-6">
        <div className={`inline-flex p-3 bg-gradient-to-br ${gradient} rounded-xl shadow-lg text-white mb-4 group-hover:scale-110 transition-transform duration-300`}>
          {icon}
        </div>
        <div className="space-y-1">
          <p className="text-sm font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide">
            {title}
          </p>
          <p className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
            {value}
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-500 flex items-center gap-1">
            <TrendingUp className="h-3 w-3" />
            {subtitle}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

function QuickActionCard({
  href,
  icon,
  title,
  description,
  gradient,
  hoverColor,
  delay = 0
}: {
  href: string
  icon: React.ReactNode
  title: string
  description: string
  gradient: string
  hoverColor: string
  delay?: number
}) {
  return (
    <Link href={href}>
      <Card
        variant="elevated"
        className={`group cursor-pointer border-2 border-transparent ${hoverColor} hover:scale-105 active:scale-95 transition-all animate-in fade-in slide-in-from-left duration-700`}
        style={{ animationDelay: `${delay}ms` }}
      >
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className={`p-3 bg-gradient-to-br ${gradient} rounded-xl shadow-lg text-white group-hover:shadow-xl transition-shadow`}>
              {icon}
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-lg text-slate-900 dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {title}
              </h4>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {description}
              </p>
            </div>
            <Plus className="h-5 w-5 text-slate-400 group-hover:text-blue-500 group-hover:rotate-90 transition-all" />
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
