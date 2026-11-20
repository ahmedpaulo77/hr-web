import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { buildSeedRequests } from '@/data/seedRequests'
import { nextRequestId } from '@/lib/format'
import type { Actor, NewRequestInput, RequestRecord, RequestStatus } from '@/types'

/* ════════════════════════════════════════
   REQUESTS STORE
   ────────────────────────────────────────
   This is the only place UI reads/writes
   requests. When the backend is ready, swap
   the action bodies with API calls — every
   screen keeps working unchanged.
════════════════════════════════════════ */

const uid = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`

interface RequestsState {
  requests: RequestRecord[]
  addRequest: (input: NewRequestInput) => RequestRecord
  setStatus: (id: string, status: RequestStatus, actor: Actor, note?: string) => void
  approve: (id: string, actor: Actor) => void
  reject: (id: string, actor: Actor, reason: string) => void
  cancel: (id: string, actor: Actor) => void
  reset: () => void
}

const STATUS_LABEL: Record<RequestStatus, string> = {
  pending: 'تم إعادة الطلب إلى قائمة الانتظار',
  processing: 'الطلب قيد المعالجة',
  approved: 'تمت الموافقة على الطلب',
  rejected: 'تم رفض الطلب',
  cancelled: 'تم إلغاء الطلب',
}

export const useRequestsStore = create<RequestsState>()(
  persist(
    (set, get) => ({
      requests: buildSeedRequests(),

      addRequest: input => {
        const now = new Date().toISOString()
        const request: RequestRecord = {
          id: nextRequestId(get().requests),
          typeId: input.typeId,
          typeTitle: input.typeTitle,
          status: 'pending',
          employeeId: input.employee.id,
          employeeName: input.employee.name,
          employeeNumber: input.employee.employeeNumber,
          department: input.employee.department,
          submittedAt: now,
          updatedAt: now,
          submittedBy: input.submittedBy,
          values: input.values,
          attachments: input.attachments,
          timeline: [
            {
              id: uid(),
              at: now,
              label: 'تم تقديم الطلب',
              by: input.submittedBy.name,
              role: input.submittedBy.role,
            },
          ],
        }
        set(state => ({ requests: [request, ...state.requests] }))
        return request
      },

      setStatus: (id, status, actor, note) =>
        set(state => ({
          requests: state.requests.map(r => {
            if (r.id !== id) return r
            const now = new Date().toISOString()
            return {
              ...r,
              status,
              updatedAt: now,
              rejectionReason: status === 'rejected' ? note : r.rejectionReason,
              timeline: [
                ...r.timeline,
                {
                  id: uid(),
                  at: now,
                  label: STATUS_LABEL[status],
                  by: actor.name,
                  role: actor.role,
                  note,
                },
              ],
            }
          }),
        })),

      approve: (id, actor) => get().setStatus(id, 'approved', actor),
      reject: (id, actor, reason) => get().setStatus(id, 'rejected', actor, reason),
      cancel: (id, actor) => get().setStatus(id, 'cancelled', actor, 'أُلغي بواسطة الموظف'),

      reset: () => set({ requests: buildSeedRequests() }),
    }),
    { name: 'hr-requests', version: 1 }
  )
)
