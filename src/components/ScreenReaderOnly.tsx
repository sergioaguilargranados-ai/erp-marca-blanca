'use client';

import * as React from 'react';
import { ReactNode } from 'react';

/**
 * Componente para contenido solo visible por lectores de pantalla
 */
export function ScreenReaderOnly({ children }: { children: ReactNode }) {
  return (
    <span className="sr-only">
      {children}
    </span>
  );
}

/**
 * Componente para anunciar cambios de estado a lectores de pantalla
 */
export function ScreenReaderStatus({
  children,
  assertive = false
}: {
  children: ReactNode;
  assertive?: boolean;
}) {
  return (
    <div
      role={assertive ? 'alert' : 'status'}
      aria-live={assertive ? 'assertive' : 'polite'}
      aria-atomic="true"
      className="sr-only"
    >
      {children}
    </div>
  );
}

/**
 * Componente para describir elementos visualmente ocultos
 */
export function VisuallyHidden({
  children,
  focusable = false
}: {
  children: ReactNode;
  focusable?: boolean;
}) {
  return (
    <span
      className={focusable ? 'sr-only-focusable' : 'sr-only'}
      aria-hidden={!focusable}
    >
      {children}
    </span>
  );
}

/**
 * Wrapper para tablas accesibles
 */
export function AccessibleTable({
  caption,
  children
}: {
  caption: string;
  children: ReactNode;
}) {
  return (
    <table role="table">
      <caption className="sr-only">{caption}</caption>
      {children}
    </table>
  );
}

/**
 * Componente para indicadores de carga accesibles
 */
export function AccessibleLoader({
  message = 'Cargando',
  size = 'md'
}: {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      className="flex items-center justify-center gap-2"
    >
      <div className={`animate-spin rounded-full border-b-2 border-current ${sizeClasses[size]}`} />
      <span className="sr-only">{message}</span>
    </div>
  );
}

/**
 * Botón con descripción accesible
 */
export function AccessibleButton({
  children,
  ariaLabel,
  ariaDescribedBy,
  ...props
}: {
  children: ReactNode;
  ariaLabel?: string;
  ariaDescribedBy?: string;
  [key: string]: any;
}) {
  return (
    <button
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
      {...props}
    >
      {children}
    </button>
  );
}

/**
 * Link con descripción del destino
 */
export function AccessibleLink({
  children,
  href,
  external = false,
  ariaLabel,
  ...props
}: {
  children: ReactNode;
  href: string;
  external?: boolean;
  ariaLabel?: string;
  [key: string]: any;
}) {
  return (
    <a
      href={href}
      aria-label={ariaLabel || (external ? `${children} (abre en nueva pestaña)` : undefined)}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      {...props}
    >
      {children}
      {external && (
        <ScreenReaderOnly> (abre en nueva pestaña)</ScreenReaderOnly>
      )}
    </a>
  );
}

/**
 * Breadcrumb navigation accesible
 */
export function AccessibleBreadcrumb({
  items
}: {
  items: Array<{ label: string; href?: string }>;
}) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex items-center gap-2">
        {items.map((item, index) => (
          <li key={index} className="flex items-center gap-2">
            {item.href ? (
              <a href={item.href} aria-current={index === items.length - 1 ? 'page' : undefined}>
                {item.label}
              </a>
            ) : (
              <span aria-current="page">{item.label}</span>
            )}
            {index < items.length - 1 && (
              <span aria-hidden="true">/</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

/**
 * Progress bar accesible
 */
export function AccessibleProgressBar({
  value,
  max = 100,
  label,
}: {
  value: number;
  max?: number;
  label: string;
}) {
  const percentage = Math.round((value / max) * 100);

  return (
    <div
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-label={label}
      className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden"
    >
      <div
        className="h-full bg-blue-600 dark:bg-blue-400 transition-all"
        style={{ width: `${percentage}%` }}
      />
      <ScreenReaderOnly>
        {label}: {percentage}% completado
      </ScreenReaderOnly>
    </div>
  );
}

/**
 * Expandible section accesible
 */
export function AccessibleDisclosure({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
}) {
  const [isOpen, setIsOpen] = React.useState(defaultOpen);
  const contentId = React.useMemo(
    () => `disclosure-${Math.random().toString(36).substr(2, 9)}`,
    []
  );

  return (
    <div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-controls={contentId}
        className="flex items-center justify-between w-full p-4 hover:bg-slate-50 dark:hover:bg-slate-800"
      >
        <span>{title}</span>
        <span aria-hidden="true">{isOpen ? '−' : '+'}</span>
      </button>
      <div
        id={contentId}
        hidden={!isOpen}
        className="p-4"
      >
        {children}
      </div>
    </div>
  );
}
