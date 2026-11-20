import { getEmployeeByEmail } from '@/data/employees'
import type { ApprovalRole, RequestRecord, UserRole } from '@/types'

export const approvalFlowFor = (request: Pick<RequestRecord, 'approvalFlow'>): ApprovalRole[] =>
  request.approvalFlow?.length ? request.approvalFlow : ['manager']

export const approvalStageFor = (request: Pick<RequestRecord, 'approvalStage'>) =>
  request.approvalStage ?? 0

export const currentApprovalRole = (request: Pick<RequestRecord, 'approvalFlow' | 'approvalStage'>) =>
  approvalFlowFor(request)[approvalStageFor(request)] ?? null

export function isAssignedApprover(
  request: RequestRecord,
  user: { id?: string | null; role?: UserRole | null },
) {
  if (!['pending', 'processing'].includes(request.status)) return false
  const role = currentApprovalRole(request)
  if (!role || user.role !== role) return false
  if (role === 'admin') return true
  return Boolean(user.id && getEmployeeByEmail(request.employeeId)?.managerId === user.id)
}
