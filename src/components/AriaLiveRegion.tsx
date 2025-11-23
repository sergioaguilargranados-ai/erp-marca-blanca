'use client';

import * as React from 'react';
import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

type AriaLivePoliteness = 'polite' | 'assertive' | 'off';

interface Announcement {
  id: string;
  message: string;
  politeness: AriaLivePoliteness;
}

interface AriaLiveContextType {
  announce: (message: string, politeness?: AriaLivePoliteness) => void;
}

const AriaLiveContext = createContext<AriaLiveContextType | undefined>(undefined);

export function AriaLiveProvider({ children }: { children: ReactNode }) {
  const [politeAnnouncements, setPoliteAnnouncements] = useState<Announcement[]>([]);
  const [assertiveAnnouncements, setAssertiveAnnouncements] = useState<Announcement[]>([]);

  const announce = useCallback((message: string, politeness: AriaLivePoliteness = 'polite') => {
    const announcement: Announcement = {
      id: `${Date.now()}-${Math.random()}`,
      message,
      politeness,
    };

    if (politeness === 'assertive') {
      setAssertiveAnnouncements(prev => [...prev, announcement]);
      // Remove after screen reader has time to read it
      setTimeout(() => {
        setAssertiveAnnouncements(prev => prev.filter(a => a.id !== announcement.id));
      }, 1000);
    } else if (politeness === 'polite') {
      setPoliteAnnouncements(prev => [...prev, announcement]);
      setTimeout(() => {
        setPoliteAnnouncements(prev => prev.filter(a => a.id !== announcement.id));
      }, 1000);
    }
  }, []);

  return (
    <AriaLiveContext.Provider value={{ announce }}>
      {children}

      {/* Polite announcements */}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {politeAnnouncements.map(announcement => (
          <div key={announcement.id}>{announcement.message}</div>
        ))}
      </div>

      {/* Assertive announcements */}
      <div
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
        className="sr-only"
      >
        {assertiveAnnouncements.map(announcement => (
          <div key={announcement.id}>{announcement.message}</div>
        ))}
      </div>
    </AriaLiveContext.Provider>
  );
}

export function useAriaLive() {
  const context = useContext(AriaLiveContext);
  if (!context) {
    throw new Error('useAriaLive must be used within AriaLiveProvider');
  }
  return context;
}

// Hook para anuncios comunes
export function useAccessibilityAnnouncements() {
  const { announce } = useAriaLive();

  return {
    announceSuccess: (message: string) => announce(`Éxito: ${message}`, 'polite'),
    announceError: (message: string) => announce(`Error: ${message}`, 'assertive'),
    announceWarning: (message: string) => announce(`Advertencia: ${message}`, 'polite'),
    announceInfo: (message: string) => announce(message, 'polite'),
    announceLoading: (message: string) => announce(`Cargando: ${message}`, 'polite'),
    announceLoadingComplete: (message: string) => announce(`Completado: ${message}`, 'polite'),
  };
}

// Componente de ejemplo de uso
export function AccessibleNotification({
  message,
  type = 'info'
}: {
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
}) {
  const announcements = useAccessibilityAnnouncements();

  // Announce on mount
  React.useEffect(() => {
    switch (type) {
      case 'success':
        announcements.announceSuccess(message);
        break;
      case 'error':
        announcements.announceError(message);
        break;
      case 'warning':
        announcements.announceWarning(message);
        break;
      default:
        announcements.announceInfo(message);
    }
  }, [message, type, announcements]);

  return null; // This component only announces, doesn't render
}
