import { Buildings } from '@phosphor-icons/react'
import { DEFAULT_BRANDING, useSettingsStore } from '@/store/settingsStore'
import { useTenantId } from '@/lib/tenant'

interface CompanyLogoProps {
  size?: number
}

export default function CompanyLogo({ size = 36 }: CompanyLogoProps) {
  const companyId = useTenantId()
  const branding = useSettingsStore(state => state.brandingByCompany[companyId] ?? DEFAULT_BRANDING)

  return (
    <div
      className="flex flex-shrink-0 items-center justify-center overflow-hidden rounded-xl"
      style={{
        width: size,
        height: size,
        background: branding.logoDataUrl ? 'rgba(var(--brand-primary-rgb),0.08)' : 'var(--brand-primary)',
        boxShadow: '0 4px 16px rgba(var(--brand-primary-rgb),0.28)',
      }}
    >
      {branding.logoDataUrl ? (
        <img src={branding.logoDataUrl} alt="شعار الشركة" className="h-full w-full object-contain p-1" />
      ) : (
        <Buildings size={Math.round(size * 0.52)} weight="duotone" color="white" />
      )}
    </div>
  )
}
