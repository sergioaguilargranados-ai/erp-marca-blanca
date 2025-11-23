import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('should display login page', async ({ page }) => {
    await page.goto('/');

    // Verificar que la página de login se muestra
    await expect(page).toHaveTitle(/ERP/i);
    await expect(page.getByRole('heading', { name: /iniciar sesión/i })).toBeVisible();
  });

  test('should show validation errors for empty login', async ({ page }) => {
    await page.goto('/');

    // Intentar login sin credenciales
    await page.getByRole('button', { name: /iniciar sesión/i }).click();

    // Verificar mensajes de error
    await expect(page.getByText(/email.*requerido/i)).toBeVisible();
    await expect(page.getByText(/contraseña.*requerida/i)).toBeVisible();
  });

  test('should show error for invalid credentials', async ({ page }) => {
    await page.goto('/');

    // Llenar formulario con credenciales inválidas
    await page.getByLabel(/email/i).fill('invalid@example.com');
    await page.getByLabel(/contraseña/i).fill('wrongpassword');
    await page.getByRole('button', { name: /iniciar sesión/i }).click();

    // Verificar mensaje de error
    await expect(page.getByText(/credenciales inválidas/i)).toBeVisible();
  });

  test('should login successfully with valid credentials', async ({ page }) => {
    await page.goto('/');

    // Llenar formulario con credenciales válidas (ajustar según datos seed)
    await page.getByLabel(/email/i).fill('admin@example.com');
    await page.getByLabel(/contraseña/i).fill('password123');
    await page.getByRole('button', { name: /iniciar sesión/i }).click();

    // Verificar redirección al dashboard
    await expect(page).toHaveURL(/dashboard/);
    await expect(page.getByRole('heading', { name: /dashboard/i })).toBeVisible();
  });

  test('should logout successfully', async ({ page }) => {
    // Login primero
    await page.goto('/');
    await page.getByLabel(/email/i).fill('admin@example.com');
    await page.getByLabel(/contraseña/i).fill('password123');
    await page.getByRole('button', { name: /iniciar sesión/i }).click();

    // Esperar redirección
    await page.waitForURL(/dashboard/);

    // Logout
    await page.getByRole('button', { name: /cerrar sesión/i }).click();

    // Verificar redirección a login
    await expect(page).toHaveURL('/');
  });
});

test.describe('Accessibility', () => {
  test('login page should be keyboard navigable', async ({ page }) => {
    await page.goto('/');

    // Navegar con Tab
    await page.keyboard.press('Tab'); // Focus en email
    await expect(page.getByLabel(/email/i)).toBeFocused();

    await page.keyboard.press('Tab'); // Focus en password
    await expect(page.getByLabel(/contraseña/i)).toBeFocused();

    await page.keyboard.press('Tab'); // Focus en botón
    await expect(page.getByRole('button', { name: /iniciar sesión/i })).toBeFocused();
  });

  test('login page should have proper ARIA labels', async ({ page }) => {
    await page.goto('/');

    // Verificar que los inputs tienen labels
    const emailInput = page.getByLabel(/email/i);
    const passwordInput = page.getByLabel(/contraseña/i);

    await expect(emailInput).toHaveAttribute('aria-label', /.+/);
    await expect(passwordInput).toHaveAttribute('type', 'password');
  });
});
