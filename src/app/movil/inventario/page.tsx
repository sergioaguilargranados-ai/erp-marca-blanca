'use client';

import { useState } from 'react';
import { Search, Camera, Package, AlertCircle, TrendingUp, TrendingDown, RefreshCw } from 'lucide-react';
import { BarcodeScanner, useBarcodeScanner } from '@/components/BarcodeScanner';

interface ProductoInventario {
  id: string;
  sku: string;
  nombre: string;
  stock: number;
  stockMinimo: number;
  stockMaximo: number | null;
  sucursal: string;
  ubicacion?: string;
}

export default function InventarioMovilPage() {
  const { isScanning, openScanner, closeScanner } = useBarcodeScanner();
  const [searchQuery, setSearchQuery] = useState('');
  const [productos, setProductos] = useState<ProductoInventario[]>([
    {
      id: '1',
      sku: 'PROD-001',
      nombre: 'Laptop HP 15',
      stock: 45,
      stockMinimo: 10,
      stockMaximo: 100,
      sucursal: 'Centro',
      ubicacion: 'A-12',
    },
    {
      id: '2',
      sku: 'PROD-002',
      nombre: 'Mouse Logitech',
      stock: 5,
      stockMinimo: 20,
      stockMaximo: 200,
      sucursal: 'Centro',
      ubicacion: 'B-04',
    },
    {
      id: '3',
      sku: 'PROD-003',
      nombre: 'Teclado Mecánico',
      stock: 150,
      stockMinimo: 30,
      stockMaximo: 100,
      sucursal: 'Centro',
      ubicacion: 'B-05',
    },
  ]);

  const handleScan = (barcode: string) => {
    setSearchQuery(barcode);
    closeScanner();
    // Aquí se buscaría el producto en la API
  };

  const filteredProductos = productos.filter(p =>
    p.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.sku.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStockStatus = (producto: ProductoInventario) => {
    if (producto.stock <= producto.stockMinimo) {
      return { status: 'bajo', color: 'bg-red-100 dark:bg-red-900/20 border-red-200 dark:border-red-800', icon: TrendingDown, textColor: 'text-red-600 dark:text-red-400' };
    }
    if (producto.stockMaximo && producto.stock >= producto.stockMaximo) {
      return { status: 'alto', color: 'bg-orange-100 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800', icon: TrendingUp, textColor: 'text-orange-600 dark:text-orange-400' };
    }
    return { status: 'normal', color: 'bg-green-100 dark:bg-green-900/20 border-green-200 dark:border-green-800', icon: Package, textColor: 'text-green-600 dark:text-green-400' };
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Header fijo */}
      <div className="sticky top-0 z-10 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">
              Consulta de Inventario
            </h1>
            <button
              className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
              aria-label="Actualizar"
            >
              <RefreshCw className="h-5 w-5" />
            </button>
          </div>

          {/* Búsqueda y Scanner */}
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar por nombre o SKU..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              onClick={openScanner}
              className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-colors shadow-md"
              aria-label="Escanear código de barras"
            >
              <Camera className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Lista de productos */}
      <div className="p-4 space-y-3">
        {filteredProductos.length === 0 ? (
          <div className="text-center py-16">
            <Package className="h-16 w-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
            <p className="text-slate-500 dark:text-slate-400">
              {searchQuery ? 'No se encontraron productos' : 'Sin productos en inventario'}
            </p>
          </div>
        ) : (
          filteredProductos.map((producto) => {
            const stockInfo = getStockStatus(producto);
            const Icon = stockInfo.icon;
            const porcentaje = producto.stockMaximo
              ? Math.round((producto.stock / producto.stockMaximo) * 100)
              : 0;

            return (
              <div
                key={producto.id}
                className={`rounded-lg p-4 border ${stockInfo.color} transition-colors`}
              >
                {/* Encabezado */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900 dark:text-white">
                      {producto.nombre}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-mono mt-1">
                      SKU: {producto.sku}
                    </p>
                  </div>
                  <Icon className={`h-6 w-6 ${stockInfo.textColor}`} />
                </div>

                {/* Stock */}
                <div className="mb-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-slate-600 dark:text-slate-400">
                      Stock Disponible
                    </span>
                    <span className={`text-2xl font-bold ${stockInfo.textColor}`}>
                      {producto.stock}
                    </span>
                  </div>

                  {/* Barra de progreso */}
                  {producto.stockMaximo && (
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full transition-all ${
                          porcentaje <= 30
                            ? 'bg-red-500'
                            : porcentaje <= 70
                            ? 'bg-yellow-500'
                            : porcentaje <= 100
                            ? 'bg-green-500'
                            : 'bg-orange-500'
                        }`}
                        style={{ width: `${Math.min(porcentaje, 100)}%` }}
                      />
                    </div>
                  )}
                </div>

                {/* Información adicional */}
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div>
                    <p className="text-slate-500 dark:text-slate-400">Mínimo</p>
                    <p className="font-semibold text-slate-900 dark:text-white">
                      {producto.stockMinimo}
                    </p>
                  </div>
                  {producto.stockMaximo && (
                    <div>
                      <p className="text-slate-500 dark:text-slate-400">Máximo</p>
                      <p className="font-semibold text-slate-900 dark:text-white">
                        {producto.stockMaximo}
                      </p>
                    </div>
                  )}
                  <div>
                    <p className="text-slate-500 dark:text-slate-400">Ubicación</p>
                    <p className="font-semibold text-slate-900 dark:text-white">
                      {producto.ubicacion || 'N/A'}
                    </p>
                  </div>
                </div>

                {/* Alertas */}
                {producto.stock <= producto.stockMinimo && (
                  <div className="mt-3 flex items-start gap-2 p-2 bg-red-50 dark:bg-red-900/10 rounded-lg border border-red-200 dark:border-red-800">
                    <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-red-700 dark:text-red-300">
                      Stock por debajo del mínimo. Se requiere reabastecimiento.
                    </p>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Scanner de códigos de barras */}
      <BarcodeScanner
        isOpen={isScanning}
        onScan={handleScan}
        onClose={closeScanner}
      />
    </div>
  );
}
