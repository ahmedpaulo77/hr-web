import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type UserRole = 'employee' | 'manager' | 'admin'

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  avatar?: string
  department?: string
  position?: string
  companyName?: string
  companyId?: string
  companyLogo?: string
}

interface AuthState {
  user: User | null
  token: string | null
  login: (user: User, token: string) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      login: (user, token) => set({ user, token }),
      logout: () => set({ user: null, token: null }),
    }),
    { name: 'hr-auth' }
  )
)
