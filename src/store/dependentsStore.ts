import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { seedEmployees } from '@/data/employees'
import type { Dependent } from '@/types'

/* Registered dependents per employee.
   Medical-insurance requests can only pick from this list.
   In production this is `GET /employees/:id/dependents`. */

const seed = () =>
  Object.fromEntries(seedEmployees.map(e => [e.id, e.dependents]))

interface DependentsState {
  byEmployee: Record<string, Dependent[]>
  add: (employeeId: string, dependent: Omit<Dependent, 'id'>) => Dependent
  remove: (employeeId: string, dependentId: string) => void
  list: (employeeId?: string | null) => Dependent[]
  reset: () => void
  clearAll: () => void
}

export const useDependentsStore = create<DependentsState>()(
  persist(
    (set, get) => ({
      byEmployee: seed(),

      add: (employeeId, dependent) => {
        const created: Dependent = {
          ...dependent,
          id: `dep-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        }
        set(state => ({
          byEmployee: {
            ...state.byEmployee,
            [employeeId]: [...(state.byEmployee[employeeId] ?? []), created],
          },
        }))
        return created
      },

      remove: (employeeId, dependentId) =>
        set(state => ({
          byEmployee: {
            ...state.byEmployee,
            [employeeId]: (state.byEmployee[employeeId] ?? []).filter(d => d.id !== dependentId),
          },
        })),

      list: employeeId => (employeeId ? get().byEmployee[employeeId] ?? [] : []),

      reset: () => set({ byEmployee: seed() }),
      clearAll: () => set({ byEmployee: {} }),
    }),
    { name: 'hr-dependents', version: 1 },
  ),
)
