// Service Worker para PWA del ERP
const CACHE_NAME = 'erp-v1.0.0';
const RUNTIME_CACHE = 'erp-runtime-v1';
const DATA_CACHE = 'erp-data-v1';

// Assets estáticos para cachear
const STATIC_ASSETS = [
  '/',
  '/offline',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
];

// Rutas que requieren conexión
const NETWORK_ONLY_ROUTES = [
  '/api/auth/',
  '/api/sync/',
];

// Rutas que se cachean primero
const CACHE_FIRST_ROUTES = [
  '/icons/',
  '/images/',
  '/_next/static/',
];

// Install event - cachear assets estáticos
self.addEventListener('install', (event) => {
  console.log('[SW] Installing Service Worker...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - limpiar cachés viejos
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating Service Worker...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME && name !== RUNTIME_CACHE && name !== DATA_CACHE)
          .map((name) => {
            console.log('[SW] Deleting old cache:', name);
            return caches.delete(name);
          })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event - estrategias de caché
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Ignorar requests de chrome-extension y otros protocolos
  if (!url.protocol.startsWith('http')) {
    return;
  }

  // Network only para ciertas rutas
  if (NETWORK_ONLY_ROUTES.some(route => url.pathname.startsWith(route))) {
    event.respondWith(fetch(request));
    return;
  }

  // Cache first para assets estáticos
  if (CACHE_FIRST_ROUTES.some(route => url.pathname.startsWith(route))) {
    event.respondWith(cacheFirst(request));
    return;
  }

  // Network first para API calls
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(networkFirst(request));
    return;
  }

  // Stale while revalidate para páginas
  event.respondWith(staleWhileRevalidate(request));
});

// Estrategia: Cache First
async function cacheFirst(request) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(request);

  if (cached) {
    return cached;
  }

  try {
    const response = await fetch(request);
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    console.error('[SW] Cache first failed:', error);
    return new Response('Offline', { status: 503 });
  }
}

// Estrategia: Network First
async function networkFirst(request) {
  const cache = await caches.open(DATA_CACHE);

  try {
    const response = await fetch(request);
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    console.log('[SW] Network first fallback to cache:', request.url);
    const cached = await cache.match(request);
    if (cached) {
      return cached;
    }

    // Si es una navegación, retornar página offline
    if (request.mode === 'navigate') {
      return caches.match('/offline');
    }

    return new Response(JSON.stringify({ error: 'Offline' }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

// Estrategia: Stale While Revalidate
async function staleWhileRevalidate(request) {
  const cache = await caches.open(RUNTIME_CACHE);
  const cached = await cache.match(request);

  const fetchPromise = fetch(request).then((response) => {
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  });

  return cached || fetchPromise;
}

// Background Sync para operaciones offline
self.addEventListener('sync', (event) => {
  console.log('[SW] Background sync:', event.tag);

  if (event.tag === 'sync-data') {
    event.waitUntil(syncData());
  }
});

async function syncData() {
  try {
    // Obtener datos pendientes de sincronización desde IndexedDB
    const pendingData = await getPendingSync();

    for (const item of pendingData) {
      try {
        await fetch(item.url, {
          method: item.method,
          headers: item.headers,
          body: item.body,
        });

        // Marcar como sincronizado
        await markAsSynced(item.id);
      } catch (error) {
        console.error('[SW] Sync failed for item:', item.id, error);
      }
    }
  } catch (error) {
    console.error('[SW] Sync data failed:', error);
  }
}

// Push notifications
self.addEventListener('push', (event) => {
  console.log('[SW] Push notification received');

  const data = event.data ? event.data.json() : {};
  const options = {
    body: data.body || 'Nueva notificación',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    vibrate: [200, 100, 200],
    data: {
      url: data.url || '/',
    },
    actions: [
      { action: 'open', title: 'Abrir' },
      { action: 'close', title: 'Cerrar' },
    ],
  };

  event.waitUntil(
    self.registration.showNotification(data.title || 'ERP Notification', options)
  );
});

// Notification click
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notification clicked:', event.action);
  event.notification.close();

  if (event.action === 'open' || !event.action) {
    const url = event.notification.data.url || '/';
    event.waitUntil(
      clients.openWindow(url)
    );
  }
});

// Message handling
self.addEventListener('message', (event) => {
  console.log('[SW] Message received:', event.data);

  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  if (event.data && event.data.type === 'CACHE_URLS') {
    event.waitUntil(
      caches.open(RUNTIME_CACHE)
        .then((cache) => cache.addAll(event.data.payload))
    );
  }
});

// Helper functions (simuladas - en producción usar IndexedDB real)
async function getPendingSync() {
  // Aquí iría la lógica real con IndexedDB
  return [];
}

async function markAsSynced(id) {
  // Aquí iría la lógica real con IndexedDB
  console.log('[SW] Marked as synced:', id);
}
