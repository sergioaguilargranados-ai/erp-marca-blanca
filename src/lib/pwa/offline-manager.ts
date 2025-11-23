// Gestor de funcionalidad offline usando IndexedDB

const DB_NAME = 'erp-offline-db';
const DB_VERSION = 1;

// Stores de IndexedDB
export const STORES = {
  PENDING_SYNC: 'pending-sync',
  VENTAS_OFFLINE: 'ventas-offline',
  PRODUCTOS_CACHE: 'productos-cache',
  CLIENTES_CACHE: 'clientes-cache',
  INVENTARIO_CACHE: 'inventario-cache',
  CONFIG_CACHE: 'config-cache',
} as const;

// Inicializar IndexedDB
export async function initOfflineDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      // Crear stores si no existen
      if (!db.objectStoreNames.contains(STORES.PENDING_SYNC)) {
        const pendingStore = db.createObjectStore(STORES.PENDING_SYNC, { keyPath: 'id', autoIncrement: true });
        pendingStore.createIndex('timestamp', 'timestamp', { unique: false });
        pendingStore.createIndex('type', 'type', { unique: false });
      }

      if (!db.objectStoreNames.contains(STORES.VENTAS_OFFLINE)) {
        const ventasStore = db.createObjectStore(STORES.VENTAS_OFFLINE, { keyPath: 'id' });
        ventasStore.createIndex('timestamp', 'timestamp', { unique: false });
        ventasStore.createIndex('synced', 'synced', { unique: false });
      }

      if (!db.objectStoreNames.contains(STORES.PRODUCTOS_CACHE)) {
        db.createObjectStore(STORES.PRODUCTOS_CACHE, { keyPath: 'id' });
      }

      if (!db.objectStoreNames.contains(STORES.CLIENTES_CACHE)) {
        db.createObjectStore(STORES.CLIENTES_CACHE, { keyPath: 'id' });
      }

      if (!db.objectStoreNames.contains(STORES.INVENTARIO_CACHE)) {
        db.createObjectStore(STORES.INVENTARIO_CACHE, { keyPath: 'id' });
      }

      if (!db.objectStoreNames.contains(STORES.CONFIG_CACHE)) {
        db.createObjectStore(STORES.CONFIG_CACHE, { keyPath: 'key' });
      }
    };
  });
}

// Clase para gestionar datos offline
export class OfflineManager {
  private db: IDBDatabase | null = null;

  async init() {
    this.db = await initOfflineDB();
    return this;
  }

  // Guardar dato en cache
  async saveToCache<T>(store: string, data: T): Promise<void> {
    if (!this.db) throw new Error('DB not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([store], 'readwrite');
      const objectStore = transaction.objectStore(store);
      const request = objectStore.put(data);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  // Obtener dato de cache
  async getFromCache<T>(store: string, id: string): Promise<T | undefined> {
    if (!this.db) throw new Error('DB not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([store], 'readonly');
      const objectStore = transaction.objectStore(store);
      const request = objectStore.get(id);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  // Obtener todos los datos de un store
  async getAllFromCache<T>(store: string): Promise<T[]> {
    if (!this.db) throw new Error('DB not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([store], 'readonly');
      const objectStore = transaction.objectStore(store);
      const request = objectStore.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  // Eliminar dato de cache
  async deleteFromCache(store: string, id: string): Promise<void> {
    if (!this.db) throw new Error('DB not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([store], 'readwrite');
      const objectStore = transaction.objectStore(store);
      const request = objectStore.delete(id);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  // Limpiar store completo
  async clearCache(store: string): Promise<void> {
    if (!this.db) throw new Error('DB not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([store], 'readwrite');
      const objectStore = transaction.objectStore(store);
      const request = objectStore.clear();

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  // Agregar operación pendiente de sincronización
  async addPendingSync(operation: PendingOperation): Promise<void> {
    const data = {
      ...operation,
      timestamp: Date.now(),
      synced: false,
    };
    await this.saveToCache(STORES.PENDING_SYNC, data);
  }

  // Obtener operaciones pendientes
  async getPendingOperations(): Promise<PendingOperation[]> {
    const all = await this.getAllFromCache<PendingOperation>(STORES.PENDING_SYNC);
    return all.filter(op => !op.synced);
  }

  // Marcar operación como sincronizada
  async markAsSynced(id: number): Promise<void> {
    if (!this.db) throw new Error('DB not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORES.PENDING_SYNC], 'readwrite');
      const objectStore = transaction.objectStore(STORES.PENDING_SYNC);
      const getRequest = objectStore.get(id);

      getRequest.onsuccess = () => {
        const data = getRequest.result;
        if (data) {
          data.synced = true;
          data.syncedAt = Date.now();
          const putRequest = objectStore.put(data);
          putRequest.onsuccess = () => resolve();
          putRequest.onerror = () => reject(putRequest.error);
        } else {
          resolve();
        }
      };
      getRequest.onerror = () => reject(getRequest.error);
    });
  }

  // Guardar venta offline
  async saveOfflineSale(venta: any): Promise<void> {
    const data = {
      ...venta,
      id: `offline-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      synced: false,
    };
    await this.saveToCache(STORES.VENTAS_OFFLINE, data);

    // También agregar a pending sync
    await this.addPendingSync({
      type: 'venta',
      method: 'POST',
      url: '/api/ventas',
      data: venta,
      timestamp: Date.now(),
      synced: false,
    });
  }

  // Sincronizar ventas offline
  async syncOfflineSales(): Promise<{ success: number; failed: number }> {
    const ventas = await this.getAllFromCache<any>(STORES.VENTAS_OFFLINE);
    const pendingVentas = ventas.filter(v => !v.synced);

    let success = 0;
    let failed = 0;

    for (const venta of pendingVentas) {
      try {
        const response = await fetch('/api/ventas', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(venta),
        });

        if (response.ok) {
          venta.synced = true;
          venta.syncedAt = Date.now();
          await this.saveToCache(STORES.VENTAS_OFFLINE, venta);
          success++;
        } else {
          failed++;
        }
      } catch (error) {
        console.error('Error syncing venta:', error);
        failed++;
      }
    }

    return { success, failed };
  }
}

// Tipos
export interface PendingOperation {
  id?: number;
  type: string;
  method: string;
  url: string;
  data: any;
  timestamp: number;
  synced: boolean;
  syncedAt?: number;
}

// Instancia singleton
let offlineManager: OfflineManager | null = null;

export async function getOfflineManager(): Promise<OfflineManager> {
  if (!offlineManager) {
    offlineManager = new OfflineManager();
    await offlineManager.init();
  }
  return offlineManager;
}

// Hook para detectar estado online/offline
export function useOnlineStatus() {
  if (typeof window === 'undefined') return true;

  const [isOnline, setIsOnline] = React.useState(typeof navigator !== 'undefined' ? navigator.onLine : true);

  React.useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      // Intentar sincronizar cuando vuelva la conexión
      syncPendingOperations();
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
}

// Función para sincronizar operaciones pendientes
export async function syncPendingOperations() {
  try {
    const manager = await getOfflineManager();
    const operations = await manager.getPendingOperations();

    console.log(`Syncing ${operations.length} pending operations...`);

    for (const operation of operations) {
      try {
        const response = await fetch(operation.url, {
          method: operation.method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(operation.data),
        });

        if (response.ok && operation.id) {
          await manager.markAsSynced(operation.id);
        }
      } catch (error) {
        console.error('Failed to sync operation:', error);
      }
    }
  } catch (error) {
    console.error('Error syncing pending operations:', error);
  }
}

// Importar React solo si está disponible
import React from 'react';
