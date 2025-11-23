'use client';

import { useState } from 'react';
import { Camera, Search, ShoppingCart, Trash2, Plus, Minus, DollarSign, CreditCard, User } from 'lucide-react';
import { BarcodeScanner, useBarcodeScanner } from '@/components/BarcodeScanner';

interface CartItem {
  id: string;
  sku: string;
  nombre: string;
  precio: number;
  cantidad: number;
  subtotal: number;
}

export default function PDVMovilPage() {
  const { isScanning, openScanner, closeScanner } = useBarcodeScanner();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const handleScan = (barcode: string) => {
    // Buscar producto por código de barras
    // Por ahora simulamos con datos de ejemplo
    const producto = {
      id: 'prod-1',
      sku: barcode,
      nombre: `Producto ${barcode}`,
      precio: 99.99,
    };

    addToCart(producto);
    closeScanner();
  };

  const addToCart = (producto: { id: string; sku: string; nombre: string; precio: number }) => {
    setCart(prevCart => {
      const existing = prevCart.find(item => item.id === producto.id);

      if (existing) {
        return prevCart.map(item =>
          item.id === producto.id
            ? {
                ...item,
                cantidad: item.cantidad + 1,
                subtotal: (item.cantidad + 1) * item.precio,
              }
            : item
        );
      }

      return [
        ...prevCart,
        {
          ...producto,
          cantidad: 1,
          subtotal: producto.precio,
        },
      ];
    });
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prevCart =>
      prevCart
        .map(item => {
          if (item.id !== id) return item;

          const newQty = Math.max(0, item.cantidad + delta);
          return {
            ...item,
            cantidad: newQty,
            subtotal: newQty * item.precio,
          };
        })
        .filter(item => item.cantidad > 0)
    );
  };

  const removeItem = (id: string) => {
    setCart(prevCart => prevCart.filter(item => item.id !== id));
  };

  const clearCart = () => {
    setCart([]);
  };

  const total = cart.reduce((sum, item) => sum + item.subtotal, 0);
  const iva = total * 0.16;
  const totalConIva = total + iva;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-32">
      {/* Header fijo */}
      <div className="sticky top-0 z-10 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="p-4">
          <h1 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
            Punto de Venta Móvil
          </h1>

          {/* Búsqueda y Scanner */}
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar producto..."
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

      {/* Lista del carrito */}
      <div className="p-4 space-y-2">
        {cart.length === 0 ? (
          <div className="text-center py-16">
            <ShoppingCart className="h-16 w-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
            <p className="text-slate-500 dark:text-slate-400">
              Escanea productos para empezar
            </p>
          </div>
        ) : (
          <>
            {cart.map((item) => (
              <div
                key={item.id}
                className="bg-white dark:bg-slate-800 rounded-lg p-4 shadow-sm border border-slate-200 dark:border-slate-700"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900 dark:text-white">
                      {item.nombre}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-mono">
                      SKU: {item.sku}
                    </p>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    aria-label="Eliminar"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  {/* Controles de cantidad */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.id, -1)}
                      className="p-2 bg-slate-100 dark:bg-slate-700 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 active:scale-95 transition-all"
                      aria-label="Disminuir cantidad"
                    >
                      <Minus className="h-5 w-5 text-slate-600 dark:text-slate-300" />
                    </button>

                    <span className="px-4 py-2 bg-slate-50 dark:bg-slate-900 rounded-lg font-bold text-lg min-w-[60px] text-center text-slate-900 dark:text-white">
                      {item.cantidad}
                    </span>

                    <button
                      onClick={() => updateQuantity(item.id, 1)}
                      className="p-2 bg-slate-100 dark:bg-slate-700 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 active:scale-95 transition-all"
                      aria-label="Aumentar cantidad"
                    >
                      <Plus className="h-5 w-5 text-slate-600 dark:text-slate-300" />
                    </button>
                  </div>

                  {/* Precio */}
                  <div className="text-right">
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      ${item.precio.toFixed(2)} c/u
                    </p>
                    <p className="text-xl font-bold text-blue-600 dark:text-blue-400">
                      ${item.subtotal.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </>
        )}
      </div>

      {/* Footer fijo con totales y acciones */}
      {cart.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 shadow-lg">
          {/* Totales */}
          <div className="p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-600 dark:text-slate-400">Subtotal:</span>
              <span className="font-semibold text-slate-900 dark:text-white">
                ${total.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-600 dark:text-slate-400">IVA (16%):</span>
              <span className="font-semibold text-slate-900 dark:text-white">
                ${iva.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between text-lg pt-2 border-t border-slate-200 dark:border-slate-700">
              <span className="font-bold text-slate-900 dark:text-white">Total:</span>
              <span className="font-bold text-2xl text-blue-600 dark:text-blue-400">
                ${totalConIva.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="p-4 pt-0 grid grid-cols-2 gap-2">
            <button
              onClick={clearCart}
              className="py-4 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 font-semibold active:scale-95 transition-all"
            >
              <Trash2 className="h-5 w-5 inline-block mr-2" />
              Limpiar
            </button>

            <button
              className="py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 font-bold shadow-lg active:scale-95 transition-all"
            >
              <CreditCard className="h-5 w-5 inline-block mr-2" />
              Cobrar
            </button>
          </div>
        </div>
      )}

      {/* Scanner de códigos de barras */}
      <BarcodeScanner
        isOpen={isScanning}
        onScan={handleScan}
        onClose={closeScanner}
      />
    </div>
  );
}
