import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default async function NuevoDescuentoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <div className="p-6">
      <div className="mb-6">
        <Link
          href={`/admin/empresas/${id}/descuentos`}
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver a Descuentos
        </Link>
        <h1 className="text-2xl font-bold mb-2">Crear Nuevo Descuento</h1>
        <p className="text-muted-foreground">
          Configura un nuevo descuento o promoción para tus clientes
        </p>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-lg border p-6">
        <form className="space-y-6">
          {/* Información Básica */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Información Básica</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Código del Descuento *
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded-lg"
                  placeholder="VERANO2025"
                  required
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Código único que los clientes usarán
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Nombre del Descuento *
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded-lg"
                  placeholder="Descuento de Verano"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">
                  Descripción
                </label>
                <textarea
                  className="w-full px-3 py-2 border rounded-lg"
                  rows={3}
                  placeholder="Promoción especial de verano..."
                />
              </div>
            </div>
          </div>

          {/* Tipo y Valor */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Tipo y Valor del Descuento</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Tipo de Descuento *
                </label>
                <select className="w-full px-3 py-2 border rounded-lg" required>
                  <option value="">Selecciona un tipo</option>
                  <option value="porcentaje">Porcentaje</option>
                  <option value="monto_fijo">Monto Fijo</option>
                  <option value="envio_gratis">Envío Gratis</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Valor *
                </label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border rounded-lg"
                  placeholder="20"
                  step="0.01"
                  required
                />
                <p className="text-xs text-muted-foreground mt-1">
                  20% o $100 según el tipo
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Aplica a
                </label>
                <select className="w-full px-3 py-2 border rounded-lg">
                  <option value="total">Total de la compra</option>
                  <option value="producto">Productos específicos</option>
                  <option value="categoria">Categorías específicas</option>
                </select>
              </div>
            </div>
          </div>

          {/* Restricciones */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Restricciones y Límites</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Compra Mínima
                </label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border rounded-lg"
                  placeholder="0.00"
                  step="0.01"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Cantidad Mínima de Productos
                </label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border rounded-lg"
                  placeholder="1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Usos Máximos Totales
                </label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border rounded-lg"
                  placeholder="Sin límite"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Usos por Cliente
                </label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border rounded-lg"
                  defaultValue="1"
                />
              </div>
            </div>
          </div>

          {/* Clientes Aplicables */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Clientes Aplicables</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Tipo de Cliente
                </label>
                <select className="w-full px-3 py-2 border rounded-lg">
                  <option value="todos">Todos los clientes</option>
                  <option value="mayorista">Solo Mayoristas</option>
                  <option value="minorista">Solo Minoristas</option>
                  <option value="vip">Solo VIP</option>
                  <option value="especificos">Clientes Específicos</option>
                </select>
              </div>
            </div>
          </div>

          {/* Vigencia */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Vigencia</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Fecha de Inicio *
                </label>
                <input
                  type="datetime-local"
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Fecha de Fin
                </label>
                <input
                  type="datetime-local"
                  className="w-full px-3 py-2 border rounded-lg"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Dejar vacío para sin fecha de expiración
                </p>
              </div>
            </div>
          </div>

          {/* Opciones Adicionales */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Opciones Adicionales</h2>
            <div className="space-y-3">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="rounded" />
                <span className="text-sm">Requiere autorización de supervisor</span>
              </label>

              <label className="flex items-center gap-2">
                <input type="checkbox" className="rounded" defaultChecked />
                <span className="text-sm">Descuento activo</span>
              </label>

              <label className="flex items-center gap-2">
                <input type="checkbox" className="rounded" />
                <span className="text-sm">Acumulable con otros descuentos</span>
              </label>
            </div>
          </div>

          {/* Botones */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Link
              href={`/admin/empresas/${id}/descuentos`}
              className="px-4 py-2 border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Crear Descuento
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
