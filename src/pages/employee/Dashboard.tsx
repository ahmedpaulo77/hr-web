import { useMemo } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { useRequestsStore } from '@/store/requestsStore'
import { requestsForEmployee, countByStatus } from '@/lib/requests'
import { formatDate } from '@/lib/format'
import { getRequestType } from '@/data/requestTypes'
import { iconForType } from '@/lib/requestIcons'
import StatCard from '@/components/ui/StatCard'
import Badge from '@/components/ui/Badge'
import { FileText, Clock, CheckCircle, XCircle, Plus, ArrowLeft, CalendarBlank, IdentificationCard, SquaresFour } from '@phosphor-icons/react'

const homeTabs = [
  { label: 'نظرة عامة', path: '/app/employee', icon: SquaresFour },
  { label: 'الإجازات', path: '/app/employee/leave', icon: CalendarBlank },
  { label: 'الحضور والتقويم', path: '/app/employee/attendance', icon: Clock },
  { label: 'ملفي ومستنداتي', path: '/app/employee/profile', icon: IdentificationCard },
]

export default function EmployeeDashboard() {
  const { user } = useAuthStore()
  const { requests } = useRequestsStore()
  const navigate = useNavigate()

  const mine = useMemo(() => requestsForEmployee(requests, user?.id), [requests, user?.id])
  const counts = useMemo(() => countByStatus(mine), [mine])
  const recent = mine.slice(0, 4)

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'صباح الخير' : hour < 17 ? 'مساء الخير' : 'مساء النور'

  return (
    <div className="space-y-6 stagger">
      <nav className="flex gap-2 overflow-x-auto border-b border-white/[0.08]" aria-label="تبويبات بوابة الموظف">
        {homeTabs.map(tab => {
          const Icon = tab.icon
          return (
            <NavLink
              key={tab.path}
              to={tab.path}
              end
              className={({ isActive }) => `flex shrink-0 items-center gap-2 border-b-2 px-4 py-3 text-xs font-bold transition-colors ${
                isActive ? 'border-violet-400 text-violet-300' : 'border-transparent text-white/40 hover:text-white/70'
              }`}
            >
              <Icon size={16} weight="duotone" /> {tab.label}
            </NavLink>
          )
        })}
      </nav>

      {/* Welcome Banner */}
      <div className="relative rounded-3xl overflow-hidden p-7 animate-fade-up"
        style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.25) 0%, rgba(91,33,182,0.15) 60%, rgba(245,158,11,0.08) 100%)', border: '1px solid rgba(124,58,237,0.2)' }}>
        <div className="absolute top-0 left-1/2 w-64 h-32 rounded-full blur-3xl opacity-20 pointer-events-none"
          style={{ background: 'radial-gradient(#7c3aed, transparent)' }} />
        <div className="relative z-10 flex items-center justify-between flex-wrap gap-4">
          <div>
            <p className="text-white/40 text-sm mb-1">{greeting}</p>
            <h2 className="text-2xl font-black text-white mb-1">{user?.name}</h2>
            <p className="text-white/40 text-sm">{user?.position} · {user?.department}</p>
          </div>
          <button onClick={() => navigate('/app/employee/requests/new')} className="btn-primary">
            <Plus size={16} weight="bold" />
            طلب جديد
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 stagger">
        <StatCard title="إجمالي الطلبات" value={mine.length} icon={FileText} color="purple" />
        <StatCard title="قيد الانتظار" value={counts.pending + counts.processing} icon={Clock} color="amber" />
        <StatCard title="تمت الموافقة" value={counts.approved} icon={CheckCircle} color="green" />
        <StatCard title="مرفوضة" value={counts.rejected} icon={XCircle} color="red" />
      </div>

      <div className="grid lg:grid-cols-3 gap-5">

        {/* Recent Requests */}
        <div className="lg:col-span-2 glass border-gradient overflow-hidden animate-fade-up">
          <div className="px-5 py-4 border-b border-white/[0.06] flex items-center justify-between">
            <h3 className="font-black text-white">آخر الطلبات</h3>
            <button onClick={() => navigate('/app/employee/requests')}
              className="text-xs text-violet-400 hover:text-violet-300 font-bold flex items-center gap-1">
              عرض الكل <ArrowLeft size={12} weight="bold" />
            </button>
          </div>

          {recent.length === 0 ? (
            <div className="py-14 text-center">
              <FileText size={32} weight="duotone" className="text-white/15 mx-auto mb-3" />
              <p className="text-white/45 font-bold">لا توجد طلبات بعد</p>
              <p className="text-xs text-white/25 mt-1">ابدأ بتقديم أول طلب لك</p>
            </div>
          ) : (
            <div className="divide-y divide-white/[0.04]">
              {recent.map(req => {
                const type = getRequestType(req.typeId)
                const TypeIcon = iconForType(req.typeId)
                return (
                  <button
                    key={req.id}
                    onClick={() => navigate(`/app/employee/requests/${req.id}`)}
                    className="w-full px-5 py-3.5 flex items-center justify-between hover:bg-white/[0.02] transition-colors text-right"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center border flex-shrink-0"
                        style={{ backgroundColor: (type?.color ?? '#8b5cf6') + '1a', borderColor: (type?.color ?? '#8b5cf6') + '33' }}>
                        <TypeIcon size={16} weight="duotone" style={{ color: type?.color ?? '#a78bfa' }} />
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-sm text-white/80 truncate">{req.typeTitle}</p>
                        <p className="text-xs text-white/30">{req.id} · {formatDate(req.submittedAt)}</p>
                      </div>
                    </div>
                    <Badge status={req.status} />
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="glass border-gradient overflow-hidden animate-fade-up">
          <div className="px-5 py-4 border-b border-white/[0.06]">
            <h3 className="font-black text-white">طلبات سريعة</h3>
          </div>
          <div className="p-3 space-y-1">
            {['salary-freeze', 'loan', 'salary-statement', 'experience-certificate', 'resume-after-leave', 'bank-change']
              .map(id => getRequestType(id))
              .filter((t): t is NonNullable<typeof t> => Boolean(t))
              .map(rt => (
                <button key={rt.id}
                  onClick={() => navigate(`/app/employee/requests/new/${rt.id}`)}
                  className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/[0.04] transition-colors text-right group"
                >
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: rt.color + '20' }}>
                    <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: rt.color }} />
                  </div>
                  <span className="text-sm font-semibold text-white/50 group-hover:text-white/80 transition-colors truncate">
                    {rt.title}
                  </span>
                </button>
              ))}
          </div>
        </div>
      </div>
    </div>
  )
}
