import Link from 'next/link';
import { Plus, Tag, TrendingDown, Calendar, Users, Check, X } from 'lucide-react';

export default async function DescuentosPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  // Mock data - en producción vendría de la base de datos
  const descuentos = [
    {
      id: '1',
      codigo: 'VERANO2025',
      nombre: 'Descuento de Verano',
      tipo: 'porcentaje',
      valor: 20,
      activo: true,
      fechaInicio: '2025-06-01',
      fechaFin: '2025-08-31',
      usosActuales: 45,
      usosMaximos: 100,
    },
    {
      id: '2',
      codigo: 'CLIENTE-VIP',
      nombre: 'Descuento Clientes VIP',
      tipo: 'porcentaje',
      valor: 15,
      activo: true,
      fechaInicio: '2025-01-01',
      fechaFin: null,
      usosActuales: 234,
      usosMaximos: null,
    },
    {
      id: '3',
      codigo: 'PRIMERACOMPRA',
      nombre: 'Primera Compra',
      tipo: 'monto_fijo',
      valor: 100,
      activo: true,
      fechaInicio: '2025-01-01',
      fechaFin: null,
      usosActuales: 67,
      usosMaximos: null,
    },
  ];

  const estadisticas = {
    totalDescuentos: descuentos.length,
    activos: descuentos.filter(d => d.activo).length,
    totalUsados: descuentos.reduce((acc, d) => acc + d.usosActuales, 0),
    ahorroClientes: 45678.50,
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">Descuentos y Promociones</h1>
          <p className="text-muted-foreground">
            Gestiona descuentos, cupones y promociones
          </p>
        </div>
        <Link
          href={`/admin/empresas/${id}/descuentos/nuevo`}
          className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          Nuevo Descuento
        </Link>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded">
              <Tag className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Descuentos</p>
              <p className="text-2xl font-bold">{estadisticas.totalDescuentos}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border">
          <div className="flex items-center gap-3">
            <div className="bg-green-100 dark:bg-green-900 p-2 rounded">
              <Check className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Activos</p>
              <p className="text-2xl font-bold">{estadisticas.activos}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border">
          <div className="flex items-center gap-3">
            <div className="bg-purple-100 dark:bg-purple-900 p-2 rounded">
              <Users className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Usos Totales</p>
              <p className="text-2xl font-bold">{estadisticas.totalUsados}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border">
          <div className="flex items-center gap-3">
            <div className="bg-orange-100 dark:bg-orange-900 p-2 rounded">
              <TrendingDown className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Ahorro Clientes</p>
              <p className="text-2xl font-bold">${estadisticas.ahorroClientes.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de Descuentos */}
      <div className="bg-white dark:bg-slate-800 rounded-lg border">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 dark:bg-slate-900">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium">Código</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Nombre</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Tipo</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Valor</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Vigencia</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Usos</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Estado</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {descuentos.map((descuento) => (
                <tr key={descuento.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/50">
                  <td className="px-4 py-3">
                    <span className="font-mono text-sm font-semibold">{descuento.codigo}</span>
                  </td>
                  <td className="px-4 py-3">{descuento.nombre}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded text-xs">
                      {descuento.tipo === 'porcentaje' ? '%' : '$'}
                      {descuento.tipo === 'porcentaje' ? 'Porcentaje' : 'Monto Fijo'}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-semibold">
                    {descuento.tipo === 'porcentaje' ? `${descuento.valor}%` : `$${descuento.valor}`}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {new Date(descuento.fechaInicio).toLocaleDateString()}
                      {descuento.fechaFin && ` - ${new Date(descuento.fechaFin).toLocaleDateString()}`}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm">
                      <span className="font-semibold">{descuento.usosActuales}</span>
                      {descuento.usosMaximos && ` / ${descuento.usosMaximos}`}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {descuento.activo ? (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded text-xs font-medium">
                        <Check className="h-3 w-3" />
                        Activo
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded text-xs font-medium">
                        <X className="h-3 w-3" />
                        Inactivo
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/empresas/${id}/descuentos/${descuento.id}`}
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                      Ver detalles
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
