import Link from 'next/link'
import { Building2, ShoppingCart, Smartphone, Bot, Receipt, TrendingUp, Zap, Shield, Globe } from 'lucide-react'
import { Button } from '@/components/ui/button-premium'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card-premium'
import { Badge } from '@/components/ui/badge-premium'

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Animated gradient background */}
      <div className="fixed inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-blue-900/10 dark:to-slate-900 -z-10" />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-100/50 via-transparent to-purple-100/50 dark:from-blue-900/20 dark:to-purple-900/20 -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section */}
        <div className="text-center mb-20 animate-in fade-in slide-in-from-bottom duration-700">
          <Badge variant="gradient" className="mb-6 text-base px-6 py-2">
            <Zap className="h-4 w-4 mr-2" />
            Sistema SaaS Multi-Tenant Profesional
          </Badge>

          <h1 className="text-7xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-in fade-in slide-in-from-top duration-700 delay-100">
            ERP Marca Blanca
          </h1>

          <p className="text-2xl text-slate-600 dark:text-slate-400 mb-10 max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom duration-700 delay-200">
            La plataforma completa para gestionar tu negocio con tecnología de clase mundial
          </p>

          <div className="flex gap-4 justify-center animate-in fade-in slide-in-from-bottom duration-700 delay-300">
            <Link href="/admin">
              <Button variant="gradient" size="lg" className="gap-2">
                <Building2 className="h-5 w-5" />
                Panel Super Admin
              </Button>
            </Link>
            <Link href="/demo">
              <Button variant="success" size="lg" className="gap-2">
                <Smartphone className="h-5 w-5" />
                Demo ERP
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Funcionalidades Completas
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400">
              Todo lo que necesitas para hacer crecer tu negocio
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard
              icon={<Building2 className="h-8 w-8" />}
              title="Panel Super Admin"
              description="Gestiona clientes, planes y cobros automáticos con Stripe"
              gradient="from-blue-500 to-cyan-600"
              delay={0}
            />
            <FeatureCard
              icon={<TrendingUp className="h-8 w-8" />}
              title="ERP Completo"
              description="Hasta 99 sucursales, inventario, PDV y facturación CFDI 4.0"
              gradient="from-emerald-500 to-teal-600"
              delay={100}
            />
            <FeatureCard
              icon={<ShoppingCart className="h-8 w-8" />}
              title="E-commerce Integrado"
              description="Tienda online con sincronización en tiempo real"
              gradient="from-purple-500 to-pink-600"
              delay={200}
            />
            <FeatureCard
              icon={<Smartphone className="h-8 w-8" />}
              title="App Móvil PWA"
              description="Con modo offline y scanner de códigos de barras"
              gradient="from-orange-500 to-red-600"
              delay={300}
            />
            <FeatureCard
              icon={<Bot className="h-8 w-8" />}
              title="Chatbots IA"
              description="Soporte web y WhatsApp con inteligencia artificial"
              gradient="from-indigo-500 to-purple-600"
              delay={400}
            />
            <FeatureCard
              icon={<Receipt className="h-8 w-8" />}
              title="Facturación CFDI"
              description="Integración completa con Facturama para timbrado"
              gradient="from-pink-500 to-rose-600"
              delay={500}
            />
          </div>
        </div>

        {/* Tech Stack */}
        <Card variant="glass" className="mb-20 animate-in fade-in slide-in-from-bottom duration-700">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center gap-3 mb-2">
              <Shield className="h-8 w-8 text-blue-600" />
              <CardTitle className="text-3xl">Tecnología de Punta</CardTitle>
            </div>
            <CardDescription className="text-lg">
              Construido con las mejores herramientas del mercado
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <TechBadge name="Next.js 15" />
              <TechBadge name="TypeScript" />
              <TechBadge name="PostgreSQL" />
              <TechBadge name="Stripe" />
              <TechBadge name="Tailwind CSS" />
              <TechBadge name="Drizzle ORM" />
              <TechBadge name="Playwright" />
              <TechBadge name="WCAG 2.1 AA" />
            </div>
          </CardContent>
        </Card>

        {/* Pricing */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Planes Flexibles
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400">
              Elige el plan perfecto para tu negocio
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <PricingCard
              name="Básico"
              price="$999"
              period="/mes"
              features={[
                'Hasta 10 usuarios',
                'Todas las funcionalidades',
                'Soporte por email',
                '30 días prueba gratis',
                '1 sucursal'
              ]}
              delay={0}
            />
            <PricingCard
              name="Pro"
              price="$2,499"
              period="/mes"
              featured
              features={[
                'Hasta 50 usuarios',
                'Todas las funcionalidades',
                'Soporte prioritario',
                'Chatbot WhatsApp',
                'Personalización',
                'Hasta 5 sucursales'
              ]}
              delay={100}
            />
            <PricingCard
              name="Enterprise"
              price="Contactar"
              period=""
              features={[
                'Usuarios ilimitados',
                'Todas las funcionalidades',
                'Soporte 24/7',
                'Desarrollo a medida',
                'Onboarding dedicado',
                'Hasta 99 sucursales'
              ]}
              delay={200}
            />
          </div>
        </div>

        {/* CTA Section */}
        <Card variant="gradient" className="text-center text-white animate-in fade-in slide-in-from-bottom duration-700">
          <CardContent className="py-16">
            <Globe className="h-16 w-16 mx-auto mb-6 animate-pulse" />
            <h2 className="text-4xl font-bold mb-4">
              ¿Listo para transformar tu negocio?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Únete a cientos de empresas que ya confían en nosotros
            </p>
            <div className="flex gap-4 justify-center">
              <Link href="/auth/register">
                <Button variant="glass" size="xl" className="text-slate-900 dark:text-white">
                  Comenzar Prueba Gratis
                </Button>
              </Link>
              <Link href="/contacto">
                <Button variant="outline" size="xl" className="border-white text-white hover:bg-white/20">
                  Agendar Demo
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function FeatureCard({
  icon,
  title,
  description,
  gradient,
  delay = 0
}: {
  icon: React.ReactNode
  title: string
  description: string
  gradient: string
  delay?: number
}) {
  return (
    <Card
      variant="premium"
      className="group animate-in fade-in slide-in-from-bottom duration-700"
      style={{ animationDelay: `${delay}ms` }}
    >
      <CardContent className="p-6">
        <div className={`inline-flex p-3 bg-gradient-to-br ${gradient} rounded-xl shadow-lg text-white mb-4 group-hover:scale-110 transition-transform duration-300`}>
          {icon}
        </div>
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
          {title}
        </h3>
        <p className="text-slate-600 dark:text-slate-400">
          {description}
        </p>
      </CardContent>
    </Card>
  )
}

function TechBadge({ name }: { name: string }) {
  return (
    <Badge variant="glass" className="justify-center py-3 text-sm font-semibold hover:scale-105 transition-transform">
      {name}
    </Badge>
  )
}

function PricingCard({
  name,
  price,
  period,
  features,
  featured = false,
  delay = 0
}: {
  name: string
  price: string
  period: string
  features: string[]
  featured?: boolean
  delay?: number
}) {
  return (
    <Card
      variant={featured ? "premium" : "elevated"}
      className={`relative animate-in fade-in slide-in-from-bottom duration-700 ${featured ? 'ring-2 ring-blue-500 scale-105' : ''}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {featured && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <Badge variant="premium">
            Más Popular
          </Badge>
        </div>
      )}

      <CardHeader className="text-center pb-8 pt-8">
        <CardTitle className="text-2xl mb-2">{name}</CardTitle>
        <div className="mt-4">
          <span className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {price}
          </span>
          {period && <span className="text-slate-600 dark:text-slate-400 text-lg">{period}</span>}
        </div>
      </CardHeader>

      <CardContent>
        <ul className="space-y-3 mb-8">
          {features.map((feature, i) => (
            <li key={i} className="flex items-start gap-3">
              <div className="mt-1 h-5 w-5 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center flex-shrink-0">
                <svg className="h-3 w-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-slate-700 dark:text-slate-300">{feature}</span>
            </li>
          ))}
        </ul>

        <Link href="/auth/register" className="block">
          <Button
            variant={featured ? "gradient" : "default"}
            className="w-full"
            size="lg"
          >
            Comenzar Ahora
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}
