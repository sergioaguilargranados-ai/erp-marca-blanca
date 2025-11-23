export default async function DemoERPDashboard() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-slate-900">Dashboard</h2>
        <p className="text-slate-600 mt-1">
          Demostración del sistema ERP
        </p>
        <p className="text-sm text-emerald-600 mt-1">
          Tenant: demo (modo demostración)
        </p>
      </div>

      {/* Métricas del día */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Ventas del día"
          value="$0.00"
          icon="💵"
          subtitle="0 transacciones"
        />
        <MetricCard
          title="Productos"
          value="0"
          icon="📦"
          subtitle="En catálogo"
        />
        <MetricCard
          title="Stock bajo"
          value="0"
          icon="⚠️"
          subtitle="Productos"
        />
        <MetricCard
          title="Clientes"
          value="0"
          icon="👥"
          subtitle="Registrados"
        />
      </div>

      {/* Acciones rápidas */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">
          Acciones Rápidas
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <QuickAction
            title="Nueva Venta"
            description="Iniciar PDV"
            icon="🛒"
            href="/demo/pdv"
          />
          <QuickAction
            title="Agregar Producto"
            description="Añadir al catálogo"
            icon="➕"
            href="/demo/productos/nuevo"
          />
          <QuickAction
            title="Ver Reportes"
            description="Análisis y estadísticas"
            icon="📊"
            href="/demo/reportes"
          />
        </div>
      </div>

      {/* Ventas recientes */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">
          Ventas Recientes
        </h3>
        <div className="text-center py-12 text-slate-500">
          No hay ventas registradas
        </div>
      </div>
    </div>
  )
}

function MetricCard({
  title,
  value,
  icon,
  subtitle,
}: {
  title: string
  value: string
  icon: string
  subtitle: string
}) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-medium text-slate-600">{title}</p>
        <span className="text-2xl">{icon}</span>
      </div>
      <p className="text-3xl font-bold text-slate-900">{value}</p>
      <p className="text-sm mt-2 text-slate-500">{subtitle}</p>
    </div>
  )
}

function QuickAction({
  title,
  description,
  icon,
  href,
}: {
  title: string
  description: string
  icon: string
  href: string
}) {
  return (
    <a
      href={href}
      className="flex items-start gap-3 p-4 rounded-lg border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50 transition-colors"
    >
      <span className="text-2xl">{icon}</span>
      <div>
        <h4 className="font-medium text-slate-900">{title}</h4>
        <p className="text-sm text-slate-600">{description}</p>
      </div>
    </a>
  )
}
