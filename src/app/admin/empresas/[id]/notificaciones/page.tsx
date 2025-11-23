import Link from 'next/link';
import { Bell, Mail, AlertCircle, CheckCircle, Info, Settings, Archive } from 'lucide-react';

export default async function NotificacionesPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  // Mock data
  const notificaciones = [
    {
      id: '1',
      tipo: 'alerta',
      titulo: 'Stock Bajo: Producto X',
      mensaje: 'El producto "Laptop HP 15" tiene solo 5 unidades en stock',
      leida: false,
      fecha: '2025-11-22T10:30:00',
      categoria: 'inventario',
    },
    {
      id: '2',
      tipo: 'info',
      titulo: 'Nueva Venta Registrada',
      mensaje: 'Venta #1234 por $5,450.00 registrada en Sucursal Centro',
      leida: false,
      fecha: '2025-11-22T09:15:00',
      categoria: 'ventas',
    },
    {
      id: '3',
      tipo: 'exito',
      titulo: 'Factura Timbrada Exitosamente',
      mensaje: 'La factura #F-890 ha sido timbrada correctamente',
      leida: true,
      fecha: '2025-11-21T16:45:00',
      categoria: 'facturacion',
    },
    {
      id: '4',
      tipo: 'alerta',
      titulo: 'Cuenta por Cobrar Vencida',
      mensaje: 'La cuenta CC-001 de Comercializadora ABC está vencida',
      leida: false,
      fecha: '2025-11-21T08:00:00',
      categoria: 'cobranza',
    },
  ];

  const estadisticas = {
    total: notificaciones.length,
    noLeidas: notificaciones.filter(n => !n.leida).length,
    alertas: notificaciones.filter(n => n.tipo === 'alerta').length,
    hoy: notificaciones.filter(n => {
      const fecha = new Date(n.fecha);
      const hoy = new Date();
      return fecha.toDateString() === hoy.toDateString();
    }).length,
  };

  const getIcono = (tipo: string) => {
    switch (tipo) {
      case 'alerta':
        return AlertCircle;
      case 'exito':
        return CheckCircle;
      case 'info':
        return Info;
      default:
        return Bell;
    }
  };

  const getColorTipo = (tipo: string) => {
    switch (tipo) {
      case 'alerta':
        return 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300';
      case 'exito':
        return 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300';
      case 'info':
        return 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300';
      default:
        return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">Centro de Notificaciones</h1>
          <p className="text-muted-foreground">
            Gestiona alertas, recordatorios y actualizaciones del sistema
          </p>
        </div>
        <Link
          href={`/admin/empresas/${id}/notificaciones/configuracion`}
          className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <Settings className="h-4 w-4" />
          Configurar Notificaciones
        </Link>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded">
              <Bell className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Notificaciones</p>
              <p className="text-2xl font-bold">{estadisticas.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border">
          <div className="flex items-center gap-3">
            <div className="bg-orange-100 dark:bg-orange-900 p-2 rounded">
              <Mail className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">No Leídas</p>
              <p className="text-2xl font-bold text-orange-600">{estadisticas.noLeidas}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border">
          <div className="flex items-center gap-3">
            <div className="bg-red-100 dark:bg-red-900 p-2 rounded">
              <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Alertas</p>
              <p className="text-2xl font-bold text-red-600">{estadisticas.alertas}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border">
          <div className="flex items-center gap-3">
            <div className="bg-green-100 dark:bg-green-900 p-2 rounded">
              <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Hoy</p>
              <p className="text-2xl font-bold">{estadisticas.hoy}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border mb-4">
        <div className="flex flex-wrap gap-2">
          <button className="px-4 py-2 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-lg text-sm font-medium">
            Todas
          </button>
          <button className="px-4 py-2 bg-slate-100 dark:bg-slate-700 rounded-lg text-sm hover:bg-slate-200 dark:hover:bg-slate-600">
            No Leídas
          </button>
          <button className="px-4 py-2 bg-slate-100 dark:bg-slate-700 rounded-lg text-sm hover:bg-slate-200 dark:hover:bg-slate-600">
            Alertas
          </button>
          <button className="px-4 py-2 bg-slate-100 dark:bg-slate-700 rounded-lg text-sm hover:bg-slate-200 dark:hover:bg-slate-600">
            Inventario
          </button>
          <button className="px-4 py-2 bg-slate-100 dark:bg-slate-700 rounded-lg text-sm hover:bg-slate-200 dark:hover:bg-slate-600">
            Ventas
          </button>
          <button className="px-4 py-2 bg-slate-100 dark:bg-slate-700 rounded-lg text-sm hover:bg-slate-200 dark:hover:bg-slate-600">
            Facturación
          </button>
          <button className="px-4 py-2 bg-slate-100 dark:bg-slate-700 rounded-lg text-sm hover:bg-slate-200 dark:hover:bg-slate-600">
            Cobranza
          </button>
        </div>
      </div>

      {/* Lista de Notificaciones */}
      <div className="bg-white dark:bg-slate-800 rounded-lg border">
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="text-lg font-semibold">Notificaciones Recientes</h2>
          <button className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium">
            <Archive className="h-4 w-4" />
            Archivar todo
          </button>
        </div>
        <div className="divide-y">
          {notificaciones.map((notificacion) => {
            const Icono = getIcono(notificacion.tipo);
            const colorTipo = getColorTipo(notificacion.tipo);

            return (
              <div
                key={notificacion.id}
                className={`p-4 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors ${
                  !notificacion.leida ? 'bg-blue-50 dark:bg-blue-900/10' : ''
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`${colorTipo} p-2 rounded-lg`}>
                    <Icono className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-1">
                      <h3 className="font-semibold">
                        {notificacion.titulo}
                        {!notificacion.leida && (
                          <span className="ml-2 inline-block w-2 h-2 bg-blue-600 rounded-full"></span>
                        )}
                      </h3>
                      <span className="text-sm text-muted-foreground">
                        {new Date(notificacion.fecha).toLocaleString('es-MX', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {notificacion.mensaje}
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="text-xs px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded capitalize">
                        {notificacion.categoria}
                      </span>
                      {!notificacion.leida && (
                        <button className="text-xs text-blue-600 hover:text-blue-700 font-medium">
                          Marcar como leída
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Configuración de Emails */}
      <div className="mt-6 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
        <div className="flex items-start gap-3">
          <Mail className="h-5 w-5 text-purple-600 dark:text-purple-400 mt-0.5" />
          <div>
            <h3 className="font-semibold text-purple-900 dark:text-purple-100 mb-2">
              Notificaciones por Email
            </h3>
            <p className="text-sm text-purple-700 dark:text-purple-300 mb-3">
              Configura qué notificaciones quieres recibir por email y con qué frecuencia.
            </p>
            <Link
              href={`/admin/empresas/${id}/notificaciones/email`}
              className="inline-flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 text-sm"
            >
              Configurar Emails
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
