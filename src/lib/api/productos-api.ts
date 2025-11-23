// API Endpoints para integración con E-commerce
// Documentación OpenAPI/Swagger compatible

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  meta?: {
    total?: number;
    page?: number;
    perPage?: number;
    lastSync?: string;
  };
}

export interface ProductoAPI {
  id: string;
  sku: string;
  nombre: string;
  descripcion: string | null;
  precioVenta: number;
  precioCompra: number | null;
  categoria: string | null;
  marca: string | null;
  imagenUrl: string | null;
  activo: boolean;
  inventario: {
    sucursalId: string;
    sucursalNombre: string;
    stock: number;
    stockMinimo: number;
    stockMaximo: number | null;
  }[];
  lastUpdated: string;
}

export interface InventarioAPI {
  productoId: string;
  sku: string;
  nombre: string;
  sucursales: {
    sucursalId: string;
    nombre: string;
    stock: number;
    disponible: boolean;
  }[];
}

export interface PedidoAPI {
  id?: string;
  external_id: string; // ID del e-commerce
  fecha: string;
  cliente: {
    email: string;
    nombre: string;
    telefono?: string;
    direccion?: string;
  };
  items: {
    productoId: string;
    sku: string;
    cantidad: number;
    precio: number;
    subtotal: number;
  }[];
  subtotal: number;
  descuento: number;
  iva: number;
  envio: number;
  total: number;
  metodoPago: string;
  estado: 'pendiente' | 'procesando' | 'completado' | 'cancelado';
  notas?: string;
}

export interface WebhookPayload {
  event: 'order.created' | 'order.updated' | 'order.cancelled' | 'product.updated';
  timestamp: string;
  data: any;
}

/**
 * Cliente API para consumir desde e-commerce
 */
export class EcommerceAPIClient {
  private baseUrl: string;
  private apiKey: string;

  constructor(baseUrl: string, apiKey: string) {
    this.baseUrl = baseUrl;
    this.apiKey = apiKey;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      'X-API-Key': this.apiKey,
      ...options.headers,
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API Request failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  // Obtener todos los productos
  async getProductos(params?: {
    page?: number;
    perPage?: number;
    categoria?: string;
    activo?: boolean;
  }): Promise<ApiResponse<ProductoAPI[]>> {
    const query = new URLSearchParams();
    if (params?.page) query.set('page', params.page.toString());
    if (params?.perPage) query.set('perPage', params.perPage.toString());
    if (params?.categoria) query.set('categoria', params.categoria);
    if (params?.activo !== undefined) query.set('activo', params.activo.toString());

    return this.request<ProductoAPI[]>(`/api/v1/productos?${query}`);
  }

  // Obtener un producto por ID o SKU
  async getProducto(idOrSku: string): Promise<ApiResponse<ProductoAPI>> {
    return this.request<ProductoAPI>(`/api/v1/productos/${idOrSku}`);
  }

  // Obtener inventario de productos
  async getInventario(productoIds?: string[]): Promise<ApiResponse<InventarioAPI[]>> {
    const query = productoIds
      ? `?ids=${productoIds.join(',')}`
      : '';
    return this.request<InventarioAPI[]>(`/api/v1/inventario${query}`);
  }

  // Crear pedido desde e-commerce
  async crearPedido(pedido: PedidoAPI): Promise<ApiResponse<{ id: string }>> {
    return this.request<{ id: string }>('/api/v1/pedidos', {
      method: 'POST',
      body: JSON.stringify(pedido),
    });
  }

  // Obtener estado de pedido
  async getEstadoPedido(pedidoId: string): Promise<ApiResponse<{
    id: string;
    estado: string;
    tracking?: string;
  }>> {
    return this.request(`/api/v1/pedidos/${pedidoId}`);
  }

  // Webhook para recibir eventos del ERP
  async registrarWebhook(url: string, events: string[]): Promise<ApiResponse<{
    webhookId: string;
  }>> {
    return this.request('/api/v1/webhooks', {
      method: 'POST',
      body: JSON.stringify({ url, events }),
    });
  }
}

/**
 * Validador de API Key
 */
export async function validateApiKey(apiKey: string): Promise<{
  valid: boolean;
  empresaId?: string;
  permisos?: string[];
}> {
  // En producción, validar contra la base de datos
  if (!apiKey || apiKey.length < 32) {
    return { valid: false };
  }

  // Simulación - en producción hacer query a BD
  return {
    valid: true,
    empresaId: 'empresa-123',
    permisos: ['read:productos', 'read:inventario', 'write:pedidos'],
  };
}

/**
 * Rate Limiter para API
 */
export class RateLimiter {
  private requests: Map<string, number[]> = new Map();

  isAllowed(apiKey: string, maxRequests: number = 60, windowMs: number = 60000): boolean {
    const now = Date.now();
    const windowStart = now - windowMs;

    // Obtener requests del API key
    const requests = this.requests.get(apiKey) || [];

    // Filtrar requests dentro de la ventana
    const recentRequests = requests.filter(time => time > windowStart);

    if (recentRequests.length >= maxRequests) {
      return false;
    }

    // Agregar request actual
    recentRequests.push(now);
    this.requests.set(apiKey, recentRequests);

    return true;
  }

  cleanup() {
    const now = Date.now();
    const windowStart = now - 60000;

    for (const [key, requests] of this.requests.entries()) {
      const recentRequests = requests.filter(time => time > windowStart);
      if (recentRequests.length === 0) {
        this.requests.delete(key);
      } else {
        this.requests.set(key, recentRequests);
      }
    }
  }
}

// Instancia global del rate limiter
export const rateLimiter = new RateLimiter();

// Limpiar cada minuto
if (typeof setInterval !== 'undefined') {
  setInterval(() => rateLimiter.cleanup(), 60000);
}

/**
 * Tipos para OpenAPI/Swagger
 */
export const API_SCHEMAS = {
  Producto: {
    type: 'object',
    properties: {
      id: { type: 'string' },
      sku: { type: 'string' },
      nombre: { type: 'string' },
      descripcion: { type: 'string', nullable: true },
      precioVenta: { type: 'number', format: 'float' },
      precioCompra: { type: 'number', format: 'float', nullable: true },
      categoria: { type: 'string', nullable: true },
      marca: { type: 'string', nullable: true },
      imagenUrl: { type: 'string', format: 'uri', nullable: true },
      activo: { type: 'boolean' },
      inventario: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            sucursalId: { type: 'string' },
            sucursalNombre: { type: 'string' },
            stock: { type: 'number' },
            stockMinimo: { type: 'number' },
            stockMaximo: { type: 'number', nullable: true },
          },
        },
      },
      lastUpdated: { type: 'string', format: 'date-time' },
    },
  },
  Pedido: {
    type: 'object',
    required: ['external_id', 'cliente', 'items', 'total'],
    properties: {
      external_id: { type: 'string' },
      fecha: { type: 'string', format: 'date-time' },
      cliente: {
        type: 'object',
        required: ['email', 'nombre'],
        properties: {
          email: { type: 'string', format: 'email' },
          nombre: { type: 'string' },
          telefono: { type: 'string' },
          direccion: { type: 'string' },
        },
      },
      items: {
        type: 'array',
        items: {
          type: 'object',
          required: ['productoId', 'cantidad', 'precio'],
          properties: {
            productoId: { type: 'string' },
            sku: { type: 'string' },
            cantidad: { type: 'number' },
            precio: { type: 'number' },
            subtotal: { type: 'number' },
          },
        },
      },
      subtotal: { type: 'number' },
      descuento: { type: 'number' },
      iva: { type: 'number' },
      envio: { type: 'number' },
      total: { type: 'number' },
      metodoPago: { type: 'string' },
      estado: {
        type: 'string',
        enum: ['pendiente', 'procesando', 'completado', 'cancelado'],
      },
      notas: { type: 'string' },
    },
  },
};
