'use client';

import { useState, useEffect, useRef } from 'react';
import { Camera, X, Zap, ZapOff, RefreshCw } from 'lucide-react';

interface BarcodeScannerProps {
  onScan: (barcode: string) => void;
  onClose: () => void;
  isOpen: boolean;
}

export function BarcodeScanner({ onScan, onClose, isOpen }: BarcodeScannerProps) {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [torch, setTorch] = useState(false);
  const [error, setError] = useState<string>('');
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scanIntervalRef = useRef<number | null>(null);

  // Solicitar permisos y abrir cámara
  useEffect(() => {
    if (!isOpen) {
      stopCamera();
      return;
    }

    startCamera();

    return () => {
      stopCamera();
    };
  }, [isOpen]);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment', // Cámara trasera
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      });

      setStream(mediaStream);
      setHasPermission(true);
      setError('');

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play();
      }

      // Iniciar escaneo continuo
      startScanning();
    } catch (err) {
      console.error('Error accessing camera:', err);
      setHasPermission(false);
      setError('No se pudo acceder a la cámara. Verifica los permisos.');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current);
      scanIntervalRef.current = null;
    }
  };

  const startScanning = () => {
    // Escanear cada 500ms
    scanIntervalRef.current = window.setInterval(() => {
      scanFrame();
    }, 500);
  };

  const scanFrame = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (!ctx || video.readyState !== video.HAVE_ENOUGH_DATA) return;

    // Configurar canvas
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Dibujar frame actual
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Obtener datos de imagen
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    // Aquí iría la lógica de detección de código de barras
    // Por ahora, simulamos la detección con un input manual como fallback
    // En producción, usar una librería como 'quagga' o 'zxing-js'

    // Simulación: detectar códigos en el centro de la imagen
    // detectBarcodeFromImageData(imageData);
  };

  const toggleTorch = async () => {
    if (!stream) return;

    const videoTrack = stream.getVideoTracks()[0];
    const capabilities = videoTrack.getCapabilities() as any;

    if (capabilities.torch) {
      try {
        await videoTrack.applyConstraints({
          advanced: [{ torch: !torch } as any],
        });
        setTorch(!torch);
      } catch (err) {
        console.error('Error toggling torch:', err);
      }
    }
  };

  const switchCamera = async () => {
    stopCamera();
    // Aquí se podría implementar cambio entre cámaras
    startCamera();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/80 to-transparent p-4">
        <div className="flex items-center justify-between text-white">
          <h2 className="text-lg font-semibold">Escanear Código de Barras</h2>
          <div className="flex items-center gap-2">
            {stream && (
              <>
                <button
                  onClick={toggleTorch}
                  className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                  aria-label={torch ? 'Apagar flash' : 'Encender flash'}
                >
                  {torch ? <Zap className="h-5 w-5" /> : <ZapOff className="h-5 w-5" />}
                </button>
                <button
                  onClick={switchCamera}
                  className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                  aria-label="Cambiar cámara"
                >
                  <RefreshCw className="h-5 w-5" />
                </button>
              </>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
              aria-label="Cerrar"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Video Preview */}
      <div className="relative w-full h-full flex items-center justify-center">
        {hasPermission === false ? (
          <div className="text-center text-white p-6">
            <Camera className="h-16 w-16 mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-semibold mb-2">Permiso Denegado</h3>
            <p className="text-white/80 mb-4">{error}</p>
            <button
              onClick={startCamera}
              className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Intentar de Nuevo
            </button>
          </div>
        ) : hasPermission === null ? (
          <div className="text-center text-white p-6">
            <div className="animate-spin h-8 w-8 border-4 border-white border-t-transparent rounded-full mx-auto mb-4" />
            <p>Iniciando cámara...</p>
          </div>
        ) : (
          <>
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              playsInline
              muted
            />
            <canvas ref={canvasRef} className="hidden" />

            {/* Overlay de guía de escaneo */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="relative w-72 h-48">
                {/* Marco de escaneo */}
                <div className="absolute inset-0 border-2 border-white rounded-lg">
                  {/* Esquinas */}
                  <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-blue-500 rounded-tl-lg" />
                  <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-blue-500 rounded-tr-lg" />
                  <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-blue-500 rounded-bl-lg" />
                  <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-blue-500 rounded-br-lg" />

                  {/* Línea de escaneo animada */}
                  <div className="absolute left-0 right-0 h-0.5 bg-blue-500 animate-scan" />
                </div>

                {/* Texto de instrucción */}
                <p className="absolute -bottom-12 left-0 right-0 text-center text-white text-sm">
                  Coloca el código de barras dentro del marco
                </p>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Fallback manual input */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
        <div className="max-w-md mx-auto">
          <label className="block text-white text-sm mb-2">
            O ingresa el código manualmente:
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Código de barras"
              className="flex-1 px-4 py-3 rounded-lg bg-white/10 backdrop-blur text-white placeholder-white/50 border border-white/20 focus:outline-none focus:border-blue-500"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && e.currentTarget.value) {
                  onScan(e.currentTarget.value);
                  e.currentTarget.value = '';
                }
              }}
            />
            <button
              onClick={(e) => {
                const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                if (input && input.value) {
                  onScan(input.value);
                  input.value = '';
                }
              }}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Buscar
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes scan {
          0%, 100% {
            top: 0;
          }
          50% {
            top: 100%;
          }
        }
        .animate-scan {
          animation: scan 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

// Hook para usar el scanner
export function useBarcodeScanner() {
  const [isScanning, setIsScanning] = useState(false);

  const openScanner = () => setIsScanning(true);
  const closeScanner = () => setIsScanning(false);

  return {
    isScanning,
    openScanner,
    closeScanner,
  };
}
