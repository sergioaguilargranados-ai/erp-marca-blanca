'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Caja {
  id: string
  nombre: string
  codigo: string | null
  sucursalNombre: string
}

interface Usuario {
  id: string
  nombre: string
}

interface Props {
  empresaId: string
  cajasDisponibles: Caja[]
  usuarios: Usuario[]
  cajaPreseleccionada?: string
}

export function FormularioAperturaTurno({
  empresaId,
  cajasDisponibles,
  usuarios,
  cajaPreseleccionada
}: Props) {
  const router = useRouter()
  const [cajaSeleccionada, setCajaSeleccionada] = useState(cajaPreseleccionada || cajasDisponibles[0]?.id || '')
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(usuarios[0]?.id || '')
  const [tipoTurno, setTipoTurno] = useState<'matutino' | 'vespertino' | 'nocturno'>('matutino')
  const [fondoInicial, setFondoInicial] = useState('')
  const [observaciones, setObservaciones] = useState('')
  const [procesando, setProcesando] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!cajaSeleccionada) {
      alert('Selecciona una caja')
      return
    }

    if (!usuarioSeleccionado) {
      alert('Selecciona un cajero')
      return
    }

    if (!fondoInicial || Number(fondoInicial) < 0) {
      alert('El fondo inicial debe ser un valor válido')
      return
    }

    setProcesando(true)
    try {
      const response = await fetch(`/api/empresas/${empresaId}/turnos/abrir`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cajaId: cajaSeleccionada,
          usuarioId: usuarioSeleccionado,
          tipoTurno,
          fondoInicial: Number(fondoInicial),
          observaciones,
        }),
      })

      const data = await response.json()

      if (data.success) {
        alert('Turno abierto correctamente')
        router.push(`/admin/empresas/${empresaId}/turnos/${data.turnoId}`)
      } else {
        alert(data.error || 'Error al abrir turno')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error al abrir turno')
    } finally {
      setProcesando(false)
    }
  }

  // Obtener hora actual para sugerir tipo de turno
  const horaActual = new Date().getHours()
  const turnoSugerido = horaActual < 14 ? 'matutino' : horaActual < 22 ? 'vespertino' : 'nocturno'

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Caja */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Caja Registradora *
        </label>
        <select
          value={cajaSeleccionada}
          onChange={(e) => setCajaSeleccionada(e.target.value)}
          required
          className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
        >
          <option value="">Seleccionar caja...</option>
          {cajasDisponibles.map((caja) => (
            <option key={caja.id} value={caja.id}>
              {caja.nombre} {caja.codigo && `(${caja.codigo})`} - {caja.sucursalNombre}
            </option>
          ))}
        </select>
        <p className="text-xs text-slate-500 mt-1">
          {cajasDisponibles.length} caja{cajasDisponibles.length !== 1 ? 's' : ''} disponible{cajasDisponibles.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Cajero */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Cajero/Usuario *
        </label>
        <select
          value={usuarioSeleccionado}
          onChange={(e) => setUsuarioSeleccionado(e.target.value)}
          required
          className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
        >
          <option value="">Seleccionar cajero...</option>
          {usuarios.map((usuario) => (
            <option key={usuario.id} value={usuario.id}>
              {usuario.nombre}
            </option>
          ))}
        </select>
      </div>

      {/* Tipo de Turno */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-3">
          Tipo de Turno *
          {tipoTurno !== turnoSugerido && (
            <span className="ml-2 text-xs text-blue-600">
              (Sugerido: {turnoSugerido})
            </span>
          )}
        </label>
        <div className="grid grid-cols-3 gap-3">
          <button
            type="button"
            onClick={() => setTipoTurno('matutino')}
            className={`py-3 px-4 rounded-lg border-2 font-medium transition-colors ${
              tipoTurno === 'matutino'
                ? 'border-green-600 bg-green-50 text-green-900'
                : 'border-slate-300 text-slate-700 hover:border-slate-400'
            }`}
          >
            <div className="text-2xl mb-1">🌅</div>
            Matutino
            <div className="text-xs text-slate-500 mt-1">6:00 - 14:00</div>
          </button>
          <button
            type="button"
            onClick={() => setTipoTurno('vespertino')}
            className={`py-3 px-4 rounded-lg border-2 font-medium transition-colors ${
              tipoTurno === 'vespertino'
                ? 'border-green-600 bg-green-50 text-green-900'
                : 'border-slate-300 text-slate-700 hover:border-slate-400'
            }`}
          >
            <div className="text-2xl mb-1">☀️</div>
            Vespertino
            <div className="text-xs text-slate-500 mt-1">14:00 - 22:00</div>
          </button>
          <button
            type="button"
            onClick={() => setTipoTurno('nocturno')}
            className={`py-3 px-4 rounded-lg border-2 font-medium transition-colors ${
              tipoTurno === 'nocturno'
                ? 'border-green-600 bg-green-50 text-green-900'
                : 'border-slate-300 text-slate-700 hover:border-slate-400'
            }`}
          >
            <div className="text-2xl mb-1">🌙</div>
            Nocturno
            <div className="text-xs text-slate-500 mt-1">22:00 - 6:00</div>
          </button>
        </div>
      </div>

      {/* Fondo Inicial */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Fondo Inicial (Efectivo) *
        </label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">$</span>
          <input
            type="number"
            value={fondoInicial}
            onChange={(e) => setFondoInicial(e.target.value)}
            min="0"
            step="0.01"
            required
            className="w-full pl-8 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="0.00"
          />
        </div>
        <p className="text-xs text-slate-500 mt-1">
          Monto en efectivo con el que inicia la caja
        </p>
      </div>

      {/* Observaciones */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Observaciones de Apertura
        </label>
        <textarea
          value={observaciones}
          onChange={(e) => setObservaciones(e.target.value)}
          rows={3}
          className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          placeholder="Notas adicionales sobre la apertura del turno..."
        />
      </div>

      {/* Resumen */}
      {fondoInicial && Number(fondoInicial) >= 0 && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h3 className="font-semibold text-green-900 mb-2">Resumen de Apertura</h3>
          <div className="space-y-1 text-sm text-green-800">
            <p>
              <strong>Caja:</strong>{' '}
              {cajasDisponibles.find(c => c.id === cajaSeleccionada)?.nombre || 'N/A'}
            </p>
            <p>
              <strong>Cajero:</strong>{' '}
              {usuarios.find(u => u.id === usuarioSeleccionado)?.nombre || 'N/A'}
            </p>
            <p>
              <strong>Turno:</strong> {tipoTurno.charAt(0).toUpperCase() + tipoTurno.slice(1)}
            </p>
            <p>
              <strong>Fondo inicial:</strong> ${Number(fondoInicial).toFixed(2)}
            </p>
            <p className="text-xs text-green-600 mt-2">
              Fecha y hora: {new Date().toLocaleString('es-MX')}
            </p>
          </div>
        </div>
      )}

      {/* Botones */}
      <div className="flex gap-3 pt-4 border-t border-slate-200">
        <button
          type="submit"
          disabled={procesando || !fondoInicial || Number(fondoInicial) < 0}
          className="flex-1 bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {procesando ? 'Abriendo turno...' : '✅ Abrir Turno'}
        </button>
        <a
          href={`/admin/empresas/${empresaId}/turnos`}
          className="flex-1 text-center bg-slate-200 text-slate-700 py-3 rounded-lg font-medium hover:bg-slate-300 transition-colors"
        >
          Cancelar
        </a>
      </div>
    </form>
  )
}
