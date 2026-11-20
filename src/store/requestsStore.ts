import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { buildSeedRequests } from '@/data/seedRequests'
import { nextRequestId } from '@/lib/format'
import { approvalFlowFor, isAssignedApprover } from '@/lib/approvals'
import { useHrOperationsStore } from '@/store/hrOperationsStore'
import type { Actor, ApprovalRole, NewRequestInput, RequestRecord, RequestStatus } from '@/types'

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
  updateRequest: (id: string, values: RequestRecord['values'], actor: Actor) => void
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

const approvalRoleOf = (actor: Actor): ApprovalRole | null => {
  if (actor.userRole === 'manager' || actor.userRole === 'admin') return actor.userRole
  if (actor.role === 'مدير') return 'manager'
  if (actor.role === 'موارد بشرية') return 'admin'
  return null
}

const applyApprovedLeave = (request: RequestRecord) => {
  const days = Math.max(0, Number(request.values.days_count) || 0)
  const leaveEffect = request.typeId === 'leave-annual'
    ? 'annual'
    : request.typeId === 'leave-sale'
      ? 'sale'
      : request.typeId === 'leave-donation'
        ? 'donation'
        : null
  if (!leaveEffect) return
  const recipientId = String(request.values.recipient_id ?? '').trim().toLowerCase()
  useHrOperationsStore.getState().applyApprovedLeave(
    request.id,
    request.employeeId,
    leaveEffect,
    days,
    recipientId,
  )
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
          approvalFlow: input.approvalFlow?.length ? input.approvalFlow : ['manager'],
          approvalStage: 0,
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

      updateRequest: (id, values, actor) =>
        set(state => ({
          requests: state.requests.map(r => {
            if (r.id !== id || r.status !== 'pending') return r
            const now = new Date().toISOString()
            return {
              ...r,
              values,
              updatedAt: now,
              timeline: [
                ...r.timeline,
                {
                  id: uid(),
                  at: now, label: 'تم تعديل بيانات الطلب', by: actor.name, role: actor.role,
                },
              ],
            }
          }),
        })),

      setStatus: (id, status, actor, note) => {
        const request = get().requests.find(item => item.id === id)
        if (!request || request.status === status) return

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
        }))

        if (status === 'approved') applyApprovedLeave(request)
      },

      approve: (id, actor) => {
        const request = get().requests.find(item => item.id === id)
        if (!request || !['pending', 'processing'].includes(request.status)) return

        const flow: ApprovalRole[] = approvalFlowFor(request)
        const currentStage = request.approvalStage ?? 0
        const currentRole = flow[currentStage]
        const actorRole = approvalRoleOf(actor)
        if (!currentRole || !isAssignedApprover(request, { id: actor.id, role: actorRole })) return

        const nextStage = currentStage + 1
        const finalStage = nextStage >= flow.length
        const nextStatus: RequestStatus = finalStage ? 'approved' : flow[nextStage] === 'admin' ? 'processing' : 'pending'
        const now = new Date().toISOString()
        const nextRoleLabel = flow[nextStage] === 'admin' ? 'الموارد البشرية' : 'المدير المباشر'

        set(state => ({
          requests: state.requests.map(item => item.id !== id ? item : {
            ...item,
            status: nextStatus,
            approvalFlow: flow,
            approvalStage: nextStage,
            updatedAt: now,
            timeline: [
              ...item.timeline,
              {
                id: uid(),
                at: now,
                label: finalStage ? 'تمت الموافقة النهائية على الطلب' : `تم اعتماد المرحلة والانتقال إلى ${nextRoleLabel}`,
                by: actor.name,
                role: actor.role,
              },
            ],
          }),
        }))

        if (finalStage) applyApprovedLeave(request)
      },
      reject: (id, actor, reason) => {
        const request = get().requests.find(item => item.id === id)
        const actorRole = approvalRoleOf(actor)
        if (!request || !actorRole || !isAssignedApprover(request, { id: actor.id, role: actorRole })) return
        get().setStatus(id, 'rejected', actor, reason)
      },
      cancel: (id, actor) => get().setStatus(id, 'cancelled', actor, 'أُلغي بواسطة الموظف'),

      reset: () => set({ requests: buildSeedRequests() }),
    }),
    {
      name: 'hr-requests',
      version: 3,
      migrate: persistedState => {
        const saved = persistedState as Partial<RequestsState>
        const requests = (saved.requests ?? []).map(request => ({
          ...request,
          approvalFlow: request.approvalFlow?.length ? request.approvalFlow : ['manager' as const],
          approvalStage: request.approvalStage ?? 0,
        }))
        const savedIds = new Set(requests.map(request => request.id))
        return {
          ...saved,
          requests: [
            ...requests,
            ...buildSeedRequests().filter(request => !savedIds.has(request.id)),
          ],
        }
      },
    }
  )
)
