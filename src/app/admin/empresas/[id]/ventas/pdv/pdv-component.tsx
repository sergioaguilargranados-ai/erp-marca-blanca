'use client'

import { useState, useEffect, useRef } from 'react'

interface Sucursal {
  id: string
  nombre: string
  tasaIva: string
}

interface Usuario {
  id: string
  nombre: string
}

interface Producto {
  id: string
  nombre: string
  codigoBarras: string | null
  sku: string | null
  precioVentaMinorista: string
  precioVentaMayorista: string | null
  unidadMedida: string
  aplicaIva: boolean
  tasaIvaEspecial: string | null
  stockDisponible: number
}

interface ItemCarrito {
  producto: Producto
  cantidad: number
  precioUnitario: number
  subtotal: number
  iva: number
  total: number
}

interface PuntoDeVentaProps {
  empresaId: string
  sucursales: Sucursal[]
  usuarios: Usuario[]
}

export function PuntoDeVenta({ empresaId, sucursales, usuarios }: PuntoDeVentaProps) {
  const [sucursalSeleccionada, setSucursalSeleccionada] = useState(sucursales[0]?.id || '')
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(usuarios[0]?.id || '')
  const [busqueda, setBusqueda] = useState('')
  const [carrito, setCarrito] = useState<ItemCarrito[]>([])
  const [clienteNombre, setClienteNombre] = useState('Público General')
  const [metodoPago, setMetodoPago] = useState<'efectivo' | 'tarjeta' | 'transferencia'>('efectivo')
  const [montoPagado, setMontoPagado] = useState('')
  const [buscando, setBuscando] = useState(false)
  const [procesando, setProcesando] = useState(false)
  const inputBusquedaRef = useRef<HTMLInputElement>(null)

  // Calcular totales
  const subtotal = carrito.reduce((sum, item) => sum + item.subtotal, 0)
  const totalIva = carrito.reduce((sum, item) => sum + item.iva, 0)
  const total = carrito.reduce((sum, item) => sum + item.total, 0)
  const cambio = montoPagado ? Math.max(0, Number(montoPagado) - total) : 0

  // Buscar producto por código de barras o nombre
  const buscarProducto = async (termino: string) => {
    if (!termino.trim() || !sucursalSeleccionada) return

    setBuscando(true)
    try {
      const response = await fetch(
        `/api/empresas/${empresaId}/productos/buscar?q=${encodeURIComponent(termino)}&sucursalId=${sucursalSeleccionada}`
      )
      const data = await response.json()

      if (data.producto) {
        agregarAlCarrito(data.producto)
        setBusqueda('')
      } else {
        alert('Producto no encontrado')
      }
    } catch (error) {
      console.error('Error buscando producto:', error)
      alert('Error al buscar producto')
    } finally {
      setBuscando(false)
    }
  }

  // Agregar producto al carrito
  const agregarAlCarrito = (producto: Producto) => {
    if (producto.stockDisponible <= 0) {
      alert('Producto sin stock disponible')
      return
    }

    const existente = carrito.find(item => item.producto.id === producto.id)

    if (existente) {
      if (existente.cantidad >= producto.stockDisponible) {
        alert('No hay más stock disponible')
        return
      }
      modificarCantidad(existente.producto.id, existente.cantidad + 1)
    } else {
      const tasaIva = producto.aplicaIva
        ? Number(producto.tasaIvaEspecial || sucursales.find(s => s.id === sucursalSeleccionada)?.tasaIva || '16')
        : 0

      const precioUnitario = Number(producto.precioVentaMinorista)
      const subtotal = precioUnitario * 1
      const iva = (subtotal * tasaIva) / 100
      const total = subtotal + iva

      setCarrito([
        ...carrito,
        {
          producto,
          cantidad: 1,
          precioUnitario,
          subtotal,
          iva,
          total,
        },
      ])
    }
  }

  // Modificar cantidad de un producto
  const modificarCantidad = (productoId: string, nuevaCantidad: number) => {
    if (nuevaCantidad <= 0) {
      eliminarDelCarrito(productoId)
      return
    }

    setCarrito(
      carrito.map(item => {
        if (item.producto.id === productoId) {
          const tasaIva = item.producto.aplicaIva
            ? Number(item.producto.tasaIvaEspecial || sucursales.find(s => s.id === sucursalSeleccionada)?.tasaIva || '16')
            : 0

          const subtotal = item.precioUnitario * nuevaCantidad
          const iva = (subtotal * tasaIva) / 100
          const total = subtotal + iva

          return {
            ...item,
            cantidad: Math.min(nuevaCantidad, item.producto.stockDisponible),
            subtotal,
            iva,
            total,
          }
        }
        return item
      })
    )
  }

  // Eliminar producto del carrito
  const eliminarDelCarrito = (productoId: string) => {
    setCarrito(carrito.filter(item => item.producto.id !== productoId))
  }

  // Limpiar carrito
  const limpiarCarrito = () => {
    if (carrito.length > 0 && !confirm('¿Estás seguro de limpiar el carrito?')) return
    setCarrito([])
    setClienteNombre('Público General')
    setMontoPagado('')
    setBusqueda('')
  }

  // Procesar venta
  const procesarVenta = async () => {
    if (carrito.length === 0) {
      alert('El carrito está vacío')
      return
    }

    if (!usuarioSeleccionado) {
      alert('Selecciona un vendedor')
      return
    }

    if (metodoPago === 'efectivo' && Number(montoPagado) < total) {
      alert('El monto pagado es insuficiente')
      return
    }

    setProcesando(true)
    try {
      const response = await fetch(`/api/empresas/${empresaId}/ventas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sucursalId: sucursalSeleccionada,
          usuarioId: usuarioSeleccionado,
          nombreCliente: clienteNombre,
          metodoPago,
          montoPagado: metodoPago === 'efectivo' ? Number(montoPagado) : total,
          cambio: metodoPago === 'efectivo' ? cambio : 0,
          items: carrito.map(item => ({
            productoId: item.producto.id,
            cantidad: item.cantidad,
            precioUnitario: item.precioUnitario,
          })),
        }),
      })

      const data = await response.json()

      if (data.success) {
        alert(`Venta registrada: ${data.folio}`)
        limpiarCarrito()
        // Opcional: abrir ticket en nueva ventana
        window.open(`/admin/empresas/${empresaId}/ventas/${data.ventaId}/ticket`, '_blank')
      } else {
        alert(data.error || 'Error al procesar la venta')
      }
    } catch (error) {
      console.error('Error procesando venta:', error)
      alert('Error al procesar la venta')
    } finally {
      setProcesando(false)
    }
  }

  // Focus automático en input de búsqueda
  useEffect(() => {
    inputBusquedaRef.current?.focus()
  }, [])

  // Enter para buscar
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      buscarProducto(busqueda)
    }
  }

  return (
    <div className="flex-1 flex flex-col bg-slate-100">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Punto de Venta</h1>
            <p className="text-sm text-slate-600 mt-1">Sistema de ventas rápido</p>
          </div>

          <div className="flex gap-4 items-center">
            <div>
              <label className="text-xs text-slate-600 block mb-1">Sucursal</label>
              <select
                value={sucursalSeleccionada}
                onChange={(e) => setSucursalSeleccionada(e.target.value)}
                className="px-3 py-2 border border-slate-300 rounded-lg text-sm"
              >
                {sucursales.map(s => (
                  <option key={s.id} value={s.id}>{s.nombre}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs text-slate-600 block mb-1">Vendedor</label>
              <select
                value={usuarioSeleccionado}
                onChange={(e) => setUsuarioSeleccionado(e.target.value)}
                className="px-3 py-2 border border-slate-300 rounded-lg text-sm"
              >
                {usuarios.map(u => (
                  <option key={u.id} value={u.id}>{u.nombre}</option>
                ))}
              </select>
            </div>

            <a
              href={`/admin/empresas/${empresaId}/ventas`}
              className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300"
            >
              ← Salir
            </a>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="flex-1 flex overflow-hidden">
        {/* Área de productos y búsqueda */}
        <div className="flex-1 p-6 overflow-auto">
          {/* Búsqueda */}
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 mb-6">
            <div className="flex gap-4">
              <div className="flex-1">
                <input
                  ref={inputBusquedaRef}
                  type="text"
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Escanea código de barras o busca por nombre..."
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg text-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  disabled={buscando}
                />
              </div>
              <button
                onClick={() => buscarProducto(busqueda)}
                disabled={buscando || !busqueda.trim()}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {buscando ? 'Buscando...' : 'Buscar'}
              </button>
            </div>
          </div>

          {/* Cliente */}
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 mb-6">
            <label className="text-sm font-medium text-slate-700 block mb-2">
              Cliente
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={clienteNombre}
                onChange={(e) => setClienteNombre(e.target.value)}
                placeholder="Nombre del cliente"
                className="flex-1 px-4 py-2 border border-slate-300 rounded-lg"
              />
              <button
                onClick={() => setClienteNombre('Público General')}
                className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300"
              >
                Público General
              </button>
            </div>
          </div>

          {/* Carrito */}
          <div className="bg-white rounded-lg shadow-sm border border-slate-200">
            <div className="p-4 border-b border-slate-200 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-slate-900">
                Carrito ({carrito.length} productos)
              </h2>
              {carrito.length > 0 && (
                <button
                  onClick={limpiarCarrito}
                  className="text-sm text-red-600 hover:text-red-700"
                >
                  Limpiar carrito
                </button>
              )}
            </div>

            <div className="divide-y divide-slate-200">
              {carrito.map((item) => (
                <div key={item.producto.id} className="p-4 hover:bg-slate-50">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <h3 className="font-medium text-slate-900">{item.producto.nombre}</h3>
                      <p className="text-sm text-slate-500">
                        {item.producto.codigoBarras || item.producto.sku}
                      </p>
                      <p className="text-sm text-slate-600 mt-1">
                        ${item.precioUnitario.toFixed(2)} / {item.producto.unidadMedida}
                      </p>
                    </div>
                    <button
                      onClick={() => eliminarDelCarrito(item.producto.id)}
                      className="text-red-600 hover:text-red-700 ml-4"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => modificarCantidad(item.producto.id, item.cantidad - 1)}
                        className="w-8 h-8 bg-slate-200 rounded hover:bg-slate-300"
                      >
                        −
                      </button>
                      <span className="w-12 text-center font-medium">{item.cantidad}</span>
                      <button
                        onClick={() => modificarCantidad(item.producto.id, item.cantidad + 1)}
                        className="w-8 h-8 bg-slate-200 rounded hover:bg-slate-300"
                        disabled={item.cantidad >= item.producto.stockDisponible}
                      >
                        +
                      </button>
                      <span className="text-xs text-slate-500 ml-2">
                        (Stock: {item.producto.stockDisponible})
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-slate-900">
                        ${item.total.toFixed(2)}
                      </div>
                      {item.iva > 0 && (
                        <div className="text-xs text-slate-500">
                          IVA: ${item.iva.toFixed(2)}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {carrito.length === 0 && (
                <div className="p-12 text-center text-slate-400">
                  <div className="text-4xl mb-2">🛒</div>
                  <p>El carrito está vacío</p>
                  <p className="text-sm mt-1">Busca productos para agregar</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Panel de pago */}
        <div className="w-96 bg-white border-l border-slate-200 flex flex-col">
          <div className="p-6 border-b border-slate-200">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">Resumen</h2>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal:</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>IVA:</span>
                <span>${totalIva.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-2xl font-bold text-slate-900 pt-2 border-t border-slate-200">
                <span>Total:</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            {/* Método de pago */}
            <div className="mb-4">
              <label className="text-sm font-medium text-slate-700 block mb-2">
                Método de Pago
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => setMetodoPago('efectivo')}
                  className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                    metodoPago === 'efectivo'
                      ? 'bg-green-600 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  Efectivo
                </button>
                <button
                  onClick={() => setMetodoPago('tarjeta')}
                  className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                    metodoPago === 'tarjeta'
                      ? 'bg-green-600 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  Tarjeta
                </button>
                <button
                  onClick={() => setMetodoPago('transferencia')}
                  className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                    metodoPago === 'transferencia'
                      ? 'bg-green-600 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  Transfer.
                </button>
              </div>
            </div>

            {/* Monto pagado (solo para efectivo) */}
            {metodoPago === 'efectivo' && (
              <div className="mb-4">
                <label className="text-sm font-medium text-slate-700 block mb-2">
                  Monto Pagado
                </label>
                <input
                  type="number"
                  value={montoPagado}
                  onChange={(e) => setMontoPagado(e.target.value)}
                  step="0.01"
                  min={total}
                  placeholder="0.00"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg text-lg"
                />
                {Number(montoPagado) >= total && (
                  <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="text-sm text-green-800">Cambio:</div>
                    <div className="text-2xl font-bold text-green-900">
                      ${cambio.toFixed(2)}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex-1" />

          <div className="p-6 border-t border-slate-200">
            <button
              onClick={procesarVenta}
              disabled={
                carrito.length === 0 ||
                procesando ||
                (metodoPago === 'efectivo' && Number(montoPagado) < total)
              }
              className="w-full py-4 bg-green-600 text-white rounded-lg text-lg font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {procesando ? 'Procesando...' : 'Cobrar'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
