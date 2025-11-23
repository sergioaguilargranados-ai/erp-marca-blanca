'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Usuario {
  id: string
  nombre: string
}

interface Props {
  empresaId: string
  turnoId: string
  usuarios: Usuario[]
}

export function FormularioMovimientoCaja({ empresaId, turnoId, usuarios }: Props) {
  const router = useRouter()
  const [tipo, setTipo] = useState<'ingreso' | 'retiro'>('ingreso')
  const [monto, setMonto] = useState('')
  const [concepto, setConcepto] = useState('')
  const [observaciones, setObservaciones] = useState('')
  const [requiereAutorizacion, setRequiereAutorizacion] = useState(false)
  const [autorizadoPor, setAutorizadoPor] = useState('')
  const [procesando, setProcesando] = useState(false)

  // Montos que requieren autorización (más de $1000)
  const montoRequiereAutorizacion = Number(monto) > 1000

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!monto || Number(monto) <= 0) {
      alert('El monto debe ser mayor a 0')
      return
    }

    if (!concepto.trim()) {
      alert('El concepto es requerido')
      return
    }

    if (montoRequiereAutorizacion && !autorizadoPor) {
      alert('Se requiere autorización para montos mayores a $1000')
      return
    }

    setProcesando(true)
    try {
      const response = await fetch(`/api/empresas/${empresaId}/turnos/${turnoId}/movimiento`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tipo,
          monto: Number(monto),
          concepto,
          observaciones,
          requiereAutorizacion: montoRequiereAutorizacion ? 'si' : 'no',
          autorizadoPor: autorizadoPor || null,
        }),
      })

      const data = await response.json()

      if (data.success) {
        alert('Movimiento registrado correctamente')
        router.push(`/admin/empresas/${empresaId}/turnos/${turnoId}`)
      } else {
        alert(data.error || 'Error al registrar movimiento')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error al registrar movimiento')
    } finally {
      setProcesando(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Tipo de Movimiento */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-3">
          Tipo de Movimiento *
        </label>
        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => setTipo('ingreso')}
            className={`py-4 px-4 rounded-lg border-2 font-medium transition-colors ${
              tipo === 'ingreso'
                ? 'border-green-600 bg-green-50 text-green-900'
                : 'border-slate-300 text-slate-700 hover:border-slate-400'
            }`}
          >
            <div className="text-3xl mb-2">📥</div>
            <div className="font-semibold">Ingreso</div>
            <div className="text-xs mt-1 text-slate-500">Suma al efectivo</div>
          </button>
          <button
            type="button"
            onClick={() => setTipo('retiro')}
            className={`py-4 px-4 rounded-lg border-2 font-medium transition-colors ${
              tipo === 'retiro'
                ? 'border-red-600 bg-red-50 text-red-900'
                : 'border-slate-300 text-slate-700 hover:border-slate-400'
            }`}
          >
            <div className="text-3xl mb-2">📤</div>
            <div className="font-semibold">Retiro</div>
            <div className="text-xs mt-1 text-slate-500">Resta al efectivo</div>
          </button>
        </div>
      </div>

      {/* Monto */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Monto *
        </label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-lg">$</span>
          <input
            type="number"
            value={monto}
            onChange={(e) => setMonto(e.target.value)}
            min="0.01"
            step="0.01"
            required
            className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg text-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="0.00"
          />
        </div>
        {montoRequiereAutorizacion && (
          <p className="text-sm text-orange-600 mt-2">
            ⚠️ Montos mayores a $1,000 requieren autorización
          </p>
        )}
      </div>

      {/* Concepto */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Concepto *
        </label>
        <select
          value={concepto}
          onChange={(e) => setConcepto(e.target.value)}
          required
          className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Seleccionar concepto...</option>
          {tipo === 'ingreso' ? (
            <>
              <option value="Venta de mostrador">Venta de mostrador</option>
              <option value="Pago de cliente">Pago de cliente</option>
              <option value="Devolución de proveedor">Devolución de proveedor</option>
              <option value="Ajuste de caja">Ajuste de caja</option>
              <option value="Otro ingreso">Otro ingreso</option>
            </>
          ) : (
            <>
              <option value="Pago a proveedor">Pago a proveedor</option>
              <option value="Gastos operativos">Gastos operativos</option>
              <option value="Retiro para banco">Retiro para banco</option>
              <option value="Devolución a cliente">Devolución a cliente</option>
              <option value="Compra de insumos">Compra de insumos</option>
              <option value="Otro retiro">Otro retiro</option>
            </>
          )}
        </select>
      </div>

      {/* Observaciones */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Observaciones y Detalles *
        </label>
        <textarea
          value={observaciones}
          onChange={(e) => setObservaciones(e.target.value)}
          required
          rows={3}
          className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Describe el motivo del movimiento, quién, para qué, etc..."
        />
      </div>

      {/* Autorización (si es necesaria) */}
      {montoRequiereAutorizacion && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <h3 className="font-semibold text-orange-900 mb-3">🔐 Autorización Requerida</h3>
          <div>
            <label className="block text-sm font-medium text-orange-900 mb-2">
              Autorizado por *
            </label>
            <select
              value={autorizadoPor}
              onChange={(e) => setAutorizadoPor(e.target.value)}
              required={montoRequiereAutorizacion}
              className="w-full px-4 py-3 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="">Seleccionar supervisor...</option>
              {usuarios.map((usuario) => (
                <option key={usuario.id} value={usuario.id}>
                  {usuario.nombre}
                </option>
              ))}
            </select>
            <p className="text-xs text-orange-700 mt-2">
              Selecciona al supervisor que autoriza este {tipo}
            </p>
          </div>
        </div>
      )}

      {/* Resumen */}
      {monto && Number(monto) > 0 && (
        <div className={`rounded-lg p-4 border-2 ${
          tipo === 'ingreso'
            ? 'bg-green-50 border-green-300'
            : 'bg-red-50 border-red-300'
        }`}>
          <h3 className={`font-semibold mb-2 ${
            tipo === 'ingreso' ? 'text-green-900' : 'text-red-900'
          }`}>
            Resumen del Movimiento
          </h3>
          <div className={`space-y-1 text-sm ${
            tipo === 'ingreso' ? 'text-green-800' : 'text-red-800'
          }`}>
            <p><strong>Tipo:</strong> {tipo === 'ingreso' ? 'Ingreso' : 'Retiro'}</p>
            <p><strong>Monto:</strong> ${Number(monto).toFixed(2)}</p>
            <p><strong>Concepto:</strong> {concepto || 'No seleccionado'}</p>
            {montoRequiereAutorizacion && (
              <p className="text-orange-700">
                <strong>Requiere autorización</strong>
              </p>
            )}
          </div>
        </div>
      )}

      {/* Botones */}
      <div className="flex gap-3 pt-4 border-t border-slate-200">
        <button
          type="submit"
          disabled={procesando || !monto || Number(monto) <= 0 || (montoRequiereAutorizacion && !autorizadoPor)}
          className={`flex-1 py-3 rounded-lg font-medium text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
            tipo === 'ingreso'
              ? 'bg-green-600 hover:bg-green-700'
              : 'bg-red-600 hover:bg-red-700'
          }`}
        >
          {procesando ? 'Registrando...' : `💵 Registrar ${tipo === 'ingreso' ? 'Ingreso' : 'Retiro'}`}
        </button>
        <a
          href={`/admin/empresas/${empresaId}/turnos/${turnoId}`}
          className="flex-1 text-center bg-slate-200 text-slate-700 py-3 rounded-lg font-medium hover:bg-slate-300 transition-colors"
        >
          Cancelar
        </a>
      </div>
    </form>
  )
}
