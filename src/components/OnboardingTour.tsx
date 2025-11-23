'use client';

import { useState, useEffect } from 'react';
import { X, ArrowRight, ArrowLeft, Check } from 'lucide-react';

interface OnboardingStep {
  title: string;
  description: string;
  target?: string; // Selector CSS del elemento a resaltar
  position?: 'top' | 'bottom' | 'left' | 'right';
  action?: {
    label: string;
    href: string;
  };
}

const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    title: '¡Bienvenido al ERP!',
    description: 'Te guiaremos por las funciones principales del sistema para que puedas empezar rápidamente.',
  },
  {
    title: 'Panel de Control',
    description: 'Aquí encontrarás un resumen de las métricas más importantes de tu negocio: ventas, inventario y finanzas.',
    target: '#dashboard-stats',
    action: {
      label: 'Ver Dashboard',
      href: '/dashboard',
    },
  },
  {
    title: 'Gestión de Productos',
    description: 'Administra tu catálogo de productos, precios, categorías e inventario desde un solo lugar.',
    target: '#menu-productos',
    action: {
      label: 'Ir a Productos',
      href: '/productos',
    },
  },
  {
    title: 'Punto de Venta',
    description: 'Registra ventas rápidamente con nuestro PDV optimizado. Soporte para múltiples métodos de pago.',
    target: '#menu-pdv',
    action: {
      label: 'Abrir PDV',
      href: '/pdv',
    },
  },
  {
    title: 'Facturación Electrónica',
    description: 'Genera facturas CFDI 4.0 automáticamente con timbrado del SAT integrado.',
    target: '#menu-facturacion',
    action: {
      label: 'Ver Facturas',
      href: '/facturacion',
    },
  },
  {
    title: 'Reportes y Análisis',
    description: 'Accede a reportes detallados de ventas, inventario, rentabilidad y mucho más.',
    target: '#menu-reportes',
    action: {
      label: 'Ver Reportes',
      href: '/reportes',
    },
  },
  {
    title: '¡Todo Listo!',
    description: 'Ya conoces las funciones principales. Explora el sistema y descubre todas las herramientas disponibles.',
  },
];

export function OnboardingTour() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    // Verificar si el usuario ya completó el onboarding
    const hasCompleted = localStorage.getItem('onboarding-completed');
    if (!hasCompleted) {
      // Mostrar después de 2 segundos
      setTimeout(() => setIsOpen(true), 2000);
    }
  }, []);

  const handleNext = () => {
    if (currentStep < ONBOARDING_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    setCompleted(true);
    localStorage.setItem('onboarding-completed', 'true');
    setTimeout(() => {
      setIsOpen(false);
    }, 1500);
  };

  const handleSkip = () => {
    setIsOpen(false);
    localStorage.setItem('onboarding-completed', 'true');
  };

  if (!isOpen) return null;

  const step = ONBOARDING_STEPS[currentStep];
  const progress = ((currentStep + 1) / ONBOARDING_STEPS.length) * 100;

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50 z-40 animate-in fade-in" />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden animate-in zoom-in-95">
          {/* Header */}
          <div className="relative bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
            <button
              onClick={handleSkip}
              className="absolute top-4 right-4 p-1 text-white/80 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>

            {completed ? (
              <div className="text-center py-4">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500 rounded-full mb-4">
                  <Check className="h-8 w-8" />
                </div>
                <h2 className="text-2xl font-bold">¡Completado!</h2>
              </div>
            ) : (
              <>
                <div className="mb-4">
                  <div className="flex items-center justify-between text-sm text-white/80 mb-2">
                    <span>Paso {currentStep + 1} de {ONBOARDING_STEPS.length}</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-white transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                <h2 className="text-2xl font-bold">{step.title}</h2>
              </>
            )}
          </div>

          {/* Content */}
          <div className="p-8">
            {!completed ? (
              <>
                <p className="text-slate-600 dark:text-slate-300 text-lg mb-6">
                  {step.description}
                </p>

                {step.action && (
                  <a
                    href={step.action.href}
                    className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
                  >
                    {step.action.label}
                    <ArrowRight className="h-4 w-4" />
                  </a>
                )}

                {currentStep === 0 && (
                  <div className="mt-6 grid grid-cols-3 gap-4 text-center">
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                        99
                      </div>
                      <div className="text-sm text-slate-600 dark:text-slate-400">
                        Sucursales
                      </div>
                    </div>
                    <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-1">
                        ∞
                      </div>
                      <div className="text-sm text-slate-600 dark:text-slate-400">
                        Productos
                      </div>
                    </div>
                    <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-1">
                        24/7
                      </div>
                      <div className="text-sm text-slate-600 dark:text-slate-400">
                        Disponible
                      </div>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-4">
                <p className="text-slate-600 dark:text-slate-300 text-lg">
                  Ya estás listo para aprovechar todas las funcionalidades del ERP.
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          {!completed && (
            <div className="flex items-center justify-between px-8 py-4 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-700">
              <button
                onClick={handleSkip}
                className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 font-medium"
              >
                Saltar Tour
              </button>

              <div className="flex gap-2">
                {currentStep > 0 && (
                  <button
                    onClick={handlePrevious}
                    className="inline-flex items-center gap-2 px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 font-medium"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Anterior
                  </button>
                )}

                <button
                  onClick={handleNext}
                  className="inline-flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                >
                  {currentStep === ONBOARDING_STEPS.length - 1 ? 'Finalizar' : 'Siguiente'}
                  {currentStep < ONBOARDING_STEPS.length - 1 && <ArrowRight className="h-4 w-4" />}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

// Hook para reiniciar el onboarding
export function useResetOnboarding() {
  return () => {
    localStorage.removeItem('onboarding-completed');
    window.location.reload();
  };
}
