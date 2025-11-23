import Link from 'next/link';
import { Plus, DollarSign, AlertCircle, Clock, TrendingUp } from 'lucide-react';

export default async function CuentasPagarPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  // Mock data
  const cuentas = [
    {
      id: '1',
      folio: 'CP-001',
      proveedor: 'Distribuidora Nacional S.A.',
      montoTotal: 45000,
      montoPagado: 0,
      saldo: 45000,
      fechaEmision: '2025-11-01',
      fechaVencimiento: '2025-11-30',
      diasVencidos: 0,
      estado: 'pendiente',
    },
    {
      id: '2',
      folio: 'CP-002',
      proveedor: 'Importaciones Globales',
      montoTotal: 32000,
      montoPagado: 20000,
      saldo: 12000,
      fechaEmision: '2025-10-15',
      fechaVencimiento: '2025-11-15',
      diasVencidos: 7,
      estado: 'parcial',
    },
  ];

  const estadisticas = {
    totalPorPagar: cuentas.reduce((acc, c) => acc + c.saldo, 0),
    vencidas: cuentas.filter(c => c.diasVencidos > 0).reduce((acc, c) => acc + c.saldo, 0),
    proximos30Dias: cuentas.filter(c => c.diasVencidos === 0).reduce((acc, c) => acc + c.saldo, 0),
    cuentasVencidas: cuentas.filter(c => c.diasVencidos > 0).length,
  };

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case 'vencida':
        return 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300';
      case 'parcial':
        return 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300';
      case 'pendiente':
        return 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300';
      case 'pagada':
        return 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300';
      default:
        return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">Cuentas por Pagar</h1>
          <p className="text-muted-foreground">
            Gestión de pagos a proveedores
          </p>
        </div>
        <Link
          href={`/admin/empresas/${id}/cuentas-pagar/nueva`}
          className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          Nueva Cuenta
        </Link>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border">
          <div className="flex items-center gap-3">
            <div className="bg-red-100 dark:bg-red-900 p-2 rounded">
              <DollarSign className="h-5 w-5 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total por Pagar</p>
              <p className="text-2xl font-bold text-red-600">${estadisticas.totalPorPagar.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border">
          <div className="flex items-center gap-3">
            <div className="bg-orange-100 dark:bg-orange-900 p-2 rounded">
              <AlertCircle className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Vencidas</p>
              <p className="text-2xl font-bold text-orange-600">${estadisticas.vencidas.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border">
          <div className="flex items-center gap-3">
            <div className="bg-yellow-100 dark:bg-yellow-900 p-2 rounded">
              <Clock className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Próximos 30 días</p>
              <p className="text-2xl font-bold">${estadisticas.proximos30Dias.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border">
          <div className="flex items-center gap-3">
            <div className="bg-purple-100 dark:bg-purple-900 p-2 rounded">
              <TrendingUp className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Cuentas Vencidas</p>
              <p className="text-2xl font-bold">{estadisticas.cuentasVencidas}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border mb-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <select className="px-3 py-2 border rounded-lg">
            <option>Todos los estados</option>
            <option>Pendiente</option>
            <option>Parcial</option>
            <option>Vencida</option>
            <option>Pagada</option>
          </select>
          <select className="px-3 py-2 border rounded-lg">
            <option>Todos los proveedores</option>
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

      {/* Tabla de Cuentas */}
      <div className="bg-white dark:bg-slate-800 rounded-lg border">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 dark:bg-slate-900">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium">Folio</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Proveedor</th>
                <th className="px-4 py-3 text-right text-sm font-medium">Monto Total</th>
                <th className="px-4 py-3 text-right text-sm font-medium">Pagado</th>
                <th className="px-4 py-3 text-right text-sm font-medium">Saldo</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Vencimiento</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Estado</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {cuentas.map((cuenta) => (
                <tr key={cuenta.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/50">
                  <td className="px-4 py-3 font-mono text-sm font-semibold">{cuenta.folio}</td>
                  <td className="px-4 py-3">{cuenta.proveedor}</td>
                  <td className="px-4 py-3 text-right">${cuenta.montoTotal.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right text-green-600">${cuenta.montoPagado.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right font-semibold text-red-600">${cuenta.saldo.toLocaleString()}</td>
                  <td className="px-4 py-3 text-sm">
                    {new Date(cuenta.fechaVencimiento).toLocaleDateString()}
                    {cuenta.diasVencidos > 0 && (
                      <span className="ml-2 text-red-600 font-semibold">
                        ({cuenta.diasVencidos} días vencido)
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-block px-2 py-1 rounded text-xs font-medium capitalize ${getEstadoBadge(cuenta.estado)}`}>
                      {cuenta.estado}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/empresas/${id}/cuentas-pagar/${cuenta.id}`}
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                      Ver / Pagar
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
