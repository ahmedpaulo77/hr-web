import { useEffect } from 'react'
import { DEFAULT_BRANDING, useSettingsStore } from '@/store/settingsStore'
import { useTenantId } from '@/lib/tenant'

const colorToRgb = (hex: string) => {
  const match = /^#?([0-9a-f]{6})$/i.exec(hex)
  if (!match) return '124, 58, 237'
  const value = match[1]
  return [
    Number.parseInt(value.slice(0, 2), 16),
    Number.parseInt(value.slice(2, 4), 16),
    Number.parseInt(value.slice(4, 6), 16),
  ].join(', ')
}

export default function BrandTheme() {
  const companyId = useTenantId()
  const color = useSettingsStore(state =>
    state.brandingByCompany[companyId]?.primaryColor ?? DEFAULT_BRANDING.primaryColor,
  )

  useEffect(() => {
    const root = document.documentElement
    root.style.setProperty('--brand-primary', color)
    root.style.setProperty('--brand-primary-rgb', colorToRgb(color))
  }, [color])

  return null
}
