import Link from 'next/link';
import { ArrowLeft, Upload, Palette, Globe, Mail, Settings } from 'lucide-react';

export default async function WhiteLabelConfigPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <div className="p-6">
      <div className="mb-6">
        <Link
          href={`/admin/empresas/${id}/configuracion`}
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver a Configuración
        </Link>
        <h1 className="text-2xl font-bold mb-2">Personalización White Label</h1>
        <p className="text-muted-foreground">
          Personaliza la apariencia y branding del sistema para tu empresa
        </p>
      </div>

      <div className="space-y-6">
        {/* Branding */}
        <div className="bg-white dark:bg-slate-800 rounded-lg border p-6">
          <div className="flex items-center gap-2 mb-4">
            <Upload className="h-5 w-5 text-blue-600" />
            <h2 className="text-lg font-semibold">Branding e Identidad</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Nombre del Sistema
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="Mi ERP Empresarial"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Nombre que aparecerá en el título y encabezados
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Subdominio
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  className="flex-1 px-3 py-2 border rounded-lg"
                  placeholder="miempresa"
                />
                <span className="flex items-center px-3 py-2 bg-slate-100 dark:bg-slate-700 rounded-lg text-sm">
                  .erp.com
                </span>
              </div>
            </div>

            {/* Logo Principal */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Logo Principal
              </label>
              <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-blue-500 transition-colors cursor-pointer">
                <Upload className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">
                  Clic para subir o arrastra aquí
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  PNG, JPG o SVG (máx. 2MB)
                </p>
              </div>
            </div>

            {/* Logo Pequeño */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Logo Pequeño / Ícono
              </label>
              <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-blue-500 transition-colors cursor-pointer">
                <Upload className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">
                  Clic para subir o arrastra aquí
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Cuadrado, 512x512px recomendado
                </p>
              </div>
            </div>

            {/* Favicon */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Favicon
              </label>
              <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-blue-500 transition-colors cursor-pointer">
                <Upload className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">
                  Clic para subir o arrastra aquí
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  ICO o PNG, 32x32px
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Colores y Tema */}
        <div className="bg-white dark:bg-slate-800 rounded-lg border p-6">
          <div className="flex items-center gap-2 mb-4">
            <Palette className="h-5 w-5 text-purple-600" />
            <h2 className="text-lg font-semibold">Colores y Tema</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Color Primario
              </label>
              <div className="flex gap-2">
                <input
                  type="color"
                  className="h-10 w-16 rounded cursor-pointer"
                  defaultValue="#3b82f6"
                />
                <input
                  type="text"
                  className="flex-1 px-3 py-2 border rounded-lg font-mono"
                  defaultValue="#3b82f6"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Color Secundario
              </label>
              <div className="flex gap-2">
                <input
                  type="color"
                  className="h-10 w-16 rounded cursor-pointer"
                  defaultValue="#10b981"
                />
                <input
                  type="text"
                  className="flex-1 px-3 py-2 border rounded-lg font-mono"
                  defaultValue="#10b981"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Color del Sidebar
              </label>
              <div className="flex gap-2">
                <input
                  type="color"
                  className="h-10 w-16 rounded cursor-pointer"
                  defaultValue="#1e293b"
                />
                <input
                  type="text"
                  className="flex-1 px-3 py-2 border rounded-lg font-mono"
                  defaultValue="#1e293b"
                />
              </div>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-sm font-medium mb-3">Vista Previa del Tema</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border rounded-lg p-4">
                <div className="bg-blue-600 text-white px-4 py-2 rounded mb-2">
                  Botón Primario
                </div>
                <div className="bg-green-600 text-white px-4 py-2 rounded">
                  Botón Secundario
                </div>
              </div>
              <div className="border rounded-lg p-4 bg-slate-800 text-white">
                <p className="text-sm mb-2">Sidebar Oscuro</p>
                <div className="space-y-1">
                  <div className="bg-slate-700 px-3 py-2 rounded text-sm">Menú Item 1</div>
                  <div className="bg-slate-700 px-3 py-2 rounded text-sm">Menú Item 2</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Dominio Personalizado */}
        <div className="bg-white dark:bg-slate-800 rounded-lg border p-6">
          <div className="flex items-center gap-2 mb-4">
            <Globe className="h-5 w-5 text-green-600" />
            <h2 className="text-lg font-semibold">Dominio Personalizado</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Dominio Propio
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="erp.miempresa.com"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Configura un CNAME en tu DNS apuntando a: erp-proxy.tudominio.com
              </p>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2">
                Instrucciones de Configuración DNS
              </h4>
              <ol className="text-sm text-blue-700 dark:text-blue-300 space-y-1 list-decimal list-inside">
                <li>Accede al panel de tu proveedor de DNS</li>
                <li>Crea un registro CNAME para tu subdominio</li>
                <li>Apunta a: <code className="bg-blue-100 dark:bg-blue-800 px-1 rounded">proxy.erp-system.com</code></li>
                <li>Espera la propagación DNS (puede tardar hasta 48 horas)</li>
                <li>Haz clic en "Verificar Dominio" cuando esté listo</li>
              </ol>
            </div>

            <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
              Verificar Dominio
            </button>
          </div>
        </div>

        {/* Configuración de Emails */}
        <div className="bg-white dark:bg-slate-800 rounded-lg border p-6">
          <div className="flex items-center gap-2 mb-4">
            <Mail className="h-5 w-5 text-orange-600" />
            <h2 className="text-lg font-semibold">Configuración de Emails</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Email Remitente
              </label>
              <input
                type="email"
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="noreply@miempresa.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Nombre del Remitente
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="Mi Empresa ERP"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Email de Respuesta
              </label>
              <input
                type="email"
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="soporte@miempresa.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Email de Soporte
              </label>
              <input
                type="email"
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="ayuda@miempresa.com"
              />
            </div>
          </div>
        </div>

        {/* Botones de Acción */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Link
            href={`/admin/empresas/${id}/configuracion`}
            className="px-4 py-2 border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            Cancelar
          </Link>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Guardar Cambios
          </button>
        </div>
      </div>
    </div>
  );
}
