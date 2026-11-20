/* ════════════════════════════════════════
   DOMAIN TYPES
   These mirror the shapes the backend is
   expected to return. Keep them framework-free.
════════════════════════════════════════ */

export type UserRole = 'employee' | 'manager' | 'admin'
export type ApprovalRole = Extract<UserRole, 'manager' | 'admin'>

export type RequestStatus =
  | 'pending'
  | 'processing'
  | 'approved'
  | 'rejected'
  | 'cancelled'

export interface Dependent {
  id: string
  name: string
  fatherName?: string
  grandfatherName?: string
  localName?: string
  relation: 'زوجة' | 'ابن' | 'ابنة' | 'والد' | 'والدة'
  birthDate: string // ISO
  gender: 'ذكر' | 'أنثى'
  idNumber: string
  emergencyContactName?: string
  emergencyContactPhone?: string
  email?: string
  phone?: string
  address?: string
}

export interface Employee {
  /** Backend user id — in the demo this is the login email */
  id: string
  name: string
  email: string
  employeeNumber: string
  department: string
  position: string
  location: string
  nationality: string
  hireDate: string // ISO
  monthlySalary?: number
  managerId: string | null
  role: UserRole
  status: 'active' | 'inactive'
  dependents: Dependent[]
}

export interface Attachment {
  id: string
  name: string
  size: number
  type: string
}

export interface TimelineEvent {
  id: string
  at: string // ISO
  label: string
  by: string
  role: string
  note?: string
}

export interface Actor {
  id?: string
  userRole?: UserRole
  name: string
  role: string
}

export type FieldValue = string | boolean

export interface RequestRecord {
  /** Human readable reference, e.g. REQ-2026-0001 */
  id: string
  typeId: string
  typeTitle: string
  status: RequestStatus
  employeeId: string
  employeeName: string
  employeeNumber: string
  department: string
  submittedAt: string
  updatedAt: string
  submittedBy: Actor
  values: Record<string, FieldValue>
  attachments: Attachment[]
  timeline: TimelineEvent[]
  rejectionReason?: string
  approvalFlow?: ApprovalRole[]
  approvalStage?: number
}

export interface NewRequestInput {
  typeId: string
  typeTitle: string
  employee: Employee
  submittedBy: Actor
  values: Record<string, FieldValue>
  attachments: Attachment[]
  approvalFlow?: ApprovalRole[]
}
