import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Panel Super Admin - ERP Marca Blanca',
  description: 'Panel administrativo para gestionar clientes, cobros y métricas',
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header del Super Admin */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg" />
              <h1 className="text-xl font-bold text-slate-900">
                Super Admin
              </h1>
            </div>

            <nav className="flex items-center gap-6">
              <a href="/admin" className="text-sm font-medium text-slate-700 hover:text-slate-900">
                Dashboard
              </a>
              <a href="/admin/empresas" className="text-sm font-medium text-slate-700 hover:text-slate-900">
                Empresas
              </a>
              <a href="/admin/planes" className="text-sm font-medium text-slate-700 hover:text-slate-900">
                Planes
              </a>
              <a href="/admin/soporte" className="text-sm font-medium text-slate-700 hover:text-slate-900">
                Soporte
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
