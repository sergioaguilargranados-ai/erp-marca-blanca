'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function RegisterPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const [formData, setFormData] = useState({
    // Empresa
    nombreEmpresa: '',
    subdominio: '',
    emailContacto: '',
    telefonoContacto: '',
    nombreContacto: '',

    // Usuario administrador
    nombreUsuario: '',
    emailUsuario: '',
    password: '',
    confirmPassword: '',

    // Plan
    planId: '',
    moneda: 'MXN',

    // Términos
    aceptaTerminos: false,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Validaciones
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden')
      setLoading(false)
      return
    }

    if (formData.password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres')
      setLoading(false)
      return
    }

    if (!formData.aceptaTerminos) {
      setError('Debes aceptar los términos y condiciones')
      setLoading(false)
      return
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Error al registrar empresa')
      }

      setSuccess(true)
      setTimeout(() => {
        router.push('/auth/registro-exitoso')
      }, 2000)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-emerald-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">✓</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            ¡Registro Exitoso!
          </h2>
          <p className="text-slate-600">
            Tu empresa ha sido registrada. Espera la aprobación del administrador.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-emerald-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-emerald-600 to-emerald-800 rounded-xl mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Registrar Empresa
          </h1>
          <p className="text-slate-600">
            Comienza tu prueba gratuita de 30 días
          </p>
        </div>

        {/* Formulario */}
        <div className="bg-white rounded-lg shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {/* Información de la Empresa */}
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-4">
                Información de la Empresa
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Nombre de la Empresa *
                  </label>
                  <input
                    type="text"
                    name="nombreEmpresa"
                    value={formData.nombreEmpresa}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="Mi Empresa S.A."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Subdominio *
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      name="subdominio"
                      value={formData.subdominio}
                      onChange={handleChange}
                      required
                      pattern="[a-z0-9-]+"
                      className="flex-1 px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      placeholder="miempresa"
                    />
                    <span className="text-slate-600">.tudominio.com</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Solo letras minúsculas, números y guiones
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Email de Contacto *
                    </label>
                    <input
                      type="email"
                      name="emailContacto"
                      value={formData.emailContacto}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      placeholder="contacto@empresa.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Teléfono
                    </label>
                    <input
                      type="tel"
                      name="telefonoContacto"
                      value={formData.telefonoContacto}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      placeholder="+52 55 1234 5678"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Nombre del Contacto Principal *
                  </label>
                  <input
                    type="text"
                    name="nombreContacto"
                    value={formData.nombreContacto}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="Juan Pérez"
                  />
                </div>
              </div>
            </div>

            {/* Usuario Administrador */}
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-4">
                Usuario Administrador
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Nombre Completo *
                  </label>
                  <input
                    type="text"
                    name="nombreUsuario"
                    value={formData.nombreUsuario}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="Juan Pérez"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="emailUsuario"
                    value={formData.emailUsuario}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="admin@empresa.com"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Contraseña *
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      minLength={8}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      placeholder="••••••••"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Confirmar Contraseña *
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      placeholder="••••••••"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Plan */}
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-4">
                Selecciona tu Plan
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Plan *
                  </label>
                  <select
                    name="planId"
                    value={formData.planId}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  >
                    <option value="">Selecciona un plan</option>
                    <option value="basico">Básico - 10 usuarios</option>
                    <option value="pro">Pro - 50 usuarios</option>
                    <option value="enterprise">Enterprise - Ilimitados</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Moneda *
                  </label>
                  <select
                    name="moneda"
                    value={formData.moneda}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  >
                    <option value="MXN">MXN - Pesos Mexicanos</option>
                    <option value="USD">USD - Dólares</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Términos */}
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                name="aceptaTerminos"
                checked={formData.aceptaTerminos}
                onChange={handleChange}
                required
                className="mt-1"
              />
              <label className="text-sm text-slate-600">
                Acepto los{' '}
                <a href="/terminos" className="text-emerald-600 hover:text-emerald-700">
                  términos y condiciones
                </a>{' '}
                y la{' '}
                <a href="/privacidad" className="text-emerald-600 hover:text-emerald-700">
                  política de privacidad
                </a>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-600 text-white py-3 rounded-lg font-medium hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Registrando...' : 'Comenzar Prueba Gratuita (30 días)'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-slate-600">
              ¿Ya tienes cuenta?{' '}
              <a href="/auth/login" className="text-emerald-600 hover:text-emerald-700 font-medium">
                Iniciar sesión
              </a>
            </p>
          </div>
        </div>

        <div className="mt-6 text-center text-sm text-slate-500">
          <a href="/" className="hover:text-slate-700">
            ← Volver al inicio
          </a>
        </div>
      </div>
    </div>
  )
}
