'use client';

import { useState, useEffect } from 'react';
import { X, Download, Smartphone } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Detectar si ya está instalado
    const isInStandalone = window.matchMedia('(display-mode: standalone)').matches;
    setIsStandalone(isInStandalone);

    // Detectar iOS
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(isIOSDevice);

    // Listener para el evento beforeinstallprompt (Android, Desktop)
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);

      // Verificar si el usuario ya rechazó la instalación anteriormente
      const dismissed = localStorage.getItem('pwa-install-dismissed');
      if (!dismissed) {
        setTimeout(() => setShowPrompt(true), 3000); // Mostrar después de 3 segundos
      }
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      console.log('PWA instalada');
    } else {
      console.log('PWA instalación rechazada');
    }

    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('pwa-install-dismissed', 'true');
    // Guardar por 7 días
    setTimeout(() => {
      localStorage.removeItem('pwa-install-dismissed');
    }, 7 * 24 * 60 * 60 * 1000);
  };

  // No mostrar si ya está instalado o si no hay prompt disponible
  if (isStandalone || (!isIOS && !deferredPrompt) || !showPrompt) {
    return null;
  }

  // Prompt especial para iOS
  if (isIOS) {
    return (
      <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-white dark:bg-slate-800 rounded-lg shadow-2xl border border-slate-200 dark:border-slate-700 p-4 z-50 animate-in slide-in-from-bottom">
        <button
          onClick={handleDismiss}
          className="absolute top-2 right-2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex items-start gap-3">
          <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-lg">
            <Smartphone className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
              Instalar App
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 mb-3">
              Agrega ERP a tu pantalla de inicio para un acceso rápido
            </p>

            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 text-sm">
              <p className="text-blue-900 dark:text-blue-100 font-medium mb-2">
                Para instalar en iOS:
              </p>
              <ol className="text-blue-700 dark:text-blue-300 space-y-1 list-decimal list-inside text-xs">
                <li>Toca el botón de compartir <span className="inline-block">⎙</span></li>
                <li>Selecciona "Agregar a pantalla de inicio"</li>
                <li>Toca "Agregar"</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Prompt para Android y Desktop
  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg shadow-2xl p-4 z-50 animate-in slide-in-from-bottom">
      <button
        onClick={handleDismiss}
        className="absolute top-2 right-2 p-1 text-white/80 hover:text-white"
      >
        <X className="h-4 w-4" />
      </button>

      <div className="flex items-start gap-3 text-white">
        <div className="bg-white/20 p-2 rounded-lg">
          <Download className="h-6 w-6" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold mb-1">
            Instalar ERP como App
          </h3>
          <p className="text-sm text-white/90 mb-3">
            Acceso rápido, modo offline y mejor experiencia
          </p>

          <div className="flex gap-2">
            <button
              onClick={handleInstallClick}
              className="px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 font-medium text-sm transition-colors"
            >
              Instalar
            </button>
            <button
              onClick={handleDismiss}
              className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg font-medium text-sm transition-colors"
            >
              Ahora no
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Hook personalizado para verificar si la app está instalada
export function useIsPWAInstalled() {
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    setIsInstalled(isStandalone);
  }, []);

  return isInstalled;
}

// Componente de notificación de actualización disponible
export function PWAUpdateNotification() {
  const [showUpdate, setShowUpdate] = useState(false);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        setShowUpdate(true);
      });
    }
  }, []);

  const handleUpdate = () => {
    window.location.reload();
  };

  if (!showUpdate) return null;

  return (
    <div className="fixed top-4 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-green-600 rounded-lg shadow-2xl p-4 z-50 animate-in slide-in-from-top">
      <div className="flex items-start gap-3 text-white">
        <div className="bg-white/20 p-2 rounded-lg">
          <Download className="h-5 w-5" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold mb-1">
            Actualización Disponible
          </h3>
          <p className="text-sm text-white/90 mb-3">
            Hay una nueva versión del ERP disponible
          </p>
          <button
            onClick={handleUpdate}
            className="px-4 py-2 bg-white text-green-600 rounded-lg hover:bg-green-50 font-medium text-sm transition-colors"
          >
            Actualizar Ahora
          </button>
        </div>
        <button
          onClick={() => setShowUpdate(false)}
          className="p-1 text-white/80 hover:text-white"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
