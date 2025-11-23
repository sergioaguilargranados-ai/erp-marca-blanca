import { WifiOff, RefreshCw } from 'lucide-react';

export default function OfflinePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8">
          {/* Icon */}
          <div className="inline-flex items-center justify-center w-20 h-20 bg-orange-100 dark:bg-orange-900/30 rounded-full mb-6">
            <WifiOff className="h-10 w-10 text-orange-600 dark:text-orange-400" />
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
            Sin Conexión
          </h1>

          {/* Description */}
          <p className="text-slate-600 dark:text-slate-300 mb-6">
            No tienes conexión a Internet en este momento. El ERP está funcionando en modo offline.
          </p>

          {/* Offline capabilities */}
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-6 text-left">
            <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
              Funciones disponibles offline:
            </h3>
            <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
              <li>✓ Consultar productos e inventario</li>
              <li>✓ Registrar ventas (se sincronizarán al reconectar)</li>
              <li>✓ Ver reportes en caché</li>
              <li>✓ Consultar información de clientes</li>
            </ul>
          </div>

          {/* Pending sync info */}
          <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 mb-6">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              <strong>Nota:</strong> Hay operaciones pendientes de sincronización que se procesarán automáticamente cuando se restablezca la conexión.
            </p>
          </div>

          {/* Retry button */}
          <button
            onClick={() => window.location.reload()}
            className="w-full inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
          >
            <RefreshCw className="h-5 w-5" />
            Reintentar Conexión
          </button>

          {/* Go back */}
          <button
            onClick={() => window.history.back()}
            className="mt-3 w-full text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-medium py-2 transition-colors"
          >
            Volver atrás
          </button>
        </div>

        {/* Tips */}
        <div className="mt-6 text-sm text-slate-500 dark:text-slate-400">
          <p>
            Tip: Verifica tu conexión Wi-Fi o datos móviles
          </p>
        </div>
      </div>
    </div>
  );
}
