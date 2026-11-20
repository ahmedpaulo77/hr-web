import { create } from 'zustand'
import { persist } from 'zustand/middleware'

/* ════════════════════════════════════════
   SETTINGS STORE
   ────────────────────────────────────────
   Company profile + notification
   preferences. Persisted so the admin's
   choices survive a reload.
════════════════════════════════════════ */

export interface CompanySettings {
  name: string
  email: string
  phone: string
  website: string
}

export interface BrandingSettings {
  logoDataUrl: string
  primaryColor: string
}

export const DEFAULT_TENANT_ID = 'elite-group'
export const DEFAULT_BRANDING: BrandingSettings = {
  logoDataUrl: '',
  primaryColor: '#7c3aed',
}

const defaultCompany: CompanySettings = {
  name: 'مجموعة النخبة',
  email: 'hr@company.com',
  phone: '0112345678',
  website: 'www.company.com',
}

const defaultNotifications = [true, true, false]

interface SettingsState {
  company: CompanySettings
  notifications: boolean[]
  brandingByCompany: Record<string, BrandingSettings>
  saveCompany: (company: CompanySettings) => void
  saveBranding: (companyId: string, branding: BrandingSettings) => void
  toggleNotification: (index: number) => void
  reset: () => void
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      company: defaultCompany,
      notifications: defaultNotifications,
      brandingByCompany: {},

      saveCompany: company => set({ company }),
      saveBranding: (companyId, branding) => set(state => ({
        brandingByCompany: { ...state.brandingByCompany, [companyId]: branding },
      })),

      toggleNotification: index =>
        set(state => ({
          notifications: state.notifications.map((v, i) => (i === index ? !v : v)),
        })),

      reset: () => set({ company: defaultCompany, notifications: defaultNotifications, brandingByCompany: {} }),
    }),
    {
      name: 'hr-settings',
      version: 2,
      migrate: persistedState => ({
        ...(persistedState as Partial<SettingsState>),
        brandingByCompany: (persistedState as Partial<SettingsState>).brandingByCompany ?? {},
      }),
    },
  ),
)
