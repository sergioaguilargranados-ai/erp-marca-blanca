'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

// Módulos del sistema
const modulos = [
  { id: 'productos', nombre: 'Productos', icon: '📦' },
  { id: 'inventario', nombre: 'Inventario', icon: '📊' },
  { id: 'ventas', nombre: 'Ventas / PDV', icon: '🛒' },
  { id: 'compras', nombre: 'Compras', icon: '🛍️' },
  { id: 'clientes', nombre: 'Clientes', icon: '👥' },
  { id: 'proveedores', nombre: 'Proveedores', icon: '🏭' },
  { id: 'facturacion', nombre: 'Facturación', icon: '🧾' },
  { id: 'reportes', nombre: 'Reportes', icon: '📈' },
  { id: 'configuracion', nombre: 'Configuración', icon: '⚙️' },
  { id: 'usuarios', nombre: 'Usuarios', icon: '👤' },
  { id: 'sucursales', nombre: 'Sucursales', icon: '🏢' },
]

const acciones = [
  { id: 'crear', nombre: 'Crear', icon: '➕' },
  { id: 'leer', nombre: 'Leer', icon: '👁️' },
  { id: 'actualizar', nombre: 'Editar', icon: '✏️' },
  { id: 'eliminar', nombre: 'Eliminar', icon: '🗑️' },
]

export default function NuevoRolPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [nombre, setNombre] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Estado de permisos: { modulo_accion: boolean }
  const [permisos, setPermisos] = useState<Record<string, boolean>>({})

  const togglePermiso = (modulo: string, accion: string) => {
    const key = `${modulo}_${accion}`
    setPermisos(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  const toggleModuloCompleto = (modulo: string, value: boolean) => {
    const newPermisos = { ...permisos }
    acciones.forEach(accion => {
      newPermisos[`${modulo}_${accion.id}`] = value
    })
    setPermisos(newPermisos)
  }

  const toggleAccionCompleta = (accion: string, value: boolean) => {
    const newPermisos = { ...permisos }
    modulos.forEach(modulo => {
      newPermisos[`${modulo.id}_${accion}`] = value
    })
    setPermisos(newPermisos)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Convertir permisos a array
    const permisosArray = Object.entries(permisos)
      .filter(([_, value]) => value)
      .map(([key]) => {
        const [modulo, accion] = key.split('_')
        return { modulo, accion, permitido: true }
      })

    try {
      const response = await fetch(`/api/empresas/${params.id}/roles`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre,
          descripcion,
          permisos: permisosArray,
        }),
      })

      if (!response.ok) {
        throw new Error('Error al crear rol')
      }

      router.push(`/admin/empresas/${params.id}/roles?success=rol-creado`)
    } catch (err) {
      setError('Error al crear el rol. Intenta nuevamente.')
    } finally {
      setLoading(false)
    }
  }

  const permisosSeleccionados = Object.values(permisos).filter(Boolean).length

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Nuevo Rol Personalizado</h1>
            <p className="text-slate-600 mt-1">
              Define permisos específicos para este rol
            </p>
          </div>
          <a
            href={`/admin/empresas/${params.id}/roles`}
            className="text-slate-600 hover:text-slate-900"
          >
            ← Volver
          </a>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Información Básica */}
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-4">
              Información del Rol
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Nombre del Rol *
                </label>
                <input
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Ej: Supervisor de Almacén"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Descripción
                </label>
                <textarea
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Describe las responsabilidades de este rol..."
                />
              </div>
            </div>
          </div>

          {/* Matriz de Permisos */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">
                  Matriz de Permisos
                </h3>
                <p className="text-sm text-slate-600 mt-1">
                  Selecciona los permisos específicos para este rol ({permisosSeleccionados} seleccionados)
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const allTrue: Record<string, boolean> = {}
                    modulos.forEach(m => {
                      acciones.forEach(a => {
                        allTrue[`${m.id}_${a.id}`] = true
                      })
                    })
                    setPermisos(allTrue)
                  }}
                  className="px-3 py-1 text-sm bg-purple-100 text-purple-700 rounded hover:bg-purple-200"
                >
                  Seleccionar Todo
                </button>
                <button
                  type="button"
                  onClick={() => setPermisos({})}
                  className="px-3 py-1 text-sm bg-slate-100 text-slate-700 rounded hover:bg-slate-200"
                >
                  Limpiar Todo
                </button>
              </div>
            </div>

            <div className="overflow-x-auto border border-slate-200 rounded-lg">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="sticky left-0 z-10 bg-slate-50 px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider border-r border-slate-200">
                      Módulo
                    </th>
                    {acciones.map((accion) => (
                      <th key={accion.id} className="px-6 py-3 text-center text-xs font-medium text-slate-500 uppercase tracking-wider">
                        <div className="flex flex-col items-center gap-1">
                          <span>{accion.icon}</span>
                          <span>{accion.nombre}</span>
                          <button
                            type="button"
                            onClick={() => toggleAccionCompleta(accion.id, !Object.values(permisos).some(Boolean))}
                            className="text-xs text-purple-600 hover:text-purple-800"
                          >
                            Todo
                          </button>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                  {modulos.map((modulo) => (
                    <tr key={modulo.id} className="hover:bg-slate-50">
                      <td className="sticky left-0 z-10 bg-white px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 border-r border-slate-200">
                        <div className="flex items-center gap-2">
                          <span>{modulo.icon}</span>
                          <span>{modulo.nombre}</span>
                          <button
                            type="button"
                            onClick={() => {
                              const allSelected = acciones.every(a => permisos[`${modulo.id}_${a.id}`])
                              toggleModuloCompleto(modulo.id, !allSelected)
                            }}
                            className="ml-2 text-xs text-purple-600 hover:text-purple-800"
                          >
                            Todo
                          </button>
                        </div>
                      </td>
                      {acciones.map((accion) => {
                        const key = `${modulo.id}_${accion.id}`
                        const isChecked = permisos[key] || false

                        return (
                          <td key={key} className="px-6 py-4 whitespace-nowrap text-center">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => togglePermiso(modulo.id, accion.id)}
                              className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
                            />
                          </td>
                        )
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Resumen */}
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <p className="text-sm text-purple-800">
              <strong>Permisos seleccionados:</strong> {permisosSeleccionados} de {modulos.length * acciones.length} posibles
            </p>
          </div>

          {/* Botones */}
          <div className="flex gap-3 pt-4 border-t border-slate-200">
            <button
              type="submit"
              disabled={loading || permisosSeleccionados === 0}
              className="flex-1 bg-purple-600 text-white py-3 rounded-lg font-medium hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Creando...' : 'Crear Rol'}
            </button>
            <a
              href={`/admin/empresas/${params.id}/roles`}
              className="flex-1 text-center bg-slate-200 text-slate-700 py-3 rounded-lg font-medium hover:bg-slate-300 transition-colors"
            >
              Cancelar
            </a>
          </div>
        </form>
      </div>
    </div>
  )
}
