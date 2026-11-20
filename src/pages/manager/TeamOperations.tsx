import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Briefcase, CurrencyCircleDollar, UserMinus } from '@phosphor-icons/react'
import AttendancePage from '@/pages/shared/AttendancePage'

const actions = [
  { id: 'manager-stop-salary', label: 'إيقاف راتب موظف', icon: CurrencyCircleDollar, color: 'text-rose-300' },
  { id: 'manager-cancel-termination', label: 'إلغاء إنهاء خدمة', icon: UserMinus, color: 'text-amber-300' },
  { id: 'manager-assignment', label: 'قرار تكليف', icon: Briefcase, color: 'text-violet-300' },
]

export default function TeamOperations() {
  const navigate = useNavigate()

  return (
    <div className="space-y-5">
      <section className="glass border-gradient rounded-2xl p-4 sm:p-5">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h3 className="font-black text-white">إجراءات المدير</h3>
            <p className="mt-1 text-xs text-white/35">اختر الموظف أولًا، ثم قدّم الإجراء المناسب.</p>
          </div>
          <ArrowLeft size={17} className="text-white/25" />
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          {actions.map(action => {
            const Icon = action.icon
            return (
              <button
                key={action.id}
                onClick={() => navigate(`/app/manager/requests/new/${action.id}`)}
                className="flex items-center gap-3 rounded-xl border border-white/[0.07] bg-white/[0.025] p-4 text-right transition-colors hover:border-violet-400/20 hover:bg-white/[0.05]"
              >
                <Icon size={21} weight="duotone" className={action.color} />
                <span className="text-sm font-bold text-white/70">{action.label}</span>
              </button>
            )
          })}
        </div>
      </section>
      <AttendancePage teamMode />
    </div>
  )
}
