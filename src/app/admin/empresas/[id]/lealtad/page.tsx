import Link from 'next/link';
import { Gift, Star, TrendingUp, Users, Award, Settings } from 'lucide-react';

export default async function ProgramaLealtadPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  // Mock data
  const programaActivo = {
    nombre: 'Programa de Lealtad Gold',
    puntosXPeso: 1,
    pesoXPunto: 1,
    puntosMinimoCanje: 100,
    activo: true,
  };

  const estadisticas = {
    clientesInscritos: 1245,
    puntosOtorgados: 125000,
    puntosCanjeados: 45000,
    puntosDisponibles: 80000,
  };

  const niveles = [
    {
      nombre: 'Bronce',
      puntosRequeridos: 0,
      descuento: 5,
      clientes: 800,
      color: 'bg-orange-500',
    },
    {
      nombre: 'Plata',
      puntosRequeridos: 1000,
      descuento: 10,
      clientes: 325,
      color: 'bg-slate-400',
    },
    {
      nombre: 'Oro',
      puntosRequeridos: 5000,
      descuento: 15,
      clientes: 95,
      color: 'bg-yellow-500',
    },
    {
      nombre: 'Platino',
      puntosRequeridos: 10000,
      descuento: 20,
      clientes: 25,
      color: 'bg-purple-500',
    },
  ];

  const clientesTop = [
    {
      id: '1',
      nombre: 'Juan Pérez García',
      puntosDisponibles: 15420,
      puntosAcumulados: 28500,
      nivel: 'Platino',
      ultimaCompra: '2025-11-18',
    },
    {
      id: '2',
      nombre: 'María López Sánchez',
      puntosDisponibles: 12300,
      puntosAcumulados: 18900,
      nivel: 'Oro',
      ultimaCompra: '2025-11-20',
    },
    {
      id: '3',
      nombre: 'Carlos Rodríguez',
      puntosDisponibles: 8500,
      puntosAcumulados: 12400,
      nivel: 'Oro',
      ultimaCompra: '2025-11-19',
    },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">Programa de Lealtad</h1>
          <p className="text-muted-foreground">
            Recompensa a tus clientes más fieles con puntos y beneficios
          </p>
        </div>
        <Link
          href={`/admin/empresas/${id}/lealtad/configurar`}
          className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <Settings className="h-4 w-4" />
          Configurar Programa
        </Link>
      </div>

      {/* Estado del Programa */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-6 rounded-lg shadow-lg mb-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Award className="h-6 w-6" />
              <span className="text-sm font-medium opacity-90">Programa Activo</span>
            </div>
            <h2 className="text-2xl font-bold mb-1">{programaActivo.nombre}</h2>
            <p className="opacity-90">
              {programaActivo.puntosXPeso} punto por cada ${programaActivo.pesoXPunto} gastado
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm opacity-90 mb-1">Canje mínimo</p>
            <p className="text-3xl font-bold">{programaActivo.puntosMinimoCanje} pts</p>
          </div>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded">
              <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Clientes Inscritos</p>
              <p className="text-2xl font-bold">{estadisticas.clientesInscritos.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border">
          <div className="flex items-center gap-3">
            <div className="bg-green-100 dark:bg-green-900 p-2 rounded">
              <Star className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Puntos Otorgados</p>
              <p className="text-2xl font-bold">{estadisticas.puntosOtorgados.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border">
          <div className="flex items-center gap-3">
            <div className="bg-orange-100 dark:bg-orange-900 p-2 rounded">
              <Gift className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Puntos Canjeados</p>
              <p className="text-2xl font-bold">{estadisticas.puntosCanjeados.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border">
          <div className="flex items-center gap-3">
            <div className="bg-purple-100 dark:bg-purple-900 p-2 rounded">
              <TrendingUp className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Puntos Disponibles</p>
              <p className="text-2xl font-bold">{estadisticas.puntosDisponibles.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Niveles del Programa */}
      <div className="bg-white dark:bg-slate-800 rounded-lg border mb-6">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">Niveles del Programa</h2>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {niveles.map((nivel) => (
              <div key={nivel.nombre} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className={`${nivel.color} w-12 h-12 rounded-full flex items-center justify-center text-white mb-3`}>
                  <Award className="h-6 w-6" />
                </div>
                <h3 className="font-bold text-lg mb-1">{nivel.nombre}</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  Desde {nivel.puntosRequeridos.toLocaleString()} puntos
                </p>
                <div className="flex items-center gap-2 mb-2">
                  <div className="bg-green-100 dark:bg-green-900 px-2 py-1 rounded text-sm font-semibold text-green-700 dark:text-green-300">
                    {nivel.descuento}% descuento
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  {nivel.clientes} clientes en este nivel
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Clientes */}
      <div className="bg-white dark:bg-slate-800 rounded-lg border">
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="text-lg font-semibold">Top Clientes por Puntos</h2>
          <Link
            href={`/admin/empresas/${id}/lealtad/clientes`}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            Ver todos
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 dark:bg-slate-900">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium">Cliente</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Nivel</th>
                <th className="px-4 py-3 text-right text-sm font-medium">Puntos Disponibles</th>
                <th className="px-4 py-3 text-right text-sm font-medium">Total Acumulado</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Última Compra</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {clientesTop.map((cliente) => (
                <tr key={cliente.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/50">
                  <td className="px-4 py-3 font-medium">{cliente.nombre}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded text-xs font-medium">
                      <Award className="h-3 w-3" />
                      {cliente.nivel}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right font-bold text-green-600">
                    {cliente.puntosDisponibles.toLocaleString()} pts
                  </td>
                  <td className="px-4 py-3 text-right">
                    {cliente.puntosAcumulados.toLocaleString()} pts
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {new Date(cliente.ultimaCompra).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/empresas/${id}/lealtad/clientes/${cliente.id}`}
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                      Ver historial
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
