import { useAuthStore } from '@/store/authStore'
import { DEFAULT_TENANT_ID } from '@/store/settingsStore'

export const tenantIdFromLocation = (fallback?: string | null) => {
  if (typeof window !== 'undefined') {
    const tenant = new URLSearchParams(window.location.search).get('tenant')?.trim()
    if (tenant) return tenant
  }
  return fallback || DEFAULT_TENANT_ID
}

export const useTenantId = () => {
  const userTenantId = useAuthStore(state => state.user?.companyId)
  return tenantIdFromLocation(userTenantId)
}
