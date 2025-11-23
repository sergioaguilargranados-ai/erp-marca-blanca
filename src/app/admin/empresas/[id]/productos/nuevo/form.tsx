'use client'

import { useState } from 'react'

interface FormularioProductoProps {
  empresaId: string
  categorias: Array<{ id: string; nombre: string }>
}

export function FormularioProducto({ empresaId, categorias }: FormularioProductoProps) {
  const [codigoBarras, setCodigoBarras] = useState('')
  const [generandoCodigo, setGenerandoCodigo] = useState(false)

  const generarCodigoBarras = async () => {
    setGenerandoCodigo(true)
    try {
      const response = await fetch('/api/generar-codigo-barras')
      const data = await response.json()

      if (data.success) {
        setCodigoBarras(data.codigoBarras)
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setGenerandoCodigo(false)
    }
  }

  return (
    <form action={`/admin/empresas/${empresaId}/productos/crear`} method="POST" className="space-y-8">
      {/* Información Básica */}
      <div>
        <h3 className="text-lg font-semibold text-slate-900 mb-4">
          Información Básica
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Nombre del Producto *
            </label>
            <input
              type="text"
              name="nombre"
              required
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              placeholder="Laptop Dell Inspiron 15..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Descripción
            </label>
            <textarea
              name="descripcion"
              rows={3}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              placeholder="Descripción detallada del producto..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                SKU
              </label>
              <input
                type="text"
                name="sku"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="PROD-001"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Código de Barras
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  name="codigoBarras"
                  value={codigoBarras}
                  onChange={(e) => setCodigoBarras(e.target.value)}
                  className="flex-1 px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="7501234567890"
                />
                <button
                  type="button"
                  onClick={generarCodigoBarras}
                  disabled={generandoCodigo}
                  className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 whitespace-nowrap"
                >
                  {generandoCodigo ? '...' : '🎲 Generar'}
                </button>
              </div>
              <p className="text-xs text-slate-500 mt-1">Único en todo el sistema</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Categoría
              </label>
              <select
                name="categoriaId"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              >
                <option value="">Sin categoría</option>
                {categorias.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.nombre}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Precios */}
      <div>
        <h3 className="text-lg font-semibold text-slate-900 mb-4">
          Precios
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Precio de Compra
            </label>
            <div className="relative">
              <span className="absolute left-3 top-3 text-slate-500">$</span>
              <input
                type="number"
                name="precioCompra"
                step="0.01"
                min="0"
                className="w-full pl-7 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="0.00"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Precio Venta Minorista *
            </label>
            <div className="relative">
              <span className="absolute left-3 top-3 text-slate-500">$</span>
              <input
                type="number"
                name="precioVentaMinorista"
                step="0.01"
                min="0"
                required
                className="w-full pl-7 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="0.00"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Precio Venta Mayorista
            </label>
            <div className="relative">
              <span className="absolute left-3 top-3 text-slate-500">$</span>
              <input
                type="number"
                name="precioVentaMayorista"
                step="0.01"
                min="0"
                className="w-full pl-7 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="0.00"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Inventario */}
      <div>
        <h3 className="text-lg font-semibold text-slate-900 mb-4">
          Control de Inventario
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Unidad de Medida
            </label>
            <select
              name="unidadMedida"
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            >
              <option value="PZA">Pieza (PZA)</option>
              <option value="KG">Kilogramo (KG)</option>
              <option value="LT">Litro (LT)</option>
              <option value="MT">Metro (MT)</option>
              <option value="CAJA">Caja</option>
              <option value="PAQUETE">Paquete</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Stock Mínimo
            </label>
            <input
              type="number"
              name="stockMinimo"
              min="0"
              defaultValue="0"
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
            <p className="text-xs text-slate-500 mt-1">Alerta cuando esté por debajo</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Peso (kg)
            </label>
            <input
              type="number"
              name="peso"
              step="0.001"
              min="0"
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              placeholder="0.000"
            />
          </div>
        </div>
      </div>

      {/* Impuestos */}
      <div>
        <h3 className="text-lg font-semibold text-slate-900 mb-4">
          Impuestos
        </h3>
        <div>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="aplicaIva"
              value="true"
              defaultChecked
              className="w-4 h-4 text-emerald-600 rounded"
            />
            <span className="text-sm font-medium text-slate-700">
              Este producto aplica IVA
            </span>
          </label>
        </div>
      </div>

      {/* Botones */}
      <div className="flex gap-3 pt-4 border-t border-slate-200">
        <button
          type="submit"
          className="flex-1 bg-emerald-600 text-white py-3 rounded-lg font-medium hover:bg-emerald-700 transition-colors"
        >
          Crear Producto
        </button>
        <a
          href={`/admin/empresas/${empresaId}/productos`}
          className="flex-1 text-center bg-slate-200 text-slate-700 py-3 rounded-lg font-medium hover:bg-slate-300 transition-colors"
        >
          Cancelar
        </a>
      </div>
    </form>
  )
}
