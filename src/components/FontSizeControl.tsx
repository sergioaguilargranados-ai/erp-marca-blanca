'use client';

import { useState, useEffect } from 'react';
import { Minus, Plus, RotateCcw } from 'lucide-react';

type FontSize = 'small' | 'normal' | 'large' | 'extra-large';

const FONT_SIZES = {
  small: 14,
  normal: 16,
  large: 18,
  'extra-large': 20,
} as const;

export function FontSizeControl() {
  const [fontSize, setFontSize] = useState<FontSize>('normal');

  useEffect(() => {
    // Load saved font size
    const saved = localStorage.getItem('font-size') as FontSize | null;
    if (saved && saved in FONT_SIZES) {
      setFontSize(saved);
      applyFontSize(saved);
    }
  }, []);

  const applyFontSize = (size: FontSize) => {
    document.documentElement.style.fontSize = `${FONT_SIZES[size]}px`;
    localStorage.setItem('font-size', size);
  };

  const increase = () => {
    const sizes: FontSize[] = ['small', 'normal', 'large', 'extra-large'];
    const currentIndex = sizes.indexOf(fontSize);
    if (currentIndex < sizes.length - 1) {
      const newSize = sizes[currentIndex + 1];
      setFontSize(newSize);
      applyFontSize(newSize);
    }
  };

  const decrease = () => {
    const sizes: FontSize[] = ['small', 'normal', 'large', 'extra-large'];
    const currentIndex = sizes.indexOf(fontSize);
    if (currentIndex > 0) {
      const newSize = sizes[currentIndex - 1];
      setFontSize(newSize);
      applyFontSize(newSize);
    }
  };

  const reset = () => {
    setFontSize('normal');
    applyFontSize('normal');
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={decrease}
        disabled={fontSize === 'small'}
        className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        aria-label="Disminuir tamaño de fuente"
        title="Disminuir tamaño de fuente"
      >
        <Minus className="h-4 w-4" />
      </button>

      <button
        onClick={reset}
        className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        aria-label="Restablecer tamaño de fuente"
        title="Tamaño normal"
      >
        <RotateCcw className="h-4 w-4" />
      </button>

      <button
        onClick={increase}
        disabled={fontSize === 'extra-large'}
        className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        aria-label="Aumentar tamaño de fuente"
        title="Aumentar tamaño de fuente"
      >
        <Plus className="h-4 w-4" />
      </button>

      <span className="sr-only" aria-live="polite">
        Tamaño de fuente actual: {fontSize}
      </span>
    </div>
  );
}

// Componente compacto solo con texto
export function FontSizeControlCompact() {
  const [fontSize, setFontSize] = useState<FontSize>('normal');

  useEffect(() => {
    const saved = localStorage.getItem('font-size') as FontSize | null;
    if (saved && saved in FONT_SIZES) {
      setFontSize(saved);
      applyFontSize(saved);
    }
  }, []);

  const applyFontSize = (size: FontSize) => {
    document.documentElement.style.fontSize = `${FONT_SIZES[size]}px`;
    localStorage.setItem('font-size', size);
  };

  const cycleSize = () => {
    const sizes: FontSize[] = ['small', 'normal', 'large', 'extra-large'];
    const currentIndex = sizes.indexOf(fontSize);
    const nextIndex = (currentIndex + 1) % sizes.length;
    const newSize = sizes[nextIndex];
    setFontSize(newSize);
    applyFontSize(newSize);
  };

  const getSizeLabel = () => {
    switch (fontSize) {
      case 'small': return 'A-';
      case 'normal': return 'A';
      case 'large': return 'A+';
      case 'extra-large': return 'A++';
    }
  };

  return (
    <button
      onClick={cycleSize}
      className="px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors font-semibold"
      aria-label={`Tamaño de fuente: ${fontSize}. Click para cambiar`}
      title="Cambiar tamaño de fuente"
    >
      {getSizeLabel()}
    </button>
  );
}
