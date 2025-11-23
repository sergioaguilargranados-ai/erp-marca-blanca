'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { LogIn, Mail, Lock, AlertCircle, ArrowLeft, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button-premium'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card-premium'
import { Badge } from '@/components/ui/badge-premium'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError('Email o contraseña incorrectos')
      } else {
        router.push('/admin')
        router.refresh()
      }
    } catch (error) {
      setError('Error al iniciar sesión. Intenta nuevamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated gradient background */}
      <div className="fixed inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-blue-900/10 dark:to-slate-900 -z-10" />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-100/50 via-transparent to-purple-100/50 dark:from-blue-900/20 dark:to-purple-900/20 -z-10" />

      {/* Floating shapes */}
      <div className="fixed top-20 left-10 w-72 h-72 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse" />
      <div className="fixed bottom-20 right-10 w-96 h-96 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

      <div className="min-h-screen flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full animate-in fade-in slide-in-from-bottom duration-700">
          {/* Logo y título */}
          <div className="text-center mb-8">
            <div className="inline-flex p-4 bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 rounded-2xl shadow-2xl shadow-blue-500/30 mb-6 animate-in zoom-in duration-500">
              <Sparkles className="h-12 w-12 text-white" />
            </div>

            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">
              Iniciar Sesión
            </h1>

            <p className="text-slate-600 dark:text-slate-400 text-lg">
              Accede a tu panel de administración
            </p>

            <Badge variant="info" className="mt-4">
              <Lock className="h-3 w-3 mr-1" />
              Conexión Segura SSL
            </Badge>
          </div>

          {/* Formulario */}
          <Card variant="glass" className="shadow-2xl animate-in slide-in-from-bottom duration-700 delay-100">
            <CardHeader className="space-y-1 pb-4">
              <CardTitle className="text-2xl text-center">Bienvenido de vuelta</CardTitle>
              <CardDescription className="text-center">
                Ingresa tus credenciales para continuar
              </CardDescription>
            </CardHeader>

            <CardContent className="pb-8">
              <form onSubmit={handleSubmit} className="space-y-5">
                {error && (
                  <div className="backdrop-blur-xl bg-red-50/80 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-xl p-4 flex items-start gap-3 animate-in fade-in slide-in-from-top duration-300">
                    <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-700 dark:text-red-300 font-medium">
                      {error}
                    </p>
                  </div>
                )}

                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full pl-12 pr-4 py-3.5 backdrop-blur-xl bg-white/60 dark:bg-slate-800/60 border-2 border-slate-200/50 dark:border-slate-700/50 rounded-xl
                               focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-400
                               transition-all duration-200
                               text-slate-900 dark:text-white placeholder:text-slate-400
                               hover:bg-white/80 dark:hover:bg-slate-800/80"
                      placeholder="tu@email.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="password" className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Contraseña
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full pl-12 pr-4 py-3.5 backdrop-blur-xl bg-white/60 dark:bg-slate-800/60 border-2 border-slate-200/50 dark:border-slate-700/50 rounded-xl
                               focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-400
                               transition-all duration-200
                               text-slate-900 dark:text-white placeholder:text-slate-400
                               hover:bg-white/80 dark:hover:bg-slate-800/80"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-slate-600 dark:text-slate-400">Recordarme</span>
                  </label>
                  <Link
                    href="/auth/recuperar"
                    className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium hover:underline"
                  >
                    ¿Olvidaste tu contraseña?
                  </Link>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  variant="gradient"
                  size="lg"
                  className="w-full gap-2"
                >
                  {loading ? (
                    <>
                      <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Iniciando sesión...
                    </>
                  ) : (
                    <>
                      <LogIn className="h-5 w-5" />
                      Iniciar Sesión
                    </>
                  )}
                </Button>
              </form>

              <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
                <p className="text-center text-sm text-slate-600 dark:text-slate-400">
                  ¿No tienes cuenta?{' '}
                  <Link
                    href="/auth/register"
                    className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-semibold hover:underline"
                  >
                    Registrar empresa
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="mt-8 text-center animate-in fade-in slide-in-from-bottom duration-700 delay-200">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 font-medium transition-colors group"
            >
              <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              Volver al inicio
            </Link>
          </div>

          {/* Credentials hint for demo */}
          <Card variant="glass" className="mt-6 animate-in fade-in slide-in-from-bottom duration-700 delay-300">
            <CardContent className="py-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
                  <Sparkles className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white text-sm mb-1">
                    Cuenta Demo
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    Email: <code className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded font-mono">admin@demo.com</code>
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                    Password: <code className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded font-mono">demo123</code>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
