import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { requestTypes as defaultTypes, setRequestTypes } from '@/data/requestTypes'
import type { FormField, RequestType } from '@/data/requestTypes'

/* ════════════════════════════════════════
   REQUEST TYPES STORE
   ────────────────────────────────────────
   The admin can customise everything from
   the dashboard: add/remove whole request
   types, edit their fields, and hide the
   ones they don't use. `setRequestTypes`
   keeps the module-level registry in
   `data/requestTypes` in sync so the rest
   of the app (forms, details, seeds) reads
   the same catalogue.
════════════════════════════════════════ */

/** Push the current list to the framework-free registry. */
const sync = (types: RequestType[]) => setRequestTypes(types)

interface RequestTypesState {
  types: RequestType[]
  /** Ids hidden from employees (visible but disabled in the dashboard). */
  disabledIds: string[]
  addType: (type: RequestType) => void
  updateType: (id: string, patch: Partial<RequestType>) => void
  removeType: (id: string) => void
  addField: (typeId: string, field: FormField) => void
  updateField: (typeId: string, fieldId: string, patch: Partial<FormField>) => void
  removeField: (typeId: string, fieldId: string) => void
  toggle: (id: string) => void
  reset: () => void
}

const mapType = (
  types: RequestType[],
  id: string,
  fn: (type: RequestType) => RequestType,
) => {
  const next = types.map(t => (t.id === id ? fn(t) : t))
  sync(next)
  return next
}

export const useRequestTypesStore = create<RequestTypesState>()(
  persist(
    (set) => ({
      types: defaultTypes,
      disabledIds: [],

      addType: type =>
        set(state => {
          const next = [...state.types, type]
          sync(next)
          return { types: next }
        }),

      updateType: (id, patch) =>
        set(state => ({ types: mapType(state.types, id, t => ({ ...t, ...patch })) })),

      removeType: id =>
        set(state => {
          const next = state.types.filter(t => t.id !== id)
          sync(next)
          return { types: next, disabledIds: state.disabledIds.filter(x => x !== id) }
        }),

      addField: (typeId, field) =>
        set(state => ({ types: mapType(state.types, typeId, t => ({ ...t, fields: [...t.fields, field] })) })),

      updateField: (typeId, fieldId, patch) =>
        set(state => ({
          types: mapType(state.types, typeId, t => ({
            ...t,
            fields: t.fields.map(f => (f.id === fieldId ? { ...f, ...patch } : f)),
          })),
        })),

      removeField: (typeId, fieldId) =>
        set(state => ({
          types: mapType(state.types, typeId, t => ({
            ...t,
            fields: t.fields.filter(f => f.id !== fieldId),
          })),
        })),

      toggle: id =>
        set(state => ({
          disabledIds: state.disabledIds.includes(id)
            ? state.disabledIds.filter(x => x !== id)
            : [...state.disabledIds, id],
        })),

      reset: () => {
        sync(defaultTypes)
        set({ types: defaultTypes, disabledIds: [] })
      },
    }),
    {
      name: 'hr-request-types',
      version: 2,
      onRehydrateStorage: () => state => {
        if (state) sync(state.types)
      },
    },
  ),
)

/** Sync once right after creation (covers the persisted state read above). */
sync(useRequestTypesStore.getState().types)

/** The catalogue filtered by the admin's enabled/disabled settings. */
export const useAvailableRequestTypes = () => {
  const types = useRequestTypesStore(s => s.types)
  const disabledIds = useRequestTypesStore(s => s.disabledIds)
  return types.filter(t => !disabledIds.includes(t.id))
}
