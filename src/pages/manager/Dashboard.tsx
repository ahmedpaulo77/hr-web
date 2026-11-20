import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import StatCard from '@/components/ui/StatCard'
import { useAuthStore } from '@/store/authStore'
import { useRequestsStore } from '@/store/requestsStore'
import { requestsForManager, countByStatus } from '@/lib/requests'
import { getTeam } from '@/data/employees'
import { formatDate } from '@/lib/format'
import { Users, Clock, CheckCircle, FileText, ArrowLeft, Check, X } from '@phosphor-icons/react'
import ReasonDialog from '@/components/ui/ReasonDialog'
import type { RequestRecord } from '@/types'

export default function ManagerDashboard() {
  const { user } = useAuthStore()
  const { requests, approve, reject } = useRequestsStore()
  const navigate = useNavigate()
  const [target, setTarget] = useState<{ request: RequestRecord; action: 'approve' | 'reject' } | null>(null)

  const team = useMemo(() => requestsForManager(requests, user?.id), [requests, user?.id])
  const counts = useMemo(() => countByStatus(team), [team])
  const pending = useMemo(() => team.filter(r => r.status === 'pending').slice(0, 4), [team])
  const members = getTeam(user?.id)

  const actor = { name: user?.name ?? '', role: 'مدير' }

  return (
    <div className="space-y-6 stagger">

      {/* Welcome */}
      <div className="relative rounded-3xl overflow-hidden p-7 animate-fade-up"
        style={{ background: 'linear-gradient(135deg, rgba(245,158,11,0.15) 0%, rgba(217,119,6,0.08) 60%, rgba(124,58,237,0.08) 100%)', border: '1px solid rgba(245,158,11,0.2)' }}>
        <div className="relative z-10">
          <p className="text-white/40 text-sm mb-1">مرحباً بك</p>
          <h2 className="text-2xl font-black text-white mb-1">{user?.name}</h2>
          <p className="text-white/40 text-sm">{user?.position} · {members.length} أعضاء في الفريق</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 stagger">
        <StatCard title="أعضاء الفريق"   value={members.length} icon={Users}       color="purple" />
        <StatCard title="طلبات معلقة"    value={counts.pending}  icon={Clock}       color="amber"  />
        <StatCard title="تمت الموافقة"   value={counts.approved} icon={CheckCircle} color="green"  />
        <StatCard title="إجمالي الطلبات" value={team.length}     icon={FileText}    color="cyan"   />
      </div>

      {/* Pending Approvals */}
      <div className="glass border-gradient overflow-hidden animate-fade-up">
        <div className="px-5 py-4 border-b border-white/[0.06] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <h3 className="font-black text-white">طلبات تحتاج موافقتك</h3>
            <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-black px-2 py-0.5 rounded-full">
              {counts.pending}
            </span>
          </div>
          <button onClick={() => navigate('/app/manager/approvals')}
            className="text-xs text-violet-400 hover:text-violet-300 font-bold flex items-center gap-1">
            عرض الكل <ArrowLeft size={12} weight="bold" />
          </button>
        </div>

        {pending.length === 0 ? (
          <div className="py-12 text-center">
            <CheckCircle size={30} weight="duotone" className="text-emerald-400/60 mx-auto mb-3" />
            <p className="text-white/40 text-sm font-semibold">لا توجد طلبات معلقة</p>
          </div>
        ) : (
          <div className="divide-y divide-white/[0.04]">
            {pending.map(req => (
              <div key={req.id} className="px-5 py-4 flex items-center justify-between flex-wrap gap-3 hover:bg-white/[0.02] transition-colors">
                <button
                  onClick={() => navigate(`/app/manager/requests/${req.id}`)}
                  className="flex items-center gap-3 text-right"
                >
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-600/20 border border-amber-500/20 flex items-center justify-center font-black text-amber-300">
                    {req.employeeName.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-sm text-white/80">{req.employeeName}</p>
                    <p className="text-xs text-white/30">{req.typeTitle} · {formatDate(req.submittedAt)}</p>
                  </div>
                </button>
                <div className="flex items-center gap-2">
                  <button onClick={() => setTarget({ request: req, action: 'approve' })}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/15 text-emerald-400 text-xs font-bold border border-emerald-500/20 hover:bg-emerald-500/25 transition-colors">
                    <Check size={13} weight="bold" /> موافقة
                  </button>
                  <button onClick={() => setTarget({ request: req, action: 'reject' })}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-500/15 text-red-400 text-xs font-bold border border-red-500/20 hover:bg-red-500/25 transition-colors">
                    <X size={13} weight="bold" /> رفض
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ReasonDialog
        open={target?.action === 'approve'}
        title={`الموافقة على طلب ${target?.request.employeeName ?? ''}`}
        description={target?.request.typeTitle}
        confirmLabel="تأكيد الموافقة"
        tone="success"
        requireReason={false}
        onClose={() => setTarget(null)}
        onConfirm={() => { if (target) approve(target.request.id, actor); setTarget(null) }}
      />
      <ReasonDialog
        open={target?.action === 'reject'}
        title={`رفض طلب ${target?.request.employeeName ?? ''}`}
        description="اكتب سبب الرفض ليظهر للموظف."
        confirmLabel="تأكيد الرفض"
        tone="danger"
        onClose={() => setTarget(null)}
        onConfirm={reason => { if (target) reject(target.request.id, actor, reason); setTarget(null) }}
      />
    </div>
  )
}
