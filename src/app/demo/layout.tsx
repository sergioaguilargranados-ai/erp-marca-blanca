import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Demo ERP - Sistema de Gestión',
  description: 'Demostración del sistema ERP completo',
}

export default async function DemoLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header del ERP */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-600 to-emerald-800 rounded-lg" />
              <div>
                <h1 className="text-xl font-bold text-slate-900">
                  ERP Sistema
                </h1>
                <p className="text-xs text-slate-500">Demo</p>
              </div>
            </div>

            <nav className="flex items-center gap-6">
              <a href="/demo" className="text-sm font-medium text-slate-700 hover:text-slate-900">
                Dashboard
              </a>
              <a href="/demo/productos" className="text-sm font-medium text-slate-700 hover:text-slate-900">
                Productos
              </a>
              <a href="/demo/ventas" className="text-sm font-medium text-slate-700 hover:text-slate-900">
                Ventas
              </a>
              <a href="/demo/inventario" className="text-sm font-medium text-slate-700 hover:text-slate-900">
                Inventario
              </a>
            </nav>
          </div>
        </div>
      </header>

      {/* Contenido principal */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  )
}
