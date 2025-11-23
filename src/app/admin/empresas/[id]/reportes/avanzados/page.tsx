import Link from 'next/link';
import { FileText, TrendingUp, Package, DollarSign, Users, ShoppingCart, BarChart3, Download } from 'lucide-react';

export default async function ReportesAvanzadosPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const reportes = [
    {
      id: 'ventas-detallado',
      nombre: 'Ventas Detallado',
      descripcion: 'Análisis completo de ventas por período, sucursal y vendedor',
      icon: TrendingUp,
      color: 'bg-green-500',
    },
    {
      id: 'rentabilidad',
      nombre: 'Rentabilidad por Producto',
      descripcion: 'Análisis de márgenes y rentabilidad de productos',
      icon: DollarSign,
      color: 'bg-blue-500',
    },
    {
      id: 'inventario-valorizado',
      nombre: 'Inventario Valorizado',
      descripcion: 'Valor total del inventario y movimientos',
      icon: Package,
      color: 'bg-purple-500',
    },
    {
      id: 'rotacion',
      nombre: 'Rotación de Inventario',
      descripcion: 'Productos de alta y baja rotación',
      icon: BarChart3,
      color: 'bg-orange-500',
    },
    {
      id: 'cuentas-cobrar',
      nombre: 'Cuentas por Cobrar',
      descripcion: 'Estado de cartera y antigüedad de saldos',
      icon: FileText,
      color: 'bg-red-500',
    },
    {
      id: 'cuentas-pagar',
      nombre: 'Cuentas por Pagar',
      descripcion: 'Compromisos con proveedores',
      icon: ShoppingCart,
      color: 'bg-yellow-500',
    },
    {
      id: 'clientes',
      nombre: 'Análisis de Clientes',
      descripcion: 'Comportamiento y segmentación de clientes',
      icon: Users,
      color: 'bg-pink-500',
    },
    {
      id: 'auditoria',
      nombre: 'Auditoría de Sistema',
      descripcion: 'Log de acciones y cambios en el sistema',
      icon: FileText,
      color: 'bg-slate-500',
    },
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Reportes Avanzados</h1>
        <p className="text-muted-foreground">
          Genera reportes detallados y análisis de tu negocio
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {reportes.map((reporte) => {
          const Icon = reporte.icon;
          return (
            <Link
              key={reporte.id}
              href={`/admin/empresas/${id}/reportes/avanzados/${reporte.id}`}
              className="block p-6 bg-white dark:bg-slate-800 rounded-lg border hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start gap-4">
                <div className={`${reporte.color} p-3 rounded-lg text-white`}>
                  <Icon className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">{reporte.nombre}</h3>
                  <p className="text-sm text-muted-foreground">
                    {reporte.descripcion}
                  </p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="mt-8 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
        <div className="flex items-start gap-3">
          <Download className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
          <div>
            <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
              Exportación Disponible
            </h3>
            <p className="text-sm text-blue-700 dark:text-blue-300">
              Todos los reportes pueden ser exportados a Excel, PDF o CSV para análisis externo.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
