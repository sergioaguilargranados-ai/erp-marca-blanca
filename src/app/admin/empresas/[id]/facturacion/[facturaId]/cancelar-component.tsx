'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Props {
  empresaId: string
  facturaId: string
  folio: string
}

export function CancelarFacturaButton({ empresaId, facturaId, folio }: Props) {
  const router = useRouter()
  const [mostrarModal, setMostrarModal] = useState(false)
  const [motivo, setMotivo] = useState('02')
  const [procesando, setProcesando] = useState(false)

  const handleCancelar = async () => {
    if (!confirm(`¿Estás seguro de cancelar la factura ${folio}?\nEsta acción se reportará al SAT.`)) {
      return
    }

    setProcesando(true)
    try {
      const response = await fetch(`/api/empresas/${empresaId}/facturacion/${facturaId}/cancelar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ motivo }),
      })

      const data = await response.json()

      if (data.success) {
        alert('Factura cancelada correctamente')
        setMostrarModal(false)
        router.refresh()
      } else {
        alert(`Error al cancelar: ${data.error}`)
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error al cancelar la factura')
    } finally {
      setProcesando(false)
    }
  }

  return (
    <>
      <button
        onClick={() => setMostrarModal(true)}
        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
      >
        ❌ Cancelar Factura
      </button>

      {mostrarModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">
              Cancelar Factura {folio}
            </h3>

            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Motivo de Cancelación (SAT) *
              </label>
              <select
                value={motivo}
                onChange={(e) => setMotivo(e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="01">01 - Comprobante emitido con errores con relación</option>
                <option value="02">02 - Comprobante emitido con errores sin relación</option>
                <option value="03">03 - No se llevó a cabo la operación</option>
                <option value="04">04 - Operación nominativa relacionada en una factura global</option>
              </select>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-red-800">
                <strong>Advertencia:</strong> La cancelación será reportada al SAT y no se puede deshacer.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleCancelar}
                disabled={procesando}
                className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                {procesando ? 'Cancelando...' : 'Confirmar Cancelación'}
              </button>
              <button
                onClick={() => setMostrarModal(false)}
                disabled={procesando}
                className="flex-1 bg-slate-200 text-slate-700 py-2 rounded-lg hover:bg-slate-300"
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
