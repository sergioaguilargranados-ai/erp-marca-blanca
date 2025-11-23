'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Props {
  empresaId: string
  turnoId: string
  efectivoEsperado: number
  ventasEfectivo: number
  ventasTarjeta: number
  ventasTransferencia: number
  totalVentas: number
  ingresosAdicionales: number
  retiros: number
}

// Denominaciones de billetes y monedas en MXN
const DENOMINACIONES = {
  billetes: [1000, 500, 200, 100, 50, 20],
  monedas: [20, 10, 5, 2, 1, 0.5]
}

export function FormularioCierreTurno({
  empresaId,
  turnoId,
  efectivoEsperado,
  ventasEfectivo,
  ventasTarjeta,
  ventasTransferencia,
  totalVentas,
  ingresosAdicionales,
  retiros
}: Props) {
  const router = useRouter()
  const [denominaciones, setDenominaciones] = useState<Record<string, number>>({})
  const [observaciones, setObservaciones] = useState('')
  const [procesando, setProcesando] = useState(false)

  // Calcular total contado
  const efectivoContado = Object.entries(denominaciones).reduce((total, [denom, cantidad]) => {
    return total + (Number(denom) * cantidad)
  }, 0)

  const diferencia = efectivoContado - efectivoEsperado

  const handleDenominacionChange = (denominacion: number, cantidad: string) => {
    const cantidadNum = Number(cantidad) || 0
    setDenominaciones({
      ...denominaciones,
      [denominacion]: cantidadNum
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (efectivoContado === 0) {
      alert('Debes contar el efectivo en caja')
      return
    }

    const confirmacion = Math.abs(diferencia) > 0
      ? `¿Confirmas el cierre del turno con una diferencia de ${diferencia > 0 ? '+' : ''}$${diferencia.toFixed(2)}?`
      : '¿Confirmas el cierre del turno?'

    if (!confirm(confirmacion)) {
      return
    }

    setProcesando(true)
    try {
      const response = await fetch(`/api/empresas/${empresaId}/turnos/${turnoId}/cerrar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          efectivoContado,
          efectivoEsperado,
          ventasEfectivo,
          ventasTarjeta,
          ventasTransferencia,
          totalVentas,
          ingresosAdicionales,
          retiros,
          diferencia,
          denominaciones: JSON.stringify(denominaciones),
          observaciones,
        }),
      })

      const data = await response.json()

      if (data.success) {
        alert('Turno cerrado correctamente')
        router.push(`/admin/empresas/${empresaId}/turnos/${turnoId}`)
      } else {
        alert(data.error || 'Error al cerrar turno')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error al cerrar turno')
    } finally {
      setProcesando(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Conteo de Billetes */}
      <div>
        <h3 className="text-lg font-semibold text-slate-900 mb-4">💵 Conteo de Billetes</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {DENOMINACIONES.billetes.map((valor) => (
            <div key={valor} className="bg-green-50 border border-green-200 rounded-lg p-4">
              <label className="block text-sm font-medium text-green-900 mb-2">
                ${valor}
              </label>
              <input
                type="number"
                min="0"
                step="1"
                value={denominaciones[valor] || ''}
                onChange={(e) => handleDenominacionChange(valor, e.target.value)}
                className="w-full px-3 py-2 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="0"
              />
              {denominaciones[valor] > 0 && (
                <div className="text-xs text-green-700 mt-1 font-semibold">
                  = ${(valor * denominaciones[valor]).toFixed(2)}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Conteo de Monedas */}
      <div>
        <h3 className="text-lg font-semibold text-slate-900 mb-4">🪙 Conteo de Monedas</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {DENOMINACIONES.monedas.map((valor) => (
            <div key={valor} className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <label className="block text-sm font-medium text-yellow-900 mb-2">
                ${valor}
              </label>
              <input
                type="number"
                min="0"
                step="1"
                value={denominaciones[valor] || ''}
                onChange={(e) => handleDenominacionChange(valor, e.target.value)}
                className="w-full px-3 py-2 border border-yellow-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                placeholder="0"
              />
              {denominaciones[valor] > 0 && (
                <div className="text-xs text-yellow-700 mt-1 font-semibold">
                  = ${(valor * denominaciones[valor]).toFixed(2)}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Resumen de Conteo */}
      <div className={`rounded-lg p-6 border-2 ${
        efectivoContado === 0
          ? 'bg-slate-50 border-slate-200'
          : Math.abs(diferencia) < 0.01
          ? 'bg-green-50 border-green-300'
          : 'bg-yellow-50 border-yellow-300'
      }`}>
        <h3 className="font-semibold text-slate-900 mb-4">📊 Resumen del Cierre</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <dt className="text-xs text-slate-500 uppercase mb-1">Efectivo Esperado</dt>
            <dd className="text-2xl font-bold text-slate-900">
              ${efectivoEsperado.toFixed(2)}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-slate-500 uppercase mb-1">Efectivo Contado</dt>
            <dd className={`text-2xl font-bold ${
              efectivoContado === 0 ? 'text-slate-400' : 'text-blue-600'
            }`}>
              ${efectivoContado.toFixed(2)}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-slate-500 uppercase mb-1">Diferencia</dt>
            <dd className={`text-2xl font-bold ${
              efectivoContado === 0
                ? 'text-slate-400'
                : Math.abs(diferencia) < 0.01
                ? 'text-green-600'
                : diferencia > 0
                ? 'text-green-600'
                : 'text-red-600'
            }`}>
              {efectivoContado > 0 && (diferencia > 0 ? '+' : '')}
              ${diferencia.toFixed(2)}
            </dd>
          </div>
        </div>

        {Math.abs(diferencia) >= 0.01 && efectivoContado > 0 && (
          <div className={`mt-4 p-3 rounded-lg ${
            diferencia > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            <p className="text-sm font-medium">
              {diferencia > 0 ? '✓ Sobrante' : '⚠ Faltante'} de ${Math.abs(diferencia).toFixed(2)}
            </p>
          </div>
        )}

        {Math.abs(diferencia) < 0.01 && efectivoContado > 0 && (
          <div className="mt-4 p-3 bg-green-100 text-green-800 rounded-lg">
            <p className="text-sm font-medium">
              ✓ La caja cuadra perfectamente
            </p>
          </div>
        )}
      </div>

      {/* Observaciones */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Observaciones del Cierre
        </label>
        <textarea
          value={observaciones}
          onChange={(e) => setObservaciones(e.target.value)}
          rows={4}
          className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          placeholder="Notas sobre el cierre, explicación de diferencias, etc..."
        />
      </div>

      {/* Botones */}
      <div className="flex gap-3 pt-4 border-t border-slate-200">
        <button
          type="submit"
          disabled={procesando || efectivoContado === 0}
          className="flex-1 bg-red-600 text-white py-3 rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {procesando ? 'Cerrando turno...' : '🔒 Cerrar Turno'}
        </button>
        <a
          href={`/admin/empresas/${empresaId}/turnos/${turnoId}`}
          className="flex-1 text-center bg-slate-200 text-slate-700 py-3 rounded-lg font-medium hover:bg-slate-300 transition-colors"
        >
          Cancelar
        </a>
      </div>

      {efectivoContado === 0 && (
        <p className="text-sm text-slate-500 text-center">
          Debes contar el efectivo en caja para poder cerrar el turno
        </p>
      )}
    </form>
  )
}
