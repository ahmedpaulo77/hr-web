import StatCard from '@/components/ui/StatCard'
import Badge from '@/components/ui/Badge'
import { useAuthStore } from '@/store/authStore'
import { Users, Clock, CheckCircle, FileText, ArrowLeft, Check, X } from '@phosphor-icons/react'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

const initPending = [
  { id: 'REQ-010', name: 'أحمد محمد',    type: 'سلفة',          date: '27 يناير', urgent: true  },
  { id: 'REQ-011', name: 'فاطمة علي',    type: 'تثبيت راتب',   date: '26 يناير', urgent: false },
  { id: 'REQ-012', name: 'خالد إبراهيم', type: 'شهادة خبرة',   date: '25 يناير', urgent: false },
]

export default function ManagerDashboard() {
  const { user } = useAuthStore()
  const navigate  = useNavigate()
  const [pending, setPending] = useState(initPending)

  return (
    <div className="space-y-6 stagger">

      {/* Welcome */}
      <div className="relative rounded-3xl overflow-hidden p-7 animate-fade-up"
        style={{ background: 'linear-gradient(135deg, rgba(245,158,11,0.15) 0%, rgba(217,119,6,0.08) 60%, rgba(124,58,237,0.08) 100%)', border: '1px solid rgba(245,158,11,0.2)' }}>
        <div className="relative z-10">
          <p className="text-white/40 text-sm mb-1">مرحباً بك 👔</p>
          <h2 className="text-2xl font-black text-white mb-1">{user?.name}</h2>
          <p className="text-white/40 text-sm">{user?.position}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 stagger">
        <StatCard title="أعضاء الفريق"   value={15} icon={Users}       color="purple" />
        <StatCard title="طلبات معلقة"    value={3}  icon={Clock}       color="amber"  trend={{ value: -20 }} />
        <StatCard title="تمت الموافقة"   value={28} icon={CheckCircle} color="green"  trend={{ value: 12 }} />
        <StatCard title="إجمالي الطلبات" value={43} icon={FileText}    color="cyan" />
      </div>

      {/* Pending Approvals */}
      <div className="glass border-gradient overflow-hidden animate-fade-up">
        <div className="px-5 py-4 border-b border-white/[0.06] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <h3 className="font-black text-white">طلبات تحتاج موافقتك</h3>
            <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-black px-2 py-0.5 rounded-full">
              {pending.length}
            </span>
          </div>
          <button onClick={() => navigate('/app/manager/approvals')}
            className="text-xs text-violet-400 hover:text-violet-300 font-bold flex items-center gap-1">
            عرض الكل <ArrowLeft size={12} weight="bold" />
          </button>
        </div>

        {pending.length === 0 ? (
          <div className="py-12 text-center">
            <span className="text-3xl">🎉</span>
            <p className="text-white/40 text-sm mt-3 font-semibold">لا توجد طلبات معلقة</p>
          </div>
        ) : (
          <div className="divide-y divide-white/[0.04]">
            {pending.map(req => (
              <div key={req.id} className="px-5 py-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-600/20 border border-amber-500/20 flex items-center justify-center font-black text-amber-300">
                    {req.name.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-sm text-white/80">{req.name}</p>
                      {req.urgent && <span className="text-[10px] bg-red-500/20 text-red-400 border border-red-500/20 px-1.5 py-0.5 rounded-full font-black">عاجل</span>}
                    </div>
                    <p className="text-xs text-white/30">{req.type} · {req.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => setPending(p => p.filter(r => r.id !== req.id))}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/15 text-emerald-400 text-xs font-bold border border-emerald-500/20 hover:bg-emerald-500/25 transition-colors">
                    <Check size={13} weight="bold" /> موافقة
                  </button>
                  <button onClick={() => setPending(p => p.filter(r => r.id !== req.id))}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-500/15 text-red-400 text-xs font-bold border border-red-500/20 hover:bg-red-500/25 transition-colors">
                    <X size={13} weight="bold" /> رفض
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
