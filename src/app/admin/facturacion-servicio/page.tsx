import Link from 'next/link';
import { DollarSign, TrendingUp, CreditCard, AlertCircle, CheckCircle, Clock, Users } from 'lucide-react';

export default async function FacturacionServicioPage() {
  // Mock data - en producción vendría de la base de datos y Stripe
  const metricas = {
    mrr: 45000, // Monthly Recurring Revenue
    arr: 540000, // Annual Recurring Revenue
    tasaCrecimiento: 12.5,
    empresasActivas: 45,
    empresasPrueba: 12,
    tasaRetencion: 94.5,
    ingresosMesActual: 47500,
    cobrosExitosos: 43,
    cobrosFallidos: 2,
  };

  const facturas = [
    {
      id: '1',
      empresa: 'Comercializadora ABC S.A.',
      plan: 'Profesional',
      monto: 1500,
      estado: 'pagada',
      fechaEmision: '2025-11-01',
      fechaPago: '2025-11-03',
      metodoPago: 'stripe',
    },
    {
      id: '2',
      empresa: 'Distribuidora XYZ',
      plan: 'Empresarial',
      monto: 2500,
      estado: 'pendiente',
      fechaEmision: '2025-11-15',
      fechaVencimiento: '2025-11-25',
      metodoPago: 'stripe',
    },
    {
      id: '3',
      empresa: 'Importadora LMN',
      plan: 'Básico',
      monto: 800,
      estado: 'vencida',
      fechaEmision: '2025-10-01',
      fechaVencimiento: '2025-10-11',
      metodoPago: 'transferencia',
    },
  ];

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case 'pagada':
        return { bg: 'bg-green-100 dark:bg-green-900', text: 'text-green-700 dark:text-green-300', icon: CheckCircle };
      case 'pendiente':
        return { bg: 'bg-yellow-100 dark:bg-yellow-900', text: 'text-yellow-700 dark:text-yellow-300', icon: Clock };
      case 'vencida':
        return { bg: 'bg-red-100 dark:bg-red-900', text: 'text-red-700 dark:text-red-300', icon: AlertCircle };
      default:
        return { bg: 'bg-slate-100 dark:bg-slate-700', text: 'text-slate-700 dark:text-slate-300', icon: Clock };
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Facturación del Servicio</h1>
        <p className="text-muted-foreground">
          Métricas de ingresos, cobros automáticos y gestión de suscripciones
        </p>
      </div>

      {/* Métricas Principales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-lg shadow-lg">
          <div className="flex items-center gap-3 mb-2">
            <DollarSign className="h-6 w-6" />
            <span className="text-sm font-medium opacity-90">MRR</span>
          </div>
          <p className="text-3xl font-bold mb-1">${metricas.mrr.toLocaleString()}</p>
          <div className="flex items-center gap-1 text-sm opacity-90">
            <TrendingUp className="h-4 w-4" />
            <span>+{metricas.tasaCrecimiento}% este mes</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-lg shadow-lg">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="h-6 w-6" />
            <span className="text-sm font-medium opacity-90">ARR</span>
          </div>
          <p className="text-3xl font-bold mb-1">${metricas.arr.toLocaleString()}</p>
          <p className="text-sm opacity-90">Ingresos Anuales Proyectados</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-lg shadow-lg">
          <div className="flex items-center gap-3 mb-2">
            <Users className="h-6 w-6" />
            <span className="text-sm font-medium opacity-90">Empresas Activas</span>
          </div>
          <p className="text-3xl font-bold mb-1">{metricas.empresasActivas}</p>
          <p className="text-sm opacity-90">{metricas.empresasPrueba} en período de prueba</p>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-6 rounded-lg shadow-lg">
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle className="h-6 w-6" />
            <span className="text-sm font-medium opacity-90">Tasa de Retención</span>
          </div>
          <p className="text-3xl font-bold mb-1">{metricas.tasaRetencion}%</p>
          <p className="text-sm opacity-90">Últimos 12 meses</p>
        </div>
      </div>

      {/* Estadísticas Adicionales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border">
          <div className="flex items-center gap-3">
            <div className="bg-green-100 dark:bg-green-900 p-2 rounded">
              <DollarSign className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Ingresos Mes Actual</p>
              <p className="text-xl font-bold">${metricas.ingresosMesActual.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded">
              <CheckCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Cobros Exitosos</p>
              <p className="text-xl font-bold">{metricas.cobrosExitosos}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border">
          <div className="flex items-center gap-3">
            <div className="bg-red-100 dark:bg-red-900 p-2 rounded">
              <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Cobros Fallidos</p>
              <p className="text-xl font-bold text-red-600">{metricas.cobrosFallidos}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border mb-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <select className="px-3 py-2 border rounded-lg">
            <option>Todos los estados</option>
            <option>Pagada</option>
            <option>Pendiente</option>
            <option>Vencida</option>
          </select>
          <select className="px-3 py-2 border rounded-lg">
            <option>Todos los planes</option>
            <option>Básico</option>
            <option>Profesional</option>
            <option>Empresarial</option>
          </select>
          <input
            type="date"
            className="px-3 py-2 border rounded-lg"
            placeholder="Desde"
          />
          <input
            type="date"
            className="px-3 py-2 border rounded-lg"
            placeholder="Hasta"
          />
        </div>
      </div>

      {/* Tabla de Facturas */}
      <div className="bg-white dark:bg-slate-800 rounded-lg border">
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="text-lg font-semibold">Facturas Recientes</h2>
          <Link
            href="/admin/facturacion-servicio/todas"
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            Ver todas
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 dark:bg-slate-900">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium">Empresa</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Plan</th>
                <th className="px-4 py-3 text-right text-sm font-medium">Monto</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Método Pago</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Fecha Emisión</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Estado</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {facturas.map((factura) => {
                const estadoBadge = getEstadoBadge(factura.estado);
                const Icon = estadoBadge.icon;
                return (
                  <tr key={factura.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/50">
                    <td className="px-4 py-3 font-medium">{factura.empresa}</td>
                    <td className="px-4 py-3">
                      <span className="inline-block px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded text-xs">
                        {factura.plan}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-semibold">${factura.monto.toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm capitalize">{factura.metodoPago}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {new Date(factura.fechaEmision).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium capitalize ${estadoBadge.bg} ${estadoBadge.text}`}>
                        <Icon className="h-3 w-3" />
                        {factura.estado}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/facturacion-servicio/${factura.id}`}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                      >
                        Ver detalles
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Configuración de Stripe */}
      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
        <div className="flex items-start gap-3">
          <CreditCard className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
          <div>
            <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
              Configuración de Stripe
            </h3>
            <p className="text-sm text-blue-700 dark:text-blue-300 mb-3">
              Los cobros automáticos se procesan a través de Stripe. Configura tus claves API y webhooks.
            </p>
            <Link
              href="/admin/facturacion-servicio/configuracion"
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm"
            >
              Configurar Stripe
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
