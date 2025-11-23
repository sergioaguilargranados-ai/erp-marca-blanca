'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface CancelarVentaProps {
  empresaId: string
  ventaId: string
  folio: string
  usuarioId: string | null
}

export function CancelarVentaButton({ empresaId, ventaId, folio, usuarioId }: CancelarVentaProps) {
  const router = useRouter()
  const [mostrarModal, setMostrarModal] = useState(false)
  const [motivo, setMotivo] = useState('')
  const [cancelando, setCancelando] = useState(false)

  const handleCancelar = async () => {
    if (!usuarioId) {
      alert('No hay usuario disponible para cancelar la venta')
      return
    }

    if (!confirm('¿Estás seguro de cancelar esta venta? Esta acción no se puede deshacer.')) {
      return
    }

    setCancelando(true)
    try {
      const response = await fetch(`/api/empresas/${empresaId}/ventas/${ventaId}/cancelar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          motivo,
          usuarioId,
        }),
      })

      const data = await response.json()

      if (data.success) {
        alert('Venta cancelada correctamente. El inventario ha sido revertido.')
        router.refresh()
        setMostrarModal(false)
      } else {
        alert(data.error || 'Error al cancelar la venta')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error al cancelar la venta')
    } finally {
      setCancelando(false)
    }
  }

  return (
    <>
      <button
        onClick={() => setMostrarModal(true)}
        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
      >
        Cancelar Venta
      </button>

      {mostrarModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">
              Cancelar Venta {folio}
            </h3>

            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Motivo de cancelación (opcional)
              </label>
              <textarea
                value={motivo}
                onChange={(e) => setMotivo(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="Describe el motivo de la cancelación..."
              />
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
              <p className="text-sm text-yellow-800">
                <strong>Advertencia:</strong> Al cancelar esta venta:
              </p>
              <ul className="text-sm text-yellow-700 list-disc list-inside mt-2">
                <li>El inventario será revertido automáticamente</li>
                <li>Se creará un registro de movimiento de inventario</li>
                <li>La venta quedará marcada como cancelada</li>
                <li>Esta acción no se puede deshacer</li>
              </ul>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleCancelar}
                disabled={cancelando}
                className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {cancelando ? 'Cancelando...' : 'Confirmar Cancelación'}
              </button>
              <button
                onClick={() => {
                  setMostrarModal(false)
                  setMotivo('')
                }}
                disabled={cancelando}
                className="flex-1 bg-slate-200 text-slate-700 py-2 rounded-lg hover:bg-slate-300 disabled:opacity-50"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
