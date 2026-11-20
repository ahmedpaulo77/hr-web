import type { RequestRecord, RequestStatus, TimelineEvent } from '@/types'
import { getEmployeeByEmail } from '@/data/employees'
import { getRequestType } from '@/data/requestTypes'

/* Seed data so the demo never starts empty.
   Replaced by the backend list endpoint later. */

const YEAR = new Date().getFullYear()

const daysAgo = (n: number) => {
  const d = new Date()
  d.setDate(d.getDate() - n)
  d.setHours(9 + (n % 6), 15, 0, 0)
  return d.toISOString()
}

const event = (at: string, label: string, by: string, role: string, note?: string): TimelineEvent => ({
  id: `${at}-${label}`,
  at,
  label,
  by,
  role,
  note,
})

interface SeedInput {
  n: number
  typeId: string
  employeeId: string
  status: RequestStatus
  days: number
  values: Record<string, string | boolean>
  rejectionReason?: string
  note?: string
}

function build({ n, typeId, employeeId, status, days, values, rejectionReason, note }: SeedInput): RequestRecord {
  const employee = getEmployeeByEmail(employeeId)!
  const type = getRequestType(typeId)!
  const submittedAt = daysAgo(days)
  const handledAt = daysAgo(Math.max(0, days - 2))

  const timeline: TimelineEvent[] = [
    event(submittedAt, 'تم تقديم الطلب', employee.name, 'موظف'),
  ]

  if (status === 'processing') {
    timeline.push(event(handledAt, 'الطلب قيد المعالجة', 'قسم الموارد البشرية', 'موارد بشرية'))
  }
  if (status === 'approved') {
    timeline.push(event(handledAt, 'تمت الموافقة على الطلب', employee.managerId === 'manager@hr.com' ? 'محمد عبدالله' : 'سارة أحمد', 'مدير'))
  }
  if (status === 'rejected') {
    timeline.push(event(handledAt, 'تم رفض الطلب', employee.managerId === 'manager@hr.com' ? 'محمد عبدالله' : 'سارة أحمد', 'مدير', rejectionReason))
  }
  if (status === 'cancelled') {
    timeline.push(event(handledAt, 'تم إلغاء الطلب بواسطة الموظف', employee.name, 'موظف'))
  }

  return {
    id: `REQ-${YEAR}-${String(n).padStart(4, '0')}`,
    typeId,
    typeTitle: type.title,
    status,
    employeeId: employee.id,
    employeeName: employee.name,
    employeeNumber: employee.employeeNumber,
    department: employee.department,
    submittedAt,
    updatedAt: timeline[timeline.length - 1].at,
    submittedBy: { name: employee.name, role: 'موظف' },
    values,
    attachments: [],
    timeline,
    rejectionReason,
  }
}

export function buildSeedRequests(): RequestRecord[] {
  return [
    build({
      n: 1, typeId: 'salary-freeze', employeeId: 'employee@hr.com', status: 'approved', days: 12,
      values: { language: 'عربي', bank_name: 'مصرف الراجحي', purpose: 'قرض عقاري', notes: '' },
    }),
    build({
      n: 2, typeId: 'loan', employeeId: 'employee@hr.com', status: 'pending', days: 2,
      values: { amount: '6000', installments: '6', monthly_deduction: '1000', payroll_date: daysAgo(-5).slice(0, 10), guarantor_number: 'EMP-1002', guarantor_name: 'محمد عبدالله', guarantor_hire_date: '2017-08-01' },
    }),
    build({
      n: 3, typeId: 'experience-certificate', employeeId: 'employee@hr.com', status: 'processing', days: 6,
      values: { nationality: 'سعودي', purpose: 'سفارة', dms_reference: '' },
    }),
    build({
      n: 4, typeId: 'salary-statement', employeeId: 'employee@hr.com', status: 'rejected', days: 18,
      values: { destination_type: 'بنك', destination_name: 'البنك الأهلي', destination_name_en: 'SNB', include_salary: 'نعم', chamber_of_commerce: 'لا', purpose_ar: 'فتح حساب', purpose_en: 'Open account' },
      rejectionReason: 'اسم الجهة غير مطابق للمستند المرفق، يرجى إعادة التقديم باسم الجهة الرسمي.',
    }),
    build({
      n: 5, typeId: 'bank-change', employeeId: 'employee@hr.com', status: 'approved', days: 31,
      values: { bank_name: 'الرياض', iban: 'SA4420000001234567891234', start_date: daysAgo(24).slice(0, 10) },
    }),
    build({
      n: 6, typeId: 'loan', employeeId: 'omar@hr.com', status: 'pending', days: 1,
      values: { amount: '3000', installments: '3', monthly_deduction: '1000', payroll_date: daysAgo(-6).slice(0, 10), guarantor_number: 'EMP-1024', guarantor_name: 'أحمد محمد علي', guarantor_hire_date: '2021-03-14' },
    }),
    build({
      n: 7, typeId: 'exit-reentry', employeeId: 'omar@hr.com', status: 'pending', days: 3,
      values: { leave_type: 'أعمال', exit_type: 'منفرد (خروج وعودة)', duration: '21' },
    }),
    build({
      n: 8, typeId: 'chamber-attestation', employeeId: 'omar@hr.com', status: 'approved', days: 9,
      values: { transaction_type: 'تصديق عقد', transaction_number: 'TRX-88231', deduction_ack: true },
    }),
    build({
      n: 9, typeId: 'marriage-newborn', employeeId: 'fatima@hr.com', status: 'processing', days: 7,
      values: { request_type: 'دعم زواج', event_date: daysAgo(20).slice(0, 10), payroll_date: daysAgo(-3).slice(0, 10), eligibility: 'مستحق' },
    }),
    build({
      n: 10, typeId: 'medical-insurance', employeeId: 'khaled@hr.com', status: 'approved', days: 16,
      values: { action_type: 'إضافة', contact_type: 'ابن', dependent_name: 'عبدالله خالد', gender: 'ذكر', birth_date: '2023-05-08', id_number: '1122334455' },
    }),
    build({
      n: 11, typeId: 'resume-after-leave', employeeId: 'employee@hr.com', status: 'cancelled', days: 26,
      values: { last_leave_type: 'سنوية', last_leave_start: daysAgo(40).slice(0, 10), last_leave_end: daysAgo(32).slice(0, 10), return_date: daysAgo(31).slice(0, 10) },
    }),
    build({
      n: 12, typeId: 'classes-allowance', employeeId: 'layan@hr.com', status: 'pending', days: 5,
      values: { period: daysAgo(0).slice(0, 10), classes_count: '12', school_name: 'مدارس الرياض' },
      note: 'بدل حصص شهر نوفمبر',
    }),
  ]
}
