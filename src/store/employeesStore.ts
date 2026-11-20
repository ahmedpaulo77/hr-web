import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { seedEmployees, setEmployees } from '@/data/employees'
import type { Dependent, Employee } from '@/types'

/* ════════════════════════════════════════
   EMPLOYEES STORE
   ────────────────────────────────────────
   The admin manages the whole staff
   directory from the dashboard. `setEmployees`
   keeps the module-level registry in
   `data/employees` in sync so helpers like
   `getEmployeeByEmail`, `getTeam` and
   `lib/requests` always read the current
   list.
════════════════════════════════════════ */

/** Push the current list to the framework-free registry. */
const sync = (list: Employee[]) => setEmployees(list)

export type NewEmployee = Omit<Employee, 'id' | 'dependents'> & { dependents?: Dependent[] }

interface EmployeesState {
  employees: Employee[]
  addEmployee: (input: NewEmployee) => Employee
  updateEmployee: (id: string, patch: Partial<Employee>) => void
  removeEmployee: (id: string) => void
  toggleStatus: (id: string) => void
  reset: () => void
}

export const useEmployeesStore = create<EmployeesState>()(
  persist(
    (set) => ({
      employees: seedEmployees,

      addEmployee: input => {
        const created: Employee = {
          ...input,
          id: input.email || `emp-${Date.now()}`,
          dependents: input.dependents ?? [],
        }
        set(state => {
          const next = [...state.employees, created]
          sync(next)
          return { employees: next }
        })
        return created
      },

      updateEmployee: (id, patch) =>
        set(state => {
          const next = state.employees.map(e => (e.id === id ? { ...e, ...patch } : e))
          sync(next)
          return { employees: next }
        }),

      removeEmployee: id =>
        set(state => {
          const next = state.employees.filter(e => e.id !== id)
          sync(next)
          return { employees: next }
        }),

      toggleStatus: id =>
        set(state => {
          const next = state.employees.map(e => {
            if (e.id !== id) return e
            const status: Employee['status'] = e.status === 'active' ? 'inactive' : 'active'
            return { ...e, status }
          })
          sync(next)
          return { employees: next }
        }),

      reset: () => {
        sync(seedEmployees)
        set({ employees: seedEmployees })
      },
    }),
    {
      name: 'hr-employees',
      version: 1,
      onRehydrateStorage: () => state => {
        if (state) sync(state.employees)
      },
    },
  ),
)

/** Sync once right after creation (covers the persisted state read above). */
sync(useEmployeesStore.getState().employees)
