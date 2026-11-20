import { useMemo, useState } from 'react'
import { useAuthStore } from '@/store/authStore'
import { useEmployeesStore } from '@/store/employeesStore'
import { useHrOperationsStore, type AttendanceStatus } from '@/store/hrOperationsStore'
import { CalendarBlank, CaretLeft, CaretRight, Clock, UsersThree } from '@phosphor-icons/react'

const statusLabels: Record<AttendanceStatus, string> = {
  present: 'حضور مكتمل',
  shortage: 'عجز',
  absent: 'غياب',
  leave: 'إجازة',
  'missing-punch': 'بصمة ناقصة',
  scheduled: 'وردية مجدولة',
}

const statusStyles: Record<AttendanceStatus, string> = {
  present: 'bg-emerald-500/10 text-emerald-300',
  shortage: 'bg-amber-500/10 text-amber-300',
  absent: 'bg-rose-500/10 text-rose-300',
  leave: 'bg-sky-500/10 text-sky-300',
  'missing-punch': 'bg-orange-500/10 text-orange-300',
  scheduled: 'bg-violet-500/10 text-violet-300',
}

const attendanceStatuses: AttendanceStatus[] = ['present', 'shortage', 'absent', 'leave', 'missing-punch']
const isoDate = (date: Date) => {
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60_000)
  return local.toISOString().slice(0, 10)
}

function monthTitle(date: Date) {
  return new Intl.DateTimeFormat('ar-SA', { month: 'long', year: 'numeric', calendar: 'gregory' }).format(date)
}

export default function AttendancePage({ teamMode = false }: { teamMode?: boolean }) {
  const { user } = useAuthStore()
  const employees = useEmployeesStore(state => state.employees)
  const attendance = useHrOperationsStore(state => state.attendance)
  const isManager = teamMode && user?.role === 'manager'
  const people = isManager
    ? employees.filter(employee => employee.managerId === user?.id && employee.status === 'active')
    : employees.filter(employee => employee.id === user?.id)
  const allowedIds = useMemo(() => new Set(people.map(person => person.id)), [people])
  const employeeNames = useMemo(() => new Map(people.map(person => [person.id, person.name])), [people])

  const today = isoDate(new Date())
  const monthStart = new Date()
  monthStart.setDate(1)
  const [tab, setTab] = useState<'attendance' | 'calendar'>('attendance')
  const [from, setFrom] = useState(() => {
    const date = new Date()
    date.setDate(date.getDate() - 30)
    return isoDate(date)
  })
  const [to, setTo] = useState(today)
  const [statusFilter, setStatusFilter] = useState('all')
  const [employeeFilter, setEmployeeFilter] = useState('all')
  const [month, setMonth] = useState(monthStart)

  const filtered = useMemo(
    () => attendance
      .filter(entry => allowedIds.has(entry.employeeId))
      .filter(entry => entry.status !== 'scheduled')
      .filter(entry => entry.date >= from && entry.date <= to)
      .filter(entry => statusFilter === 'all' || entry.status === statusFilter)
      .filter(entry => employeeFilter === 'all' || entry.employeeId === employeeFilter)
      .sort((a, b) => b.date.localeCompare(a.date)),
    [attendance, allowedIds, employeeFilter, from, statusFilter, to],
  )

  const monthEntries = useMemo(
    () => attendance
      .filter(entry => allowedIds.has(entry.employeeId))
      .filter(entry => entry.date.startsWith(`${month.getFullYear()}-${String(month.getMonth() + 1).padStart(2, '0')}`))
      .filter(entry => employeeFilter === 'all' || entry.employeeId === employeeFilter),
    [attendance, allowedIds, employeeFilter, month],
  )

  const monthDays = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate()
  const offset = new Date(month.getFullYear(), month.getMonth(), 1).getDay()
  const counts = attendanceStatuses.map(status => ({
    status,
    count: filtered.filter(entry => entry.status === status).length,
  }))

  return (
    <div className="space-y-5 animate-fade-up">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-black text-white">{isManager ? 'حضور وجدول الفريق' : 'الحضور والتقويم'}</h2>
          <p className="mt-1 text-sm text-white/35">
            {isManager ? 'تابع الورديات والحضور لفريقك.' : 'راجع وردياتك وسجل الحضور والانصراف.'}
          </p>
        </div>
        {isManager && (
          <span className="flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.03] px-3 py-2 text-xs text-white/50">
            <UsersThree size={15} /> {people.length} موظفين نشطين
          </span>
        )}
      </div>

      <div className="flex gap-2 border-b border-white/[0.08]">
        {[
          { id: 'attendance' as const, label: 'الحضور والانصراف', icon: Clock },
          { id: 'calendar' as const, label: isManager ? 'جدول الفريق' : 'التقويم', icon: CalendarBlank },
        ].map(item => {
          const Icon = item.icon
          return (
            <button key={item.id} onClick={() => setTab(item.id)}
              className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-bold transition-colors ${
                tab === item.id ? 'border-violet-400 text-violet-300' : 'border-transparent text-white/40 hover:text-white/70'
              }`}>
              <Icon size={17} weight="duotone" /> {item.label}
            </button>
          )
        })}
      </div>

      {tab === 'attendance' ? (
        <div className="space-y-5">
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
            {counts.map(({ status, count }) => (
              <div key={status} className="glass border-gradient p-4">
                <p className="text-xs text-white/35">{statusLabels[status]}</p>
                <p className={`mt-2 text-2xl font-black ${statusStyles[status].split(' ')[1]}`}>{count}</p>
              </div>
            ))}
          </div>

          <div className="glass border-gradient flex flex-wrap items-end gap-3 p-4">
            <label className="min-w-[150px] flex-1 text-xs font-bold text-white/45">
              من تاريخ
              <input type="date" value={from} max={to} onChange={event => setFrom(event.target.value)} className="input mt-2" />
            </label>
            <label className="min-w-[150px] flex-1 text-xs font-bold text-white/45">
              إلى تاريخ
              <input type="date" value={to} min={from} max={today} onChange={event => setTo(event.target.value)} className="input mt-2" />
            </label>
            {isManager && (
              <label className="min-w-[180px] flex-1 text-xs font-bold text-white/45">
                الموظف
                <select value={employeeFilter} onChange={event => setEmployeeFilter(event.target.value)} className="input mt-2">
                  <option value="all">كل الفريق</option>
                  {people.map(person => <option key={person.id} value={person.id}>{person.name}</option>)}
                </select>
              </label>
            )}
            <label className="min-w-[180px] flex-1 text-xs font-bold text-white/45">
              الحالة
              <select value={statusFilter} onChange={event => setStatusFilter(event.target.value)} className="input mt-2">
                <option value="all">كل الحالات</option>
                {attendanceStatuses.map(status => <option key={status} value={status}>{statusLabels[status]}</option>)}
              </select>
            </label>
          </div>

          <div className="glass border-gradient overflow-hidden rounded-2xl">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[680px] text-sm">
                <thead><tr className="border-b border-white/[0.07] text-right text-xs text-white/35">
                  {isManager && <th className="px-5 py-4">الموظف</th>}
                  <th className="px-5 py-4">التاريخ</th><th className="px-5 py-4">الوردية</th>
                  <th className="px-5 py-4">الحضور</th><th className="px-5 py-4">الانصراف</th><th className="px-5 py-4">الحالة</th>
                </tr></thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {filtered.length ? filtered.map(entry => (
                    <tr key={entry.id}>
                      {isManager && <td className="px-5 py-4 font-bold text-white/65">{employeeNames.get(entry.employeeId)}</td>}
                      <td className="px-5 py-4 text-white/55">{entry.date}</td>
                      <td className="px-5 py-4 text-white/45" dir="ltr">{entry.shift}</td>
                      <td className="px-5 py-4 text-white/45" dir="ltr">{entry.checkIn ?? '—'}</td>
                      <td className="px-5 py-4 text-white/45" dir="ltr">{entry.checkOut ?? '—'}</td>
                      <td className="px-5 py-4">
                        <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${statusStyles[entry.status]}`}>
                          {entry.status === 'shortage' ? `عجز ${entry.shortageMinutes} دقيقة` : statusLabels[entry.status]}
                        </span>
                      </td>
                    </tr>
                  )) : <tr><td colSpan={isManager ? 6 : 5} className="px-5 py-12 text-center text-white/35">لا توجد سجلات مطابقة للفلاتر.</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
          <p className="text-[11px] text-white/25">سجلات الحضور الحالية بيانات تجريبية، والفلاتر تعمل على الفترة المحددة.</p>
        </div>
      ) : (
        <div className="glass border-gradient rounded-2xl p-4 sm:p-6">
          <div className="mb-5 flex items-center justify-between gap-3">
            <button onClick={() => setMonth(value => new Date(value.getFullYear(), value.getMonth() - 1, 1))}
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.04] text-white/50 hover:bg-white/[0.08]" aria-label="الشهر السابق">
              <CaretRight size={16} />
            </button>
            <h3 className="font-black text-white">{monthTitle(month)}</h3>
            <button onClick={() => setMonth(value => new Date(value.getFullYear(), value.getMonth() + 1, 1))}
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.04] text-white/50 hover:bg-white/[0.08]" aria-label="الشهر التالي">
              <CaretLeft size={16} />
            </button>
          </div>
          <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
            {['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'].map(day => (
              <div key={day} className="py-2 text-center text-[10px] font-bold text-white/30 sm:text-xs">{day}</div>
            ))}
            {Array.from({ length: offset }, (_, index) => <div key={`empty-${index}`} />)}
            {Array.from({ length: monthDays }, (_, index) => {
              const day = index + 1
              const date = isoDate(new Date(month.getFullYear(), month.getMonth(), day))
              const dayEntries = monthEntries.filter(entry => entry.date === date)
              const holiday = day === 25
              return (
                <div key={date} className={`min-h-20 rounded-xl border p-1.5 sm:min-h-24 sm:p-2 ${
                  date === today ? 'border-violet-400/35 bg-violet-500/[0.07]' : 'border-white/[0.05] bg-white/[0.015]'
                }`}>
                  <span className="text-xs font-bold text-white/65">{day}</span>
                  <div className="mt-1 space-y-1">
                    {holiday && <span className="block truncate rounded-md bg-rose-500/10 px-1 py-0.5 text-[9px] text-rose-300">عطلة تجريبية</span>}
                    {dayEntries.slice(0, 2).map(entry => {
                      const label = entry.status === 'scheduled' ? `وردية ${entry.shift}` : statusLabels[entry.status]
                      return (
                        <span key={entry.id} title={`${employeeNames.get(entry.employeeId) ?? ''} · ${label}`}
                          className={`block truncate rounded-md px-1 py-0.5 text-[9px] ${statusStyles[entry.status]}`}>
                          {isManager ? `${employeeNames.get(entry.employeeId)?.split(' ')[0]} · ` : ''}{label}
                        </span>
                      )
                    })}
                    {dayEntries.length > 2 && <span className="text-[9px] text-white/30">+{dayEntries.length - 2}</span>}
                  </div>
                </div>
              )
            })}
          </div>
          <p className="mt-4 text-[11px] text-white/25">الورديات وسجلات الغياب تجريبية، والعطلة المعروضة مثال قابل للاستبدال بتقويم الشركة.</p>
        </div>
      )}
    </div>
  )
}
