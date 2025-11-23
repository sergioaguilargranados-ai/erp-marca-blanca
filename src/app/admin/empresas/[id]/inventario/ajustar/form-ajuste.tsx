'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Sucursal {
  id: string
  nombre: string
}

interface Producto {
  id: string
  nombre: string
  codigoBarras: string | null
  sku: string | null
  stockActual: number
  stockDisponible: number
  unidadMedida: string
}

export function FormularioAjusteInventario({
  empresaId,
  sucursales,
}: {
  empresaId: string
  sucursales: Sucursal[]
}) {
  const router = useRouter()
  const [sucursalSeleccionada, setSucursalSeleccionada] = useState(sucursales[0]?.id || '')
  const [tipoMovimiento, setTipoMovimiento] = useState<'entrada' | 'salida'>('entrada')
  const [busqueda, setBusqueda] = useState('')
  const [productoSeleccionado, setProductoSeleccionado] = useState<Producto | null>(null)
  const [cantidad, setCantidad] = useState('')
  const [motivo, setMotivo] = useState('')
  const [observaciones, setObservaciones] = useState('')
  const [buscando, setBuscando] = useState(false)
  const [procesando, setProcesando] = useState(false)

  const buscarProducto = async () => {
    if (!busqueda.trim() || !sucursalSeleccionada) return

    setBuscando(true)
    try {
      const response = await fetch(
        `/api/empresas/${empresaId}/productos/buscar?q=${encodeURIComponent(busqueda)}&sucursalId=${sucursalSeleccionada}`
      )
      const data = await response.json()

      if (data.producto) {
        setProductoSeleccionado({
          id: data.producto.id,
          nombre: data.producto.nombre,
          codigoBarras: data.producto.codigoBarras,
          sku: data.producto.sku,
          stockActual: data.producto.stockDisponible || 0,
          stockDisponible: data.producto.stockDisponible || 0,
          unidadMedida: data.producto.unidadMedida,
        })
      } else {
        alert('Producto no encontrado')
        setProductoSeleccionado(null)
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error al buscar producto')
    } finally {
      setBuscando(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!productoSeleccionado) {
      alert('Selecciona un producto')
      return
    }

    if (!cantidad || Number(cantidad) <= 0) {
      alert('La cantidad debe ser mayor a 0')
      return
    }

    if (!motivo) {
      alert('Selecciona un motivo')
      return
    }

    setProcesando(true)
    try {
      const response = await fetch(`/api/empresas/${empresaId}/inventario/ajustar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productoId: productoSeleccionado.id,
          sucursalId: sucursalSeleccionada,
          tipo: tipoMovimiento,
          cantidad: Number(cantidad),
          motivo,
          observaciones,
        }),
      })

      const data = await response.json()

      if (data.success) {
        alert('Inventario ajustado correctamente')
        router.push(`/admin/empresas/${empresaId}/inventario?sucursal=${sucursalSeleccionada}`)
      } else {
        alert(data.error || 'Error al ajustar inventario')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error al ajustar inventario')
    } finally {
      setProcesando(false)
    }
  }

  const stockFinal =
    productoSeleccionado && cantidad
      ? tipoMovimiento === 'entrada'
        ? productoSeleccionado.stockActual + Number(cantidad)
        : productoSeleccionado.stockActual - Number(cantidad)
      : 0

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Tipo de movimiento */}
      <div>
        <label className="text-sm font-medium text-slate-700 block mb-3">
          Tipo de Movimiento
        </label>
        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => setTipoMovimiento('entrada')}
            className={`py-3 px-4 rounded-lg border-2 font-medium transition-colors ${
              tipoMovimiento === 'entrada'
                ? 'border-green-600 bg-green-50 text-green-900'
                : 'border-slate-300 text-slate-700 hover:border-slate-400'
            }`}
          >
            <div className="text-2xl mb-1">📥</div>
            Entrada de Stock
          </button>
          <button
            type="button"
            onClick={() => setTipoMovimiento('salida')}
            className={`py-3 px-4 rounded-lg border-2 font-medium transition-colors ${
              tipoMovimiento === 'salida'
                ? 'border-red-600 bg-red-50 text-red-900'
                : 'border-slate-300 text-slate-700 hover:border-slate-400'
            }`}
          >
            <div className="text-2xl mb-1">📤</div>
            Salida de Stock
          </button>
        </div>
      </div>

      {/* Sucursal */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">Sucursal *</label>
        <select
          value={sucursalSeleccionada}
          onChange={(e) => {
            setSucursalSeleccionada(e.target.value)
            setProductoSeleccionado(null)
          }}
          required
          className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          {sucursales.map((s) => (
            <option key={s.id} value={s.id}>
              {s.nombre}
            </option>
          ))}
        </select>
      </div>

      {/* Buscar producto */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Buscar Producto *
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                buscarProducto()
              }
            }}
            placeholder="Código de barras, SKU o nombre..."
            className="flex-1 px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            type="button"
            onClick={buscarProducto}
            disabled={buscando || !busqueda.trim()}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {buscando ? 'Buscando...' : 'Buscar'}
          </button>
        </div>
      </div>

      {/* Producto seleccionado */}
      {productoSeleccionado && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-2">Producto Seleccionado</h3>
          <div className="space-y-1 text-sm text-blue-800">
            <p>
              <strong>Nombre:</strong> {productoSeleccionado.nombre}
            </p>
            {productoSeleccionado.codigoBarras && (
              <p>
                <strong>Código de barras:</strong> {productoSeleccionado.codigoBarras}
              </p>
            )}
            <p>
              <strong>Stock actual:</strong> {productoSeleccionado.stockActual}{' '}
              {productoSeleccionado.unidadMedida}
            </p>
          </div>
        </div>
      )}

      {/* Cantidad */}
      {productoSeleccionado && (
        <>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Cantidad ({productoSeleccionado.unidadMedida}) *
            </label>
            <input
              type="number"
              value={cantidad}
              onChange={(e) => setCantidad(e.target.value)}
              min="1"
              step="1"
              required
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="0"
            />
          </div>

          {/* Motivo */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Motivo *</label>
            <select
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              required
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Seleccionar motivo...</option>
              {tipoMovimiento === 'entrada' ? (
                <>
                  <option value="compra">Compra</option>
                  <option value="devolucion">Devolución de cliente</option>
                  <option value="ajuste">Ajuste por conteo físico</option>
                  <option value="produccion">Producción</option>
                  <option value="otro">Otro</option>
                </>
              ) : (
                <>
                  <option value="merma">Merma</option>
                  <option value="dano">Daño/Rotura</option>
                  <option value="caducidad">Caducidad</option>
                  <option value="ajuste">Ajuste por conteo físico</option>
                  <option value="regalo">Regalo/Muestra</option>
                  <option value="otro">Otro</option>
                </>
              )}
            </select>
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
              placeholder="Detalles adicionales del ajuste..."
            />
          </div>

          {/* Resumen */}
          {cantidad && Number(cantidad) > 0 && (
            <div
              className={`rounded-lg p-4 ${
                tipoMovimiento === 'entrada'
                  ? 'bg-green-50 border border-green-200'
                  : 'bg-red-50 border border-red-200'
              }`}
            >
              <h3
                className={`font-semibold mb-2 ${
                  tipoMovimiento === 'entrada' ? 'text-green-900' : 'text-red-900'
                }`}
              >
                Resumen del Ajuste
              </h3>
              <div
                className={`space-y-1 text-sm ${
                  tipoMovimiento === 'entrada' ? 'text-green-800' : 'text-red-800'
                }`}
              >
                <p>
                  <strong>Stock actual:</strong> {productoSeleccionado.stockActual}{' '}
                  {productoSeleccionado.unidadMedida}
                </p>
                <p>
                  <strong>
                    {tipoMovimiento === 'entrada' ? 'Entrada' : 'Salida'}:
                  </strong>{' '}
                  {tipoMovimiento === 'salida' && '-'}
                  {cantidad} {productoSeleccionado.unidadMedida}
                </p>
                <p>
                  <strong>Stock final:</strong> {stockFinal}{' '}
                  {productoSeleccionado.unidadMedida}
                </p>
              </div>
            </div>
          )}

          {/* Botones */}
          <div className="flex gap-3 pt-4 border-t border-slate-200">
            <button
              type="submit"
              disabled={procesando || !cantidad || Number(cantidad) <= 0}
              className={`flex-1 py-3 rounded-lg font-medium text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                tipoMovimiento === 'entrada'
                  ? 'bg-green-600 hover:bg-green-700'
                  : 'bg-red-600 hover:bg-red-700'
              }`}
            >
              {procesando ? 'Procesando...' : 'Confirmar Ajuste'}
            </button>
            <a
              href={`/admin/empresas/${empresaId}/inventario`}
              className="flex-1 text-center bg-slate-200 text-slate-700 py-3 rounded-lg font-medium hover:bg-slate-300 transition-colors"
            >
              Cancelar
            </a>
          </div>
        </>
      )}
    </form>
  )
}
