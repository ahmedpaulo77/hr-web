import StatCard from '@/components/ui/StatCard'
import Badge from '@/components/ui/Badge'
import { Users, FileText, CheckCircle, Clock, ArrowLeft, ChartBar } from '@phosphor-icons/react'
import { useNavigate } from 'react-router-dom'

const recentActivity = [
  { id: 1, user: 'أحمد محمد',    action: 'قدم طلب سلفة',               time: 'منذ 5 دقائق',  status: 'pending'    as const },
  { id: 2, user: 'فاطمة علي',    action: 'تمت الموافقة على تثبيت راتب', time: 'منذ 20 دقيقة', status: 'approved'   as const },
  { id: 3, user: 'خالد إبراهيم', action: 'قدم طلب شهادة خبرة',          time: 'منذ ساعة',     status: 'processing' as const },
]

const chartData = [
  { label: 'تثبيت راتب', pct: 35, color: '#7c3aed' },
  { label: 'سلفة',        pct: 25, color: '#10b981' },
  { label: 'شهادة خبرة', pct: 20, color: '#f59e0b' },
  { label: 'تعريف راتب', pct: 12, color: '#06b6d4' },
  { label: 'أخرى',        pct: 8,  color: '#ef4444' },
]

export default function AdminDashboard() {
  const navigate = useNavigate()

  return (
    <div className="space-y-6 stagger">

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 stagger">
        <StatCard title="إجمالي الموظفين"   value={248} icon={Users}        color="purple" trend={{ value: 5  }} />
        <StatCard title="الطلبات هذا الشهر" value={89}  icon={FileText}     color="cyan"   trend={{ value: 12 }} />
        <StatCard title="تمت الموافقة"       value={71}  icon={CheckCircle}  color="green"  trend={{ value: 8  }} />
        <StatCard title="طلبات معلقة"        value={18}  icon={Clock}        color="amber" />
      </div>

      <div className="grid lg:grid-cols-3 gap-5">

        {/* Recent Activity */}
        <div className="lg:col-span-2 glass border-gradient overflow-hidden animate-fade-up">
          <div className="px-5 py-4 border-b border-white/[0.06] flex items-center justify-between">
            <h3 className="font-black text-white">النشاط الأخير</h3>
            <span className="text-xs text-white/30 font-semibold">آخر 24 ساعة</span>
          </div>
          <div className="divide-y divide-white/[0.04]">
            {recentActivity.map(act => (
              <div key={act.id} className="px-5 py-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-violet-500/20 to-purple-700/20 border border-violet-500/20 flex items-center justify-center font-black text-violet-300">
                    {act.user.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-sm text-white/80">{act.user}</p>
                    <p className="text-xs text-white/30">{act.action} · {act.time}</p>
                  </div>
                </div>
                <Badge status={act.status} />
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="glass border-gradient overflow-hidden animate-fade-up">
          <div className="px-5 py-4 border-b border-white/[0.06]">
            <h3 className="font-black text-white">إجراءات سريعة</h3>
          </div>
          <div className="p-3 space-y-1.5">
            {[
              { label: 'إضافة موظف جديد',     path: '/app/admin/employees',      emoji: '👤', c: 'hover:bg-violet-500/10 hover:text-violet-300' },
              { label: 'إدارة أنواع الطلبات',  path: '/app/admin/request-types',  emoji: '📋', c: 'hover:bg-amber-500/10 hover:text-amber-300'  },
              { label: 'عرض التقارير',          path: '/app/admin/reports',        emoji: '📊', c: 'hover:bg-emerald-500/10 hover:text-emerald-300' },
              { label: 'إعدادات الشركة',        path: '/app/admin/settings',       emoji: '⚙️', c: 'hover:bg-cyan-500/10 hover:text-cyan-300'    },
            ].map(a => (
              <button key={a.path} onClick={() => navigate(a.path)}
                className={`w-full flex items-center gap-3 p-3 rounded-xl text-white/50 font-semibold text-sm transition-all ${a.c}`}>
                <span className="text-lg">{a.emoji}</span>
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
        <div className="space-y-4">
          {chartData.map(item => (
            <div key={item.label} className="flex items-center gap-4">
              <span className="text-sm text-white/50 w-24 font-semibold text-right flex-shrink-0">{item.label}</span>
              <div className="flex-1 h-2 bg-white/[0.06] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-1000"
                  style={{ width: `${item.pct}%`, background: `linear-gradient(90deg, ${item.color}cc, ${item.color})` }}
                />
              </div>
              <span className="text-sm font-black w-10 text-left flex-shrink-0" style={{ color: item.color }}>
                {item.pct}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
