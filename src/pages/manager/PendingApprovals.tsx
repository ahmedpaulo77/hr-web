import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check, X, Eye, CheckCircle } from '@phosphor-icons/react'
import { useAuthStore } from '@/store/authStore'
import { useRequestsStore } from '@/store/requestsStore'
import { requestsForManager } from '@/lib/requests'
import { getEmployeeByEmail } from '@/data/employees'
import { formatDate, daysBetween } from '@/lib/format'
import ReasonDialog from '@/components/ui/ReasonDialog'
import type { RequestRecord } from '@/types'

export default function PendingApprovals() {
  const { user } = useAuthStore()
  const { requests, approve, reject } = useRequestsStore()
  const navigate = useNavigate()
  const [target, setTarget] = useState<{ request: RequestRecord; action: 'approve' | 'reject' } | null>(null)

  const pending = useMemo(
    () => requestsForManager(requests, user?.id).filter(r => r.status === 'pending'),
    [requests, user?.id],
  )

  const actor = { name: user?.name ?? '', role: 'مدير' }

  if (pending.length === 0) {
    return (
      <div className="glass border-gradient p-16 text-center rounded-3xl animate-fade-up max-w-lg mx-auto">
        <CheckCircle size={48} weight="duotone" className="text-emerald-400/70 mx-auto mb-4" />
        <p className="text-xl font-black text-white mb-2">لا توجد طلبات معلقة</p>
        <p className="text-white/35 text-sm">تمت معالجة جميع الطلبات</p>
      </div>
    )
  }

  return (
    <div className="space-y-3 animate-fade-up">
      {pending.map(req => {
        const employee = getEmployeeByEmail(req.employeeId)
        const late = daysBetween(req.submittedAt, new Date().toISOString()) >= 3
        return (
          <div key={req.id} className="glass border-gradient p-5 hover:-translate-y-0.5 transition-all duration-300">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <button
                onClick={() => navigate(`/app/manager/requests/${req.id}`)}
                className="flex items-center gap-4 text-right"
              >
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500/20 to-purple-700/20 border border-violet-500/20 flex items-center justify-center font-black text-violet-300 text-lg">
                  {req.employeeName.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <p className="font-black text-white">{req.employeeName}</p>
                    {late && (
                      <span className="text-[10px] bg-amber-500/15 text-amber-300 border border-amber-500/20 px-2 py-0.5 rounded-full font-black">
                        متأخر {daysBetween(req.submittedAt, new Date().toISOString())} أيام
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-white/35">
                    {req.department} · {req.typeTitle} · {formatDate(req.submittedAt)}
                  </p>
                  <p className="text-[11px] text-white/20 font-mono mt-0.5">{req.id}</p>
                </div>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setTarget({ request: req, action: 'approve' })}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/15 text-emerald-400 font-bold text-sm border border-emerald-500/20 hover:bg-emerald-500/25 transition-colors"
                >
                  <Check size={15} weight="bold" /> موافقة
                </button>
                <button
                  onClick={() => setTarget({ request: req, action: 'reject' })}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/15 text-red-400 font-bold text-sm border border-red-500/20 hover:bg-red-500/25 transition-colors"
                >
                  <X size={15} weight="bold" /> رفض
                </button>
                <button
                  onClick={() => navigate(`/app/manager/requests/${req.id}`)}
                  className="w-9 h-9 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-white/30 hover:text-violet-300 hover:bg-violet-500/10 transition-all"
                  aria-label="عرض التفاصيل"
                >
                  <Eye size={15} weight="regular" />
                </button>
              </div>
            </div>
          </div>
        )
      })}

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
