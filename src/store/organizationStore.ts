import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { seedEmployees } from '@/data/employees'
import { useEmployeesStore } from '@/store/employeesStore'

const unique = (values: string[]) => [...new Set(values.filter(Boolean))]

interface OrganizationState {
  departments: string[]
  positions: string[]
  addDepartment: (name: string) => boolean
  renameDepartment: (oldName: string, newName: string) => boolean
  removeDepartment: (name: string) => boolean
  addPosition: (name: string) => boolean
  renamePosition: (oldName: string, newName: string) => boolean
  removePosition: (name: string) => boolean
}

const cleanName = (name: string) => name.trim().replace(/\s+/g, ' ')

export const useOrganizationStore = create<OrganizationState>()(
  persist(
    (set, get) => ({
      departments: unique(seedEmployees.map(employee => employee.department)),
      positions: unique(seedEmployees.map(employee => employee.position)),

      addDepartment: name => {
        const value = cleanName(name)
        if (!value || get().departments.some(item => item.toLowerCase() === value.toLowerCase())) return false
        set(state => ({ departments: [...state.departments, value] }))
        return true
      },

      renameDepartment: (oldName, newName) => {
        const value = cleanName(newName)
        const { departments } = get()
        if (!value || !departments.includes(oldName) ||
          departments.some(item => item !== oldName && item.toLowerCase() === value.toLowerCase())) return false
        useEmployeesStore.getState().employees
          .filter(employee => employee.department === oldName)
          .forEach(employee => useEmployeesStore.getState().updateEmployee(employee.id, { department: value }))
        set({ departments: departments.map(item => item === oldName ? value : item) })
        return true
      },

      removeDepartment: name => {
        if (useEmployeesStore.getState().employees.some(employee => employee.department === name)) return false
        set(state => ({ departments: state.departments.filter(item => item !== name) }))
        return true
      },

      addPosition: name => {
        const value = cleanName(name)
        if (!value || get().positions.some(item => item.toLowerCase() === value.toLowerCase())) return false
        set(state => ({ positions: [...state.positions, value] }))
        return true
      },

      renamePosition: (oldName, newName) => {
        const value = cleanName(newName)
        const { positions } = get()
        if (!value || !positions.includes(oldName) ||
          positions.some(item => item !== oldName && item.toLowerCase() === value.toLowerCase())) return false
        useEmployeesStore.getState().employees
          .filter(employee => employee.position === oldName)
          .forEach(employee => useEmployeesStore.getState().updateEmployee(employee.id, { position: value }))
        set({ positions: positions.map(item => item === oldName ? value : item) })
        return true
      },

      removePosition: name => {
        if (useEmployeesStore.getState().employees.some(employee => employee.position === name)) return false
        set(state => ({ positions: state.positions.filter(item => item !== name) }))
        return true
      },
    }),
    { name: 'hr-organization-catalog', version: 1 },
  ),
)

const savedEmployees = useEmployeesStore.getState().employees
const savedCatalog = useOrganizationStore.getState()
useOrganizationStore.setState({
  departments: unique([...savedCatalog.departments, ...savedEmployees.map(employee => employee.department)]),
  positions: unique([...savedCatalog.positions, ...savedEmployees.map(employee => employee.position)]),
})
