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
  saveCompany: (company: CompanySettings) => void
  toggleNotification: (index: number) => void
  reset: () => void
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      company: defaultCompany,
      notifications: defaultNotifications,

      saveCompany: company => set({ company }),

      toggleNotification: index =>
        set(state => ({
          notifications: state.notifications.map((v, i) => (i === index ? !v : v)),
        })),

      reset: () => set({ company: defaultCompany, notifications: defaultNotifications }),
    }),
    { name: 'hr-settings', version: 1 },
  ),
)
