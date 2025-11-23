"use client"

import { useState, useEffect } from 'react'
import { Bell, Check, CheckCheck, Trash2, Settings, X } from 'lucide-react'

interface Notification {
  id: string
  tipo: string
  titulo: string
  mensaje: string
  prioridad: 'baja' | 'normal' | 'alta' | 'urgente'
  leida: boolean
  createdAt: Date
  accionUrl?: string
  accionTexto?: string
}

export function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [filter, setFilter] = useState<'todas' | 'no-leidas'>('todas')

  // Simular carga de notificaciones
  useEffect(() => {
    // Aquí iría la llamada a la API
    const mockNotifications: Notification[] = [
      {
        id: '1',
        tipo: 'venta',
        titulo: 'Nueva venta registrada',
        mensaje: 'Se ha registrado una venta por $1,500.00',
        prioridad: 'normal',
        leida: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 5), // 5 minutos atrás
        accionUrl: '/admin/empresas/1/ventas/1',
        accionTexto: 'Ver venta'
      },
      {
        id: '2',
        tipo: 'inventario',
        titulo: 'Alerta de stock bajo',
        mensaje: 'El producto "Laptop HP" tiene solo 2 unidades disponibles',
        prioridad: 'alta',
        leida: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 30), // 30 minutos atrás
        accionUrl: '/admin/empresas/1/productos/1',
        accionTexto: 'Ver producto'
      },
      {
        id: '3',
        tipo: 'factura',
        titulo: 'Factura timbrada exitosamente',
        mensaje: 'La factura F-001 ha sido timbrada correctamente',
        prioridad: 'normal',
        leida: true,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 horas atrás
      },
    ]

    setNotifications(mockNotifications)
    setUnreadCount(mockNotifications.filter(n => !n.leida).length)
  }, [])

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n =>
      n.id === id ? { ...n, leida: true } : n
    ))
    setUnreadCount(prev => Math.max(0, prev - 1))
  }

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, leida: true })))
    setUnreadCount(0)
  }

  const deleteNotification = (id: string) => {
    const notification = notifications.find(n => n.id === id)
    if (notification && !notification.leida) {
      setUnreadCount(prev => Math.max(0, prev - 1))
    }
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  const getTimeAgo = (date: Date) => {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000)
    if (seconds < 60) return 'Hace un momento'
    if (seconds < 3600) return `Hace ${Math.floor(seconds / 60)} min`
    if (seconds < 86400) return `Hace ${Math.floor(seconds / 3600)} h`
    return `Hace ${Math.floor(seconds / 86400)} días`
  }

  const getPriorityColor = (prioridad: string) => {
    switch (prioridad) {
      case 'urgente':
        return 'bg-red-100 border-red-200 text-red-900'
      case 'alta':
        return 'bg-orange-100 border-orange-200 text-orange-900'
      case 'baja':
        return 'bg-slate-100 border-slate-200 text-slate-900'
      default:
        return 'bg-blue-100 border-blue-200 text-blue-900'
    }
  }

  const filteredNotifications = filter === 'no-leidas'
    ? notifications.filter(n => !n.leida)
    : notifications

  return (
    <div className="relative">
      {/* Bell Icon Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg hover:bg-slate-100 transition-colors"
      >
        <Bell size={20} className="text-slate-700" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Panel */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-12 w-96 bg-white rounded-lg shadow-2xl border border-slate-200 z-50 max-h-[600px] flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-slate-200">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-slate-900">
                  Notificaciones
                </h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded hover:bg-slate-100"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setFilter('todas')}
                  className={`flex-1 px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                    filter === 'todas'
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  Todas ({notifications.length})
                </button>
                <button
                  onClick={() => setFilter('no-leidas')}
                  className={`flex-1 px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                    filter === 'no-leidas'
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  No leídas ({unreadCount})
                </button>
              </div>
            </div>

            {/* Actions */}
            {notifications.length > 0 && (
              <div className="px-4 py-2 border-b border-slate-200 flex gap-2">
                <button
                  onClick={markAllAsRead}
                  className="flex items-center gap-1 px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded transition-colors"
                >
                  <CheckCheck size={16} />
                  Marcar todas como leídas
                </button>
                <button
                  className="flex items-center gap-1 px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-100 rounded transition-colors ml-auto"
                >
                  <Settings size={16} />
                  Configurar
                </button>
              </div>
            )}

            {/* Notifications List */}
            <div className="flex-1 overflow-y-auto">
              {filteredNotifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-slate-500">
                  <Bell size={48} className="mb-3 opacity-50" />
                  <p className="text-sm">
                    {filter === 'no-leidas'
                      ? 'No tienes notificaciones sin leer'
                      : 'No tienes notificaciones'
                    }
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {filteredNotifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 hover:bg-slate-50 transition-colors ${
                        !notification.leida ? 'bg-blue-50' : ''
                      }`}
                    >
                      <div className="flex gap-3">
                        <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                          notification.leida ? 'bg-slate-300' : 'bg-blue-500'
                        }`} />

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <h4 className="font-semibold text-sm text-slate-900">
                              {notification.titulo}
                            </h4>
                            <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${
                              getPriorityColor(notification.prioridad)
                            }`}>
                              {notification.prioridad}
                            </span>
                          </div>

                          <p className="text-sm text-slate-600 mb-2">
                            {notification.mensaje}
                          </p>

                          <div className="flex items-center gap-2 text-xs text-slate-500">
                            <span>{getTimeAgo(notification.createdAt)}</span>
                          </div>

                          <div className="flex gap-2 mt-3">
                            {notification.accionUrl && (
                              <a
                                href={notification.accionUrl}
                                className="text-xs text-blue-600 hover:underline font-medium"
                              >
                                {notification.accionTexto || 'Ver más'}
                              </a>
                            )}
                            {!notification.leida && (
                              <button
                                onClick={() => markAsRead(notification.id)}
                                className="text-xs text-green-600 hover:underline font-medium flex items-center gap-1"
                              >
                                <Check size={12} />
                                Marcar como leída
                              </button>
                            )}
                            <button
                              onClick={() => deleteNotification(notification.id)}
                              className="text-xs text-red-600 hover:underline font-medium flex items-center gap-1 ml-auto"
                            >
                              <Trash2 size={12} />
                              Eliminar
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-3 border-t border-slate-200 text-center">
              <a
                href="/admin/notificaciones"
                className="text-sm text-blue-600 hover:underline font-medium"
              >
                Ver todas las notificaciones
              </a>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
