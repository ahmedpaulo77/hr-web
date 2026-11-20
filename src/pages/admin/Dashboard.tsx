import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import StatCard from '@/components/ui/StatCard'
import Badge from '@/components/ui/Badge'
import { Users, FileText, CheckCircle, Clock, ArrowLeft, ChartBar, ListChecks, GearSix } from '@phosphor-icons/react'
import { useRequestsStore } from '@/store/requestsStore'
import { useEmployeesStore } from '@/store/employeesStore'
import { countByStatus, isThisMonth, typeDistribution, sortByNewest } from '@/lib/requests'
import { formatDate } from '@/lib/format'

export default function AdminDashboard() {
  const navigate = useNavigate()
  const { requests } = useRequestsStore()
  const employees = useEmployeesStore(s => s.employees)

  const counts = useMemo(() => countByStatus(requests), [requests])
  const thisMonth = useMemo(() => requests.filter(r => isThisMonth(r.submittedAt)).length, [requests])
  const activeEmployees = employees.filter(e => e.status === 'active').length
  const activity = useMemo(() => sortByNewest(requests).slice(0, 4), [requests])
  const distribution = useMemo(() => typeDistribution(requests, 5), [requests])

  const palette = ['#7c3aed', '#10b981', '#f59e0b', '#06b6d4', '#ef4444']

  return (
    <div className="space-y-6 stagger">

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 stagger">
        <StatCard title="إجمالي الموظفين"   value={activeEmployees} icon={Users}       color="purple" />
        <StatCard title="الطلبات هذا الشهر" value={thisMonth}       icon={FileText}    color="cyan"   />
        <StatCard title="تمت الموافقة"       value={counts.approved} icon={CheckCircle} color="green"  />
        <StatCard title="طلبات معلقة"        value={counts.pending}  icon={Clock}       color="amber"  />
      </div>

      <div className="grid lg:grid-cols-3 gap-5">

        {/* Recent Activity */}
        <div className="lg:col-span-2 glass border-gradient overflow-hidden animate-fade-up">
          <div className="px-5 py-4 border-b border-white/[0.06] flex items-center justify-between">
            <h3 className="font-black text-white">النشاط الأخير</h3>
            <span className="text-xs text-white/30 font-semibold">آخر {activity.length} طلبات</span>
          </div>
          {activity.length === 0 ? (
            <div className="py-14 text-center text-white/30 text-sm font-semibold">لا يوجد نشاط بعد</div>
          ) : (
            <div className="divide-y divide-white/[0.04]">
              {activity.map(req => (
                <div key={req.id} className="px-5 py-4 flex items-center justify-between gap-3 hover:bg-white/[0.02] transition-colors">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-violet-500/20 to-purple-700/20 border border-violet-500/20 flex items-center justify-center font-black text-violet-300 flex-shrink-0">
                      {req.employeeName.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-sm text-white/80 truncate">{req.employeeName}</p>
                      <p className="text-xs text-white/30 truncate">
                        {req.typeTitle} · {formatDate(req.submittedAt)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <Badge status={req.status} />
                    <button
                      onClick={() => navigate(`/app/admin/requests`)}
                      className="w-7 h-7 rounded-lg bg-white/[0.03] hover:bg-violet-500/10 flex items-center justify-center text-white/25 hover:text-violet-300 transition-all"
                      aria-label="عرض الطلبات"
                    >
                      <ArrowLeft size={13} weight="bold" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="glass border-gradient overflow-hidden animate-fade-up">
          <div className="px-5 py-4 border-b border-white/[0.06]">
            <h3 className="font-black text-white">إجراءات سريعة</h3>
          </div>
          <div className="p-3 space-y-1.5">
            {[
              { label: 'إدارة الموظفين',      path: '/app/admin/employees',     Icon: Users,    c: 'hover:bg-violet-500/10 hover:text-violet-300' },
              { label: 'إدارة أنواع الطلبات',  path: '/app/admin/request-types', Icon: ListChecks, c: 'hover:bg-amber-500/10 hover:text-amber-300'  },
              { label: 'عرض التقارير',          path: '/app/admin/reports',       Icon: ChartBar, c: 'hover:bg-emerald-500/10 hover:text-emerald-300' },
              { label: 'إعدادات الشركة',        path: '/app/admin/settings',      Icon: GearSix,  c: 'hover:bg-cyan-500/10 hover:text-cyan-300'    },
            ].map(a => (
              <button key={a.path} onClick={() => navigate(a.path)}
                className={`w-full flex items-center gap-3 p-3 rounded-xl text-white/50 font-semibold text-sm transition-all ${a.c}`}>
                <a.Icon size={18} weight="duotone" className="flex-shrink-0" />
                {a.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="glass border-gradient p-6 animate-fade-up">
        <div className="flex items-center gap-2 mb-6">
          <ChartBar size={18} weight="duotone" className="text-violet-400" />
          <h3 className="font-black text-white">توزيع الطلبات حسب النوع</h3>
        </div>
        {distribution.length === 0 ? (
          <p className="text-sm text-white/30">لا توجد طلبات لعرضها.</p>
        ) : (
          <div className="space-y-4">
            {distribution.map((item, i) => (
              <div key={item.label} className="flex items-center gap-4">
                <span className="text-sm text-white/50 w-28 font-semibold text-right flex-shrink-0 truncate">{item.label}</span>
                <div className="flex-1 h-2 bg-white/[0.06] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-1000"
                    style={{ width: `${item.pct}%`, background: `linear-gradient(90deg, ${palette[i]}cc, ${palette[i]})` }}
                  />
                </div>
                <span className="text-sm font-black w-10 text-left flex-shrink-0" style={{ color: palette[i] }}>
                  {item.pct}%
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
