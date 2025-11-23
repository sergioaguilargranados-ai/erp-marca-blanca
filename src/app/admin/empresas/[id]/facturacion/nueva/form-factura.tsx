'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Cliente {
  id: string
  nombre: string
  razonSocial: string
  rfc: string
  regimenFiscal: string
  usoCfdi: string
  codigoPostal: string
}

interface VentaDisponible {
  id: string
  folio: string
  fecha: Date
  cliente: string
  total: number
}

interface Props {
  empresaId: string
  config: {
    rfc: string
    razonSocial: string
    regimenFiscal: string
    codigoPostal: string
    serie: string
    folioActual: string
  }
  clientes: Cliente[]
  ventaPreseleccionada?: {
    id: string
    folio: string
    total: number
    subtotal: number
    iva: number
    metodoPago: string
    clienteId: string | null
  }
  ventasDisponibles: VentaDisponible[]
}

interface Concepto {
  id: string
  claveProdServ: string
  cantidad: number
  claveUnidad: string
  unidad: string
  descripcion: string
  valorUnitario: number
  descuento: number
  aplicaIVA: boolean
  tasaIVA: number
}

export function FormularioNuevaFactura({
  empresaId,
  config,
  clientes,
  ventaPreseleccionada,
  ventasDisponibles
}: Props) {
  const router = useRouter()
  const [clienteSeleccionado, setClienteSeleccionado] = useState<string>(
    ventaPreseleccionada?.clienteId || clientes[0]?.id || ''
  )
  const [formaPago, setFormaPago] = useState<string>('01') // 01-Efectivo
  const [metodoPago, setMetodoPago] = useState<string>('PUE') // PUE-Pago en una exhibición
  const [conceptos, setConceptos] = useState<Concepto[]>([])
  const [observaciones, setObservaciones] = useState('')
  const [procesando, setProcesando] = useState(false)

  const cliente = clientes.find(c => c.id === clienteSeleccionado)

  // Calcular totales
  const subtotal = conceptos.reduce((sum, c) => {
    const importe = c.cantidad * c.valorUnitario - c.descuento
    return sum + importe
  }, 0)

  const totalIVA = conceptos.reduce((sum, c) => {
    if (!c.aplicaIVA) return sum
    const base = c.cantidad * c.valorUnitario - c.descuento
    const iva = base * c.tasaIVA
    return sum + iva
  }, 0)

  const total = subtotal + totalIVA

  const agregarConcepto = () => {
    setConceptos([
      ...conceptos,
      {
        id: Math.random().toString(),
        claveProdServ: '01010101', // Producto genérico
        cantidad: 1,
        claveUnidad: 'H87', // Pieza
        unidad: 'Pieza',
        descripcion: '',
        valorUnitario: 0,
        descuento: 0,
        aplicaIVA: true,
        tasaIVA: 0.16,
      }
    ])
  }

  const actualizarConcepto = (id: string, campo: string, valor: any) => {
    setConceptos(conceptos.map(c =>
      c.id === id ? { ...c, [campo]: valor } : c
    ))
  }

  const eliminarConcepto = (id: string) => {
    setConceptos(conceptos.filter(c => c.id !== id))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!clienteSeleccionado) {
      alert('Selecciona un cliente')
      return
    }

    if (conceptos.length === 0) {
      alert('Agrega al menos un concepto')
      return
    }

    if (!confirm('¿Confirmas la generación de esta factura?')) {
      return
    }

    setProcesando(true)
    try {
      const response = await fetch(`/api/empresas/${empresaId}/facturacion/generar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clienteId: clienteSeleccionado,
          formaPago,
          metodoPago,
          conceptos: conceptos.map(c => ({
            claveProdServ: c.claveProdServ,
            cantidad: c.cantidad,
            claveUnidad: c.claveUnidad,
            unidad: c.unidad,
            descripcion: c.descripcion,
            valorUnitario: c.valorUnitario,
            descuento: c.descuento,
            aplicaIVA: c.aplicaIVA,
            tasaIVA: c.tasaIVA,
          })),
          observaciones,
          ventaId: ventaPreseleccionada?.id,
        }),
      })

      const data = await response.json()

      if (data.success) {
        alert('Factura generada correctamente')
        router.push(`/admin/empresas/${empresaId}/facturacion/${data.facturaId}`)
      } else {
        alert(data.error || 'Error al generar factura')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error al generar factura')
    } finally {
      setProcesando(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Selección de Cliente */}
      <div>
        <h3 className="text-lg font-semibold text-slate-900 mb-4">👤 Receptor (Cliente)</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Cliente *
            </label>
            <select
              value={clienteSeleccionado}
              onChange={(e) => setClienteSeleccionado(e.target.value)}
              required
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Seleccionar cliente...</option>
              {clientes.map(c => (
                <option key={c.id} value={c.id}>
                  {c.razonSocial} - {c.rfc}
                </option>
              ))}
            </select>
          </div>

          {cliente && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-blue-700">RFC:</span>
                  <span className="ml-2 font-mono font-semibold text-blue-900">{cliente.rfc}</span>
                </div>
                <div>
                  <span className="text-blue-700">Régimen:</span>
                  <span className="ml-2 font-semibold text-blue-900">{cliente.regimenFiscal}</span>
                </div>
                <div>
                  <span className="text-blue-700">Uso CFDI:</span>
                  <span className="ml-2 font-semibold text-blue-900">{cliente.usoCfdi}</span>
                </div>
                <div>
                  <span className="text-blue-700">CP Fiscal:</span>
                  <span className="ml-2 font-semibold text-blue-900">{cliente.codigoPostal}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Datos de la Factura */}
      <div>
        <h3 className="text-lg font-semibold text-slate-900 mb-4">📄 Datos de la Factura</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Serie
            </label>
            <input
              type="text"
              value={config.serie}
              disabled
              className="w-full px-4 py-3 border border-slate-300 rounded-lg bg-slate-50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Folio
            </label>
            <input
              type="text"
              value={config.folioActual}
              disabled
              className="w-full px-4 py-3 border border-slate-300 rounded-lg bg-slate-50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Moneda
            </label>
            <select
              disabled
              className="w-full px-4 py-3 border border-slate-300 rounded-lg bg-slate-50"
            >
              <option value="MXN">MXN - Peso Mexicano</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Forma de Pago *
            </label>
            <select
              value={formaPago}
              onChange={(e) => setFormaPago(e.target.value)}
              required
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="01">01 - Efectivo</option>
              <option value="03">03 - Transferencia electrónica</option>
              <option value="04">04 - Tarjeta de crédito</option>
              <option value="28">28 - Tarjeta de débito</option>
              <option value="99">99 - Por definir</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Método de Pago *
            </label>
            <select
              value={metodoPago}
              onChange={(e) => setMetodoPago(e.target.value)}
              required
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="PUE">PUE - Pago en una sola exhibición</option>
              <option value="PPD">PPD - Pago en parcialidades o diferido</option>
            </select>
          </div>
        </div>
      </div>

      {/* Conceptos */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-slate-900">📝 Conceptos</h3>
          <button
            type="button"
            onClick={agregarConcepto}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            + Agregar Concepto
          </button>
        </div>

        {conceptos.length === 0 && (
          <div className="text-center py-8 bg-slate-50 rounded-lg border-2 border-dashed border-slate-300">
            <p className="text-slate-500 mb-2">No hay conceptos agregados</p>
            <button
              type="button"
              onClick={agregarConcepto}
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              Agregar primer concepto
            </button>
          </div>
        )}

        <div className="space-y-4">
          {conceptos.map((concepto, index) => (
            <div key={concepto.id} className="bg-slate-50 border border-slate-200 rounded-lg p-4">
              <div className="flex justify-between items-start mb-3">
                <h4 className="font-medium text-slate-900">Concepto {index + 1}</h4>
                <button
                  type="button"
                  onClick={() => eliminarConcepto(concepto.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  ✕ Eliminar
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Clave Prod/Serv SAT *
                  </label>
                  <input
                    type="text"
                    value={concepto.claveProdServ}
                    onChange={(e) => actualizarConcepto(concepto.id, 'claveProdServ', e.target.value)}
                    required
                    maxLength={10}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                    placeholder="01010101"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Clave Unidad SAT *
                  </label>
                  <input
                    type="text"
                    value={concepto.claveUnidad}
                    onChange={(e) => actualizarConcepto(concepto.id, 'claveUnidad', e.target.value)}
                    required
                    maxLength={10}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                    placeholder="H87"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Descripción *
                  </label>
                  <textarea
                    value={concepto.descripcion}
                    onChange={(e) => actualizarConcepto(concepto.id, 'descripcion', e.target.value)}
                    required
                    rows={2}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                    placeholder="Descripción del producto o servicio"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Cantidad *
                  </label>
                  <input
                    type="number"
                    value={concepto.cantidad}
                    onChange={(e) => actualizarConcepto(concepto.id, 'cantidad', Number(e.target.value))}
                    required
                    min="0.01"
                    step="0.01"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Valor Unitario *
                  </label>
                  <input
                    type="number"
                    value={concepto.valorUnitario}
                    onChange={(e) => actualizarConcepto(concepto.id, 'valorUnitario', Number(e.target.value))}
                    required
                    min="0"
                    step="0.01"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Descuento
                  </label>
                  <input
                    type="number"
                    value={concepto.descuento}
                    onChange={(e) => actualizarConcepto(concepto.id, 'descuento', Number(e.target.value))}
                    min="0"
                    step="0.01"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                  />
                </div>

                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={concepto.aplicaIVA}
                      onChange={(e) => actualizarConcepto(concepto.id, 'aplicaIVA', e.target.checked)}
                      className="w-4 h-4 text-blue-600 rounded"
                    />
                    <span className="text-sm font-medium text-slate-700">Aplica IVA</span>
                  </label>
                  {concepto.aplicaIVA && (
                    <select
                      value={concepto.tasaIVA}
                      onChange={(e) => actualizarConcepto(concepto.id, 'tasaIVA', Number(e.target.value))}
                      className="px-3 py-1 border border-slate-300 rounded-lg text-sm"
                    >
                      <option value={0.16}>16%</option>
                      <option value={0.08}>8%</option>
                      <option value={0}>0%</option>
                    </select>
                  )}
                </div>
              </div>

              <div className="mt-2 text-right text-sm font-semibold text-slate-900">
                Importe: ${((concepto.cantidad * concepto.valorUnitario - concepto.descuento) * (1 + (concepto.aplicaIVA ? concepto.tasaIVA : 0))).toFixed(2)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Observaciones */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Observaciones
        </label>
        <textarea
          value={observaciones}
          onChange={(e) => setObservaciones(e.target.value)}
          rows={3}
          className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Observaciones adicionales de la factura..."
        />
      </div>

      {/* Totales */}
      {conceptos.length > 0 && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <h3 className="font-semibold text-green-900 mb-4">💰 Totales</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-green-800">
              <span>Subtotal:</span>
              <span className="font-semibold">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-green-800">
              <span>IVA:</span>
              <span className="font-semibold">${totalIVA.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-2xl font-bold text-green-900 pt-2 border-t border-green-300">
              <span>Total:</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      )}

      {/* Botones */}
      <div className="flex gap-3 pt-4 border-t border-slate-200">
        <button
          type="submit"
          disabled={procesando || conceptos.length === 0 || !clienteSeleccionado}
          className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {procesando ? 'Generando factura...' : '🧾 Generar Factura'}
        </button>
        <a
          href={`/admin/empresas/${empresaId}/facturacion`}
          className="flex-1 text-center bg-slate-200 text-slate-700 py-3 rounded-lg font-medium hover:bg-slate-300 transition-colors"
        >
          Cancelar
        </a>
      </div>
    </form>
  )
}
