# 📘 Documentación de API - ERP Marca Blanca

## Visión General

La API REST del ERP permite integración con sistemas externos como tiendas en línea, aplicaciones móviles y servicios de terceros.

**Base URL:** `https://tu-dominio.com/api/v1`
**Autenticación:** API Key via header `X-API-Key` o `Authorization: Bearer {key}`
**Formato:** JSON
**Versionado:** v1 (actual)

---

## 🔐 Autenticación

### Obtener API Key

1. Iniciar sesión como administrador
2. Ir a **Configuración** > **API** > **Claves API**
3. Crear nueva clave con permisos específicos
4. Copiar la clave (solo se muestra una vez)

### Usar API Key

```bash
# Via header X-API-Key
curl -H "X-API-Key: tu-api-key-aqui" \
  https://tu-dominio.com/api/v1/productos

# Via Authorization Bearer
curl -H "Authorization: Bearer tu-api-key-aqui" \
  https://tu-dominio.com/api/v1/productos
```

### Rate Limiting

- **Límite:** 60 requests por minuto por API key
- **Headers de respuesta:**
  - `X-RateLimit-Limit: 60`
  - `X-RateLimit-Remaining: 45`
  - `X-RateLimit-Reset: 1638360000`

- **Error 429:** Rate limit excedido
```json
{
  "success": false,
  "error": "Rate limit excedido. Máximo 60 requests por minuto"
}
```

---

## 📦 Productos

### Listar Productos

```
GET /api/v1/productos
```

**Query Parameters:**

| Parámetro | Tipo | Descripción | Default |
|-----------|------|-------------|---------|
| `page` | integer | Número de página | 1 |
| `perPage` | integer | Items por página (max: 100) | 50 |
| `categoria` | string | Filtrar por ID de categoría | - |
| `activo` | boolean | Filtrar por estado activo/inactivo | - |
| `search` | string | Búsqueda por nombre o SKU | - |

**Ejemplo de Request:**

```bash
curl -H "X-API-Key: tu-api-key" \
  "https://tu-dominio.com/api/v1/productos?page=1&perPage=20&activo=true"
```

**Respuesta Exitosa (200):**

```json
{
  "success": true,
  "data": [
    {
      "id": "prod-123",
      "sku": "PROD-001",
      "nombre": "Producto Ejemplo",
      "descripcion": "Descripción del producto",
      "precioVenta": 99.99,
      "precioCompra": 50.00,
      "categoria": "Electrónica",
      "marca": "MarcaX",
      "imagenUrl": "https://cdn.example.com/imagen.jpg",
      "activo": true,
      "inventario": [
        {
          "sucursalId": "suc-1",
          "sucursalNombre": "Sucursal Centro",
          "stock": 150,
          "stockMinimo": 10,
          "stockMaximo": 500
        }
      ],
      "lastUpdated": "2025-11-23T10:30:00Z"
    }
  ],
  "meta": {
    "total": 245,
    "page": 1,
    "perPage": 20,
    "lastSync": "2025-11-23T10:35:00Z"
  }
}
```

### Obtener Producto Individual

```
GET /api/v1/productos/:id
```

**Parámetros de URL:**
- `:id` - ID del producto o SKU

**Ejemplo:**

```bash
curl -H "X-API-Key: tu-api-key" \
  https://tu-dominio.com/api/v1/productos/PROD-001
```

**Respuesta (200):**

```json
{
  "success": true,
  "data": {
    "id": "prod-123",
    "sku": "PROD-001",
    "nombre": "Producto Ejemplo",
    // ... resto de campos
  }
}
```

---

## 📊 Inventario

### Consultar Inventario

```
GET /api/v1/inventario
```

**Query Parameters:**

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `ids` | string | IDs de productos separados por coma |
| `sucursalId` | string | Filtrar por sucursal específica |

**Ejemplo:**

```bash
curl -H "X-API-Key: tu-api-key" \
  "https://tu-dominio.com/api/v1/inventario?ids=prod-1,prod-2,prod-3"
```

**Respuesta (200):**

```json
{
  "success": true,
  "data": [
    {
      "productoId": "prod-1",
      "sku": "PROD-001",
      "nombre": "Producto 1",
      "sucursales": [
        {
          "sucursalId": "suc-1",
          "nombre": "Centro",
          "stock": 45,
          "disponible": true
        },
        {
          "sucursalId": "suc-2",
          "nombre": "Norte",
          "stock": 12,
          "disponible": true
        }
      ]
    }
  ]
}
```

---

## 🛒 Pedidos

### Crear Pedido

```
POST /api/v1/pedidos
```

**Request Body:**

```json
{
  "external_id": "order-ecommerce-123",
  "fecha": "2025-11-23T10:30:00Z",
  "cliente": {
    "email": "cliente@example.com",
    "nombre": "Juan Pérez",
    "telefono": "+52 555 1234567",
    "direccion": "Calle Principal 123, Ciudad"
  },
  "items": [
    {
      "productoId": "prod-1",
      "sku": "PROD-001",
      "cantidad": 2,
      "precio": 99.99,
      "subtotal": 199.98
    },
    {
      "productoId": "prod-2",
      "sku": "PROD-002",
      "cantidad": 1,
      "precio": 149.99,
      "subtotal": 149.99
    }
  ],
  "subtotal": 349.97,
  "descuento": 35.00,
  "iva": 50.40,
  "envio": 100.00,
  "total": 465.37,
  "metodoPago": "tarjeta",
  "estado": "pendiente",
  "notas": "Entregar en horario de oficina"
}
```

**Respuesta (201):**

```json
{
  "success": true,
  "data": {
    "id": "pedido-internal-456",
    "external_id": "order-ecommerce-123",
    "folio": "PED-2025-001234",
    "estado": "procesando",
    "createdAt": "2025-11-23T10:35:00Z"
  }
}
```

### Consultar Estado de Pedido

```
GET /api/v1/pedidos/:id
```

**Respuesta (200):**

```json
{
  "success": true,
  "data": {
    "id": "pedido-internal-456",
    "external_id": "order-ecommerce-123",
    "folio": "PED-2025-001234",
    "estado": "completado",
    "tracking": "TRACK-123456789",
    "fechaEntrega": "2025-11-25T14:00:00Z"
  }
}
```

---

## 🔔 Webhooks

### Registrar Webhook

```
POST /api/v1/webhooks
```

**Request Body:**

```json
{
  "url": "https://mi-ecommerce.com/webhooks/erp",
  "events": [
    "product.updated",
    "inventory.low",
    "order.status_changed"
  ]
}
```

**Respuesta (201):**

```json
{
  "success": true,
  "data": {
    "webhookId": "webhook-789",
    "url": "https://mi-ecommerce.com/webhooks/erp",
    "events": ["product.updated", "inventory.low", "order.status_changed"],
    "secret": "whsec_abc123def456",
    "activo": true
  }
}
```

### Eventos Disponibles

| Evento | Descripción |
|--------|-------------|
| `product.created` | Producto creado |
| `product.updated` | Producto actualizado |
| `product.deleted` | Producto eliminado |
| `inventory.updated` | Inventario actualizado |
| `inventory.low` | Stock bajo |
| `order.created` | Pedido creado |
| `order.updated` | Pedido actualizado |
| `order.status_changed` | Estado de pedido cambió |

### Formato del Payload

```json
{
  "event": "product.updated",
  "timestamp": "2025-11-23T10:40:00Z",
  "data": {
    "id": "prod-123",
    "sku": "PROD-001",
    "changes": {
      "precio": {
        "old": 99.99,
        "new": 89.99
      }
    }
  }
}
```

### Verificar Webhooks

Cada webhook incluye un header `X-Webhook-Signature` con HMAC SHA256:

```javascript
const crypto = require('crypto');

function verifyWebhook(payload, signature, secret) {
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(JSON.stringify(payload))
    .digest('hex');

  return signature === expectedSignature;
}
```

---

## 🔍 Errores

### Códigos de Estado HTTP

| Código | Significado |
|--------|-------------|
| 200 | OK - Request exitoso |
| 201 | Created - Recurso creado |
| 400 | Bad Request - Datos inválidos |
| 401 | Unauthorized - API key inválida o faltante |
| 403 | Forbidden - Sin permisos |
| 404 | Not Found - Recurso no encontrado |
| 429 | Too Many Requests - Rate limit excedido |
| 500 | Internal Server Error - Error del servidor |

### Formato de Error

```json
{
  "success": false,
  "error": "Descripción del error",
  "code": "ERROR_CODE",
  "details": {
    "field": "nombre",
    "message": "El campo nombre es requerido"
  }
}
```

---

## 💡 Ejemplos de Integración

### JavaScript/Node.js

```javascript
const ERP_API_URL = 'https://tu-dominio.com/api/v1';
const API_KEY = 'tu-api-key';

// Obtener productos
async function getProductos() {
  const response = await fetch(`${ERP_API_URL}/productos`, {
    headers: {
      'X-API-Key': API_KEY,
    },
  });

  const data = await response.json();
  return data;
}

// Crear pedido
async function crearPedido(pedido) {
  const response = await fetch(`${ERP_API_URL}/pedidos`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': API_KEY,
    },
    body: JSON.stringify(pedido),
  });

  return await response.json();
}
```

### PHP

```php
<?php
$apiUrl = 'https://tu-dominio.com/api/v1';
$apiKey = 'tu-api-key';

// Obtener productos
function getProductos($apiUrl, $apiKey) {
  $ch = curl_init("$apiUrl/productos");
  curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "X-API-Key: $apiKey"
  ]);
  curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

  $response = curl_exec($ch);
  curl_close($ch);

  return json_decode($response, true);
}

// Crear pedido
function crearPedido($apiUrl, $apiKey, $pedido) {
  $ch = curl_init("$apiUrl/pedidos");
  curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Content-Type: application/json",
    "X-API-Key: $apiKey"
  ]);
  curl_setopt($ch, CURLOPT_POST, true);
  curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($pedido));
  curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

  $response = curl_exec($ch);
  curl_close($ch);

  return json_decode($response, true);
}
?>
```

### Python

```python
import requests

ERP_API_URL = 'https://tu-dominio.com/api/v1'
API_KEY = 'tu-api-key'

# Obtener productos
def get_productos():
    response = requests.get(
        f'{ERP_API_URL}/productos',
        headers={'X-API-Key': API_KEY}
    )
    return response.json()

# Crear pedido
def crear_pedido(pedido):
    response = requests.post(
        f'{ERP_API_URL}/pedidos',
        headers={
            'Content-Type': 'application/json',
            'X-API-Key': API_KEY
        },
        json=pedido
    )
    return response.json()
```

---

## 📝 Changelog de API

### v1.0.0 (2025-11-23)
- ✅ Endpoints de productos (GET)
- ✅ Endpoints de inventario (GET)
- ✅ Endpoints de pedidos (POST, GET)
- ✅ Sistema de webhooks
- ✅ Autenticación con API Keys
- ✅ Rate limiting
- ✅ Documentación completa

### Próximas Versiones

**v1.1.0 (Q1 2026)**
- 🔄 Actualización de productos (PUT/PATCH)
- 🔄 Endpoints de clientes
- 🔄 Endpoints de facturas
- 🔄 GraphQL API alternativa

---

## 🆘 Soporte

- **Email:** api@tudominio.com
- **Documentación:** https://docs.tudominio.com/api
- **Status:** https://status.tudominio.com

---

**Versión API:** v1.0.0
**Última actualización:** Noviembre 23, 2025
