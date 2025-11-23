export default function RegistroExitosoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-emerald-50 flex items-center justify-center px-4">
      <div className="max-w-lg w-full bg-white rounded-lg shadow-xl p-8">
        {/* Icono de éxito */}
        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-12 h-12 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        {/* Título */}
        <h1 className="text-3xl font-bold text-center text-slate-900 mb-4">
          ¡Registro Exitoso!
        </h1>

        {/* Mensaje principal */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
          <h2 className="font-semibold text-blue-900 mb-2">
            Tu empresa ha sido registrada
          </h2>
          <p className="text-blue-800 text-sm">
            Hemos recibido tu solicitud y está pendiente de aprobación por nuestro equipo.
          </p>
        </div>

        {/* Próximos pasos */}
        <div className="space-y-4 mb-8">
          <h3 className="font-semibold text-slate-900">
            ¿Qué sigue?
          </h3>

          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-emerald-600 text-sm font-bold">1</span>
              </div>
              <div>
                <p className="text-sm text-slate-700">
                  <strong>Revisión:</strong> Nuestro equipo revisará tu solicitud en las próximas 24-48 horas.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-emerald-600 text-sm font-bold">2</span>
              </div>
              <div>
                <p className="text-sm text-slate-700">
                  <strong>Notificación:</strong> Recibirás un email cuando tu cuenta sea aprobada.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-emerald-600 text-sm font-bold">3</span>
              </div>
              <div>
                <p className="text-sm text-slate-700">
                  <strong>Acceso:</strong> Una vez aprobada, podrás iniciar sesión y comenzar tu prueba de 30 días.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Información adicional */}
        <div className="bg-slate-50 rounded-lg p-4 mb-6">
          <p className="text-sm text-slate-600 text-center">
            <strong>¿Necesitas ayuda?</strong><br />
            Contáctanos en <a href="mailto:soporte@tudominio.com" className="text-emerald-600 hover:text-emerald-700">soporte@tudominio.com</a>
          </p>
        </div>

        {/* Botones */}
        <div className="flex flex-col sm:flex-row gap-3">
          <a
            href="/"
            className="flex-1 text-center px-6 py-3 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors"
          >
            Volver al Inicio
          </a>
          <a
            href="/auth/login"
            className="flex-1 text-center px-6 py-3 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors"
          >
            Ir a Iniciar Sesión
          </a>
        </div>
      </div>
    </div>
  )
}
