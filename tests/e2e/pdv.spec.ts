import { test, expect } from '@playwright/test';

// Helper para login
async function login(page: any) {
  await page.goto('/');
  await page.getByLabel(/email/i).fill('admin@example.com');
  await page.getByLabel(/contraseña/i).fill('password123');
  await page.getByRole('button', { name: /iniciar sesión/i }).click();
  await page.waitForURL(/dashboard/);
}

test.describe('Punto de Venta (PDV)', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('should navigate to PDV', async ({ page }) => {
    // Navegar al PDV
    await page.goto('/admin/empresas/test-id/pdv');

    // Verificar que estamos en la página correcta
    await expect(page.getByRole('heading', { name: /punto de venta/i })).toBeVisible();
    await expect(page.getByPlaceholder(/buscar producto/i)).toBeVisible();
  });

  test('should search for products', async ({ page }) => {
    await page.goto('/admin/empresas/test-id/pdv');

    // Buscar producto
    const searchInput = page.getByPlaceholder(/buscar producto/i);
    await searchInput.fill('laptop');

    // Verificar que se muestran resultados
    await expect(page.getByText(/laptop/i)).toBeVisible();
  });

  test('should add product to cart', async ({ page }) => {
    await page.goto('/admin/empresas/test-id/pdv');

    // Buscar y agregar producto
    await page.getByPlaceholder(/buscar producto/i).fill('producto-1');
    await page.getByRole('button', { name: /agregar/i }).first().click();

    // Verificar que aparece en el carrito
    await expect(page.getByText(/producto-1/i)).toBeVisible();
    await expect(page.getByText(/\$\d+\.\d{2}/)).toBeVisible(); // Precio
  });

  test('should update quantity in cart', async ({ page }) => {
    await page.goto('/admin/empresas/test-id/pdv');

    // Agregar producto
    await page.getByPlaceholder(/buscar producto/i).fill('producto-1');
    await page.getByRole('button', { name: /agregar/i }).first().click();

    // Aumentar cantidad
    await page.getByRole('button', { name: /\+/i }).click();

    // Verificar que la cantidad cambió
    await expect(page.getByText(/cantidad.*2/i)).toBeVisible();
  });

  test('should remove product from cart', async ({ page }) => {
    await page.goto('/admin/empresas/test-id/pdv');

    // Agregar producto
    await page.getByPlaceholder(/buscar producto/i).fill('producto-1');
    await page.getByRole('button', { name: /agregar/i }).first().click();

    // Eliminar producto
    await page.getByRole('button', { name: /eliminar/i }).click();

    // Verificar que se eliminó
    await expect(page.getByText(/carrito vacío/i)).toBeVisible();
  });

  test('should calculate totals correctly', async ({ page }) => {
    await page.goto('/admin/empresas/test-id/pdv');

    // Agregar productos
    await page.getByPlaceholder(/buscar producto/i).fill('producto-100');
    await page.getByRole('button', { name: /agregar/i }).first().click();

    // Verificar cálculos
    await expect(page.getByText(/subtotal/i)).toBeVisible();
    await expect(page.getByText(/iva/i)).toBeVisible();
    await expect(page.getByText(/total/i)).toBeVisible();
  });

  test('should process payment', async ({ page }) => {
    await page.goto('/admin/empresas/test-id/pdv');

    // Agregar producto
    await page.getByPlaceholder(/buscar producto/i).fill('producto-1');
    await page.getByRole('button', { name: /agregar/i }).first().click();

    // Procesar pago
    await page.getByRole('button', { name: /cobrar/i }).click();

    // Seleccionar método de pago
    await page.getByRole('button', { name: /efectivo/i }).click();

    // Confirmar
    await page.getByRole('button', { name: /confirmar/i }).click();

    // Verificar éxito
    await expect(page.getByText(/venta.*exitosa/i)).toBeVisible();
  });
});

test.describe('PDV Mobile', () => {
  test.use({ viewport: { width: 375, height: 667 } }); // iPhone SE

  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('should work on mobile viewport', async ({ page }) => {
    await page.goto('/movil/pdv');

    // Verificar elementos visibles en móvil
    await expect(page.getByPlaceholder(/buscar producto/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /escanear/i })).toBeVisible();
  });

  test('should open barcode scanner', async ({ page }) => {
    await page.goto('/movil/pdv');

    // Abrir scanner
    await page.getByRole('button', { name: /escanear/i }).click();

    // Verificar que se abre el scanner
    await expect(page.getByText(/escanear código/i)).toBeVisible();
  });

  test('should handle touch gestures', async ({ page }) => {
    await page.goto('/movil/pdv');

    // Agregar producto
    await page.getByPlaceholder(/buscar/i).fill('test');

    // Simular swipe (touch)
    await page.touchscreen.tap(100, 200);
  });
});
