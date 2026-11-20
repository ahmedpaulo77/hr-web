import { useMemo, useState } from 'react'
import { MagnifyingGlass, ArrowLeft, UsersThree } from '@phosphor-icons/react'
import { useEmployeesStore } from '@/store/employeesStore'
import { formatDate } from '@/lib/format'

interface Props {
  managerId?: string | null
  onSelect: (employeeId: string) => void
}

export default function EmployeePicker({ managerId, onSelect }: Props) {
  const [search, setSearch] = useState('')
  const employees = useEmployeesStore(s => s.employees)

  const list = useMemo(() => {
    const q = search.trim().toLowerCase()
    return employees
      .filter(e => e.status === 'active')
      .filter(e =>
        !q ||
        e.name.toLowerCase().includes(q) ||
        e.email.toLowerCase().includes(q) ||
        e.employeeNumber.toLowerCase().includes(q) ||
        e.department.toLowerCase().includes(q),
      )
  }, [search, employees])

  return (
    <div className="space-y-5 animate-fade-up max-w-4xl mx-auto">

      <div>
        <h2 className="text-xl font-black text-white">اختر الموظف</h2>
        <p className="text-sm text-white/35">
          ابحث عن الموظف ثم اختر نوع الطلب الذي تريد تقديمه بالنيابة عنه.
        </p>
      </div>

      <div className="flex items-center gap-3 glass border border-white/[0.08] rounded-2xl px-5 py-3.5">
        <MagnifyingGlass size={18} weight="regular" className="text-white/30 flex-shrink-0" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="ابحث بالاسم أو الرقم الوظيفي أو القسم..."
          className="flex-1 bg-transparent text-sm text-white/70 placeholder-white/25 outline-none"
        />
      </div>

      {list.length === 0 ? (
        <div className="glass border-gradient p-14 text-center rounded-3xl">
          <MagnifyingGlass size={34} weight="duotone" className="text-white/20 mx-auto mb-3" />
          <p className="font-black text-white/70">لا توجد نتائج</p>
          <p className="text-sm text-white/30 mt-1">جرّب كلمة بحث أخرى</p>
        </div>
      ) : (
        <div className="glass border-gradient overflow-hidden rounded-2xl divide-y divide-white/[0.04]">
          {list.map(emp => {
            const inTeam = managerId ? emp.managerId === managerId : false
            return (
              <button
                key={emp.id}
                onClick={() => onSelect(emp.id)}
                className="w-full flex items-center gap-4 px-5 py-4 text-right hover:bg-white/[0.03] transition-colors group"
              >
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-violet-500/20 to-purple-700/20 border border-violet-500/20 flex items-center justify-center font-black text-violet-300 flex-shrink-0">
                  {emp.name.charAt(0)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-black text-white/85 truncate">{emp.name}</p>
                    {inTeam && (
                      <span className="text-[10px] font-black px-2 py-0.5 rounded-lg bg-violet-500/10 text-violet-300 border border-violet-500/20">
                        فريقك
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-white/30 truncate">
                    {emp.employeeNumber} · {emp.position} · {emp.department}
                  </p>
                </div>

                <div className="hidden sm:block text-left flex-shrink-0">
                  <p className="text-[10px] text-white/20">تاريخ التعيين</p>
                  <p className="text-xs font-bold text-white/40">{formatDate(emp.hireDate)}</p>
                </div>

                <span className="w-9 h-9 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-white/25 group-hover:text-violet-300 group-hover:bg-violet-500/10 group-hover:border-violet-500/20 transition-all flex-shrink-0">
                  <ArrowLeft size={15} weight="bold" />
                </span>
              </button>
            )
          })}
        </div>
      )}

      <p className="flex items-center gap-2 text-xs text-white/25">
        <UsersThree size={14} weight="duotone" className="text-violet-400/60" />
        تظهر هنا كل الموظفين النشطين. الطلبات التي تقدّمها ستُسجل باسم الموظف المختار.
      </p>
    </div>
  )
}
