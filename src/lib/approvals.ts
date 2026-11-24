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
  if (!role) return false
  if (role === 'admin') return user.role === 'admin'

  /* First stage = the employee's direct manager. HR admins also cover this stage for
     employees whose manager is the admin account (small orgs where HR is the line
     manager), otherwise those requests could never be approved. */
  if (user.role !== 'manager' && user.role !== 'admin') return false
  const employee = getEmployeeByEmail(request.employeeId)
  return Boolean(user.id && employee?.managerId === user.id)
}
