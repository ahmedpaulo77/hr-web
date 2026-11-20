import type { Employee } from '@/types'
import { User, IdentificationCard, Buildings, MapPin, CalendarBlank, CurrencyCircleDollar } from '@phosphor-icons/react'
import { formatDate } from '@/lib/format'

interface Props {
  employee: Employee
  /** 'card' = standalone glass card, 'inline' = plain block */
  variant?: 'card' | 'inline'
}

const items = (employee: Employee) => [
  { icon: IdentificationCard, label: 'رقم الموظف', value: employee.employeeNumber },
  { icon: Buildings,          label: 'القسم',       value: employee.department },
  { icon: User,               label: 'المسمى الوظيفي', value: employee.position },
  { icon: MapPin,             label: 'الموقع',      value: employee.location },
  { icon: CurrencyCircleDollar, label: 'الراتب الشهري', value: employee.monthlySalary
    ? new Intl.NumberFormat('ar-SA', { style: 'currency', currency: 'SAR', maximumFractionDigits: 0 }).format(employee.monthlySalary)
    : 'غير محدد' },
  { icon: CalendarBlank,      label: 'تاريخ التعيين', value: formatDate(employee.hireDate) },
  { icon: IdentificationCard, label: 'الجنسية',     value: employee.nationality },
]

export default function EmployeeInfoCard({ employee, variant = 'card' }: Props) {
  const body = (
    <>
      <div className="flex items-center gap-3 mb-5">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center font-black text-[#fff] text-lg shadow-lg shadow-violet-900/40">
          {employee.name.charAt(0)}
        </div>
        <div>
          <p className="font-black text-white leading-tight">{employee.name}</p>
          <p className="text-xs text-white/35 mt-0.5">{employee.email}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-3.5">
        {items(employee).map(item => (
          <div key={item.label} className="min-w-0">
            <p className="text-[10px] font-black text-white/25 uppercase tracking-wider mb-0.5">{item.label}</p>
            <p className="text-sm font-bold text-white/70 truncate" title={item.value}>{item.value}</p>
          </div>
        ))}
      </div>
    </>
  )

  if (variant === 'inline') return <div>{body}</div>

  return (
    <div className="glass border-gradient p-5 rounded-2xl">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-black text-white/30 uppercase tracking-widest">بيانات الموظف</p>
        <span className="text-[10px] font-bold text-white/20">تلقائي من ملف الموظف</span>
      </div>
      {body}
    </div>
  )
}
