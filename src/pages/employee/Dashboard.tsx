import { useAuthStore } from '@/store/authStore'
import StatCard from '@/components/ui/StatCard'
import Badge from '@/components/ui/Badge'
import { FileText, Clock, CheckCircle, XCircle, Plus, ArrowLeft } from '@phosphor-icons/react'
import { requestTypes } from '@/data/requestTypes'
import { useNavigate } from 'react-router-dom'

const recentRequests = [
  { id: 'REQ-001', type: 'تثبيت راتب',    status: 'approved'   as const, date: '15 يناير 2024' },
  { id: 'REQ-002', type: 'سلفة',           status: 'pending'    as const, date: '18 يناير 2024' },
  { id: 'REQ-003', type: 'شهادة خبرة',    status: 'processing' as const, date: '20 يناير 2024' },
  { id: 'REQ-004', type: 'تعريف الراتب',  status: 'rejected'   as const, date: '22 يناير 2024' },
]

export default function EmployeeDashboard() {
  const { user } = useAuthStore()
  const navigate  = useNavigate()
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'صباح الخير' : hour < 17 ? 'مساء الخير' : 'مساء النور'

  return (
    <div className="space-y-6 stagger">

      {/* Welcome Banner */}
      <div className="relative rounded-3xl overflow-hidden p-7 animate-fade-up"
        style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.25) 0%, rgba(91,33,182,0.15) 60%, rgba(245,158,11,0.08) 100%)', border: '1px solid rgba(124,58,237,0.2)' }}>
        <div className="absolute top-0 left-1/2 w-64 h-32 rounded-full blur-3xl opacity-20 pointer-events-none"
          style={{ background: 'radial-gradient(#7c3aed, transparent)' }} />
        <div className="relative z-10 flex items-center justify-between flex-wrap gap-4">
          <div>
            <p className="text-white/40 text-sm mb-1">{greeting} 👋</p>
            <h2 className="text-2xl font-black text-white mb-1">{user?.name}</h2>
            <p className="text-white/40 text-sm">{user?.position} · {user?.department}</p>
          </div>
          <button
            onClick={() => navigate('/app/employee/requests/new')}
            className="btn-primary"
          >
            <Plus size={16} weight="bold" />
            طلب جديد
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 stagger">
        <StatCard title="إجمالي الطلبات" value={12} icon={FileText}    color="purple" trend={{ value: 8 }} />
        <StatCard title="قيد الانتظار"   value={2}  icon={Clock}       color="amber" />
        <StatCard title="تمت الموافقة"   value={8}  icon={CheckCircle} color="green"  trend={{ value: 15 }} />
        <StatCard title="مرفوضة"         value={2}  icon={XCircle}     color="red" />
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
          <div className="divide-y divide-white/[0.04]">
            {recentRequests.map(req => (
              <div key={req.id} className="px-5 py-3.5 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-violet-500/15 border border-violet-500/20 flex items-center justify-center">
                    <FileText size={16} weight="duotone" className="text-violet-400" />
                  </div>
                  <div>
                    <p className="font-bold text-sm text-white/80">{req.type}</p>
                    <p className="text-xs text-white/30">{req.date}</p>
                  </div>
                </div>
                <Badge status={req.status} />
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="glass border-gradient overflow-hidden animate-fade-up">
          <div className="px-5 py-4 border-b border-white/[0.06]">
            <h3 className="font-black text-white">طلبات سريعة</h3>
          </div>
          <div className="p-3 space-y-1">
            {requestTypes.slice(0, 6).map(rt => (
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
