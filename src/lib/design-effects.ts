/**
 * Sistema de Efectos Visuales Modernos
 * Utilidades para crear interfaces atractivas y modernas
 */

// Glassmorphism - Efecto de vidrio moderno
export const glassEffect = {
  light: 'backdrop-blur-xl bg-white/70 border border-white/20 shadow-xl',
  dark: 'backdrop-blur-xl bg-slate-900/70 dark:bg-slate-800/70 border border-white/10 shadow-2xl',
  card: 'backdrop-blur-md bg-white/80 dark:bg-slate-900/80 border border-slate-200/50 dark:border-slate-700/50',
  navbar: 'backdrop-blur-lg bg-white/90 dark:bg-slate-900/90 border-b border-slate-200/50 dark:border-slate-700/50',
  sidebar: 'backdrop-blur-lg bg-white/95 dark:bg-slate-900/95 border-r border-slate-200/50 dark:border-slate-700/50',
};

// Gradientes modernos
export const gradients = {
  primary: 'bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700',
  success: 'bg-gradient-to-br from-green-500 via-green-600 to-emerald-700',
  warning: 'bg-gradient-to-br from-orange-500 via-orange-600 to-red-600',
  danger: 'bg-gradient-to-br from-red-500 via-red-600 to-rose-700',
  info: 'bg-gradient-to-br from-cyan-500 via-blue-500 to-indigo-600',
  purple: 'bg-gradient-to-br from-purple-500 via-purple-600 to-pink-600',
  dark: 'bg-gradient-to-br from-slate-800 via-slate-900 to-black',
  light: 'bg-gradient-to-br from-slate-50 via-white to-slate-100',
  rainbow: 'bg-gradient-to-r from-violet-500 via-purple-500 to-pink-500',
  sunset: 'bg-gradient-to-br from-orange-400 via-pink-500 to-purple-600',
  ocean: 'bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-600',
  forest: 'bg-gradient-to-br from-green-400 via-emerald-500 to-teal-600',
};

// Gradientes de texto
export const textGradients = {
  primary: 'bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent',
  success: 'bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent',
  rainbow: 'bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 bg-clip-text text-transparent',
  sunset: 'bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 bg-clip-text text-transparent',
  gold: 'bg-gradient-to-r from-yellow-500 via-amber-500 to-orange-500 bg-clip-text text-transparent',
};

// Sombras modernas
export const shadows = {
  sm: 'shadow-sm hover:shadow-md transition-shadow',
  md: 'shadow-md hover:shadow-lg transition-shadow',
  lg: 'shadow-lg hover:shadow-xl transition-shadow',
  xl: 'shadow-xl hover:shadow-2xl transition-shadow',
  '2xl': 'shadow-2xl hover:shadow-3xl transition-shadow',
  colored: {
    blue: 'shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40',
    green: 'shadow-lg shadow-green-500/20 hover:shadow-green-500/40',
    purple: 'shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40',
    pink: 'shadow-lg shadow-pink-500/20 hover:shadow-pink-500/40',
    orange: 'shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40',
  },
  glow: 'shadow-2xl shadow-current/20',
};

// Efectos de hover
export const hoverEffects = {
  scale: 'hover:scale-105 transition-transform duration-200',
  scaleDown: 'hover:scale-95 active:scale-90 transition-transform duration-200',
  lift: 'hover:-translate-y-1 transition-transform duration-200',
  glow: 'hover:shadow-2xl hover:shadow-current/20 transition-shadow duration-300',
  brightness: 'hover:brightness-110 transition-all duration-200',
  rotate: 'hover:rotate-2 transition-transform duration-200',
  slideRight: 'hover:translate-x-1 transition-transform duration-200',
};

// Animaciones
export const animations = {
  fadeIn: 'animate-in fade-in duration-500',
  fadeOut: 'animate-out fade-out duration-300',
  slideIn: 'animate-in slide-in-from-bottom duration-500',
  slideInLeft: 'animate-in slide-in-from-left duration-500',
  slideInRight: 'animate-in slide-in-from-right duration-500',
  zoomIn: 'animate-in zoom-in duration-300',
  spin: 'animate-spin',
  pulse: 'animate-pulse',
  bounce: 'animate-bounce',
};

// Efectos de card modernos
export const cardEffects = {
  glass: `${glassEffect.card} ${shadows.lg} ${hoverEffects.lift}`,
  gradient: `${gradients.primary} text-white ${shadows.xl} ${hoverEffects.scale}`,
  elevated: `bg-white dark:bg-slate-800 ${shadows.xl} ${hoverEffects.lift} border border-slate-200 dark:border-slate-700`,
  flat: `bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 ${hoverEffects.scale}`,
  premium: `${glassEffect.card} ${shadows.colored.blue} ${hoverEffects.lift} hover:border-blue-400 dark:hover:border-blue-600`,
};

// Efectos de botones premium
export const buttonEffects = {
  primary: `${gradients.primary} text-white ${shadows.colored.blue} ${hoverEffects.scaleDown} font-semibold`,
  success: `${gradients.success} text-white ${shadows.colored.green} ${hoverEffects.scaleDown} font-semibold`,
  danger: `${gradients.danger} text-white ${shadows.colored.pink} ${hoverEffects.scaleDown} font-semibold`,
  glass: `${glassEffect.light} ${hoverEffects.scaleDown} font-medium`,
  outline: `border-2 border-current ${hoverEffects.scaleDown} font-medium hover:bg-current/10`,
  ghost: `${hoverEffects.scaleDown} hover:bg-slate-100 dark:hover:bg-slate-800`,
};

// Badges y pills modernos
export const badgeEffects = {
  gradient: {
    blue: `${gradients.primary} text-white px-3 py-1 rounded-full text-xs font-semibold ${shadows.sm}`,
    green: `${gradients.success} text-white px-3 py-1 rounded-full text-xs font-semibold ${shadows.sm}`,
    purple: `${gradients.purple} text-white px-3 py-1 rounded-full text-xs font-semibold ${shadows.sm}`,
  },
  glass: `${glassEffect.light} px-3 py-1 rounded-full text-xs font-semibold`,
  solid: 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-3 py-1 rounded-full text-xs font-bold',
};

// Efectos de borde
export const borderEffects = {
  gradient: 'border-2 border-transparent bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-border',
  glow: 'border border-blue-500/50 shadow-[0_0_10px_rgba(59,130,246,0.3)]',
  animated: 'border-2 border-blue-500 animate-pulse',
};

// Fondos animados
export const animatedBackgrounds = {
  gradient: 'bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-slate-900 dark:via-purple-900/20 dark:to-slate-900',
  mesh: 'bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-100 via-purple-50 to-pink-100 dark:from-slate-900 dark:via-purple-900/10 dark:to-slate-900',
  dots: 'bg-[radial-gradient(circle_at_1px_1px,_rgb(0_0_0_/_0.05)_1px,_transparent_0)] bg-[size:40px_40px]',
};

// Efectos de input modernos
export const inputEffects = {
  default: 'border-2 border-slate-200 dark:border-slate-700 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all',
  glass: `${glassEffect.light} focus:border-blue-400 focus:ring-4 focus:ring-blue-500/20 transition-all`,
  gradient: 'border-2 border-transparent bg-gradient-to-r from-blue-500/20 to-purple-600/20 focus:from-blue-500 focus:to-purple-600',
};

// Utilidad para combinar efectos
export function combineEffects(...effects: string[]): string {
  return effects.join(' ');
}

// Función helper para crear cards premium
export function createPremiumCard(variant: 'glass' | 'gradient' | 'elevated' | 'premium' = 'glass') {
  return cardEffects[variant];
}

// Función helper para crear botones premium
export function createPremiumButton(variant: 'primary' | 'success' | 'danger' | 'glass' | 'outline' = 'primary') {
  return buttonEffects[variant];
}
