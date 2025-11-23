import { headers } from 'next/headers'

/**
 * Obtiene el subdominio (tenant) actual desde los headers
 * Solo funciona en Server Components y API Routes
 */
export async function getTenantSubdomain(): Promise<string | null> {
  const headersList = await headers()
  return headersList.get('x-tenant-subdomain')
}

/**
 * Verifica si estamos en el panel Super Admin
 */
export async function isSuperAdmin(): Promise<boolean> {
  const subdomain = await getTenantSubdomain()
  const superAdminDomain = process.env.NEXT_PUBLIC_SUPER_ADMIN_DOMAIN || 'admin'
  return subdomain === superAdminDomain
}

/**
 * Hook para obtener tenant desde el pathname (para desarrollo)
 * Usar en Client Components
 */
export function useTenantFromPath() {
  if (typeof window === 'undefined') return null

  const pathParts = window.location.pathname.split('/').filter(Boolean)
  return pathParts[0] || null
}
