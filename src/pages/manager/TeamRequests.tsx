import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import Badge from '@/components/ui/Badge'
import { useAuthStore } from '@/store/authStore'
import { useRequestsStore } from '@/store/requestsStore'
import { requestsForManager } from '@/lib/requests'
import { formatDate } from '@/lib/format'
import { Eye, FileText } from '@phosphor-icons/react'

export default function TeamRequests() {
  const { user } = useAuthStore()
  const { requests } = useRequestsStore()
  const navigate = useNavigate()

  const team = useMemo(() => requestsForManager(requests, user?.id), [requests, user?.id])

  return (
    <div className="glass border-gradient overflow-hidden animate-fade-up rounded-2xl">
      <div className="overflow-x-auto">
        <table className="w-full text-sm min-w-[640px]">
          <thead>
            <tr className="border-b border-white/[0.06]">
              {['الموظف', 'نوع الطلب', 'رقم الطلب', 'التاريخ', 'الحالة', ''].map((h, i) => (
                <th key={i} className="text-right px-5 py-3.5 text-xs font-black text-white/30 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04]">
            {team.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-16">
                  <FileText size={32} weight="duotone" className="text-white/15 mx-auto mb-3" />
                  <p className="text-white/45 font-bold">لا توجد طلبات للفريق</p>
                </td>
              </tr>
            ) : team.map(req => (
              <tr
                key={req.id}
                onClick={() => navigate(`/app/manager/requests/${req.id}`)}
                className="hover:bg-white/[0.02] transition-colors cursor-pointer"
              >
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500/20 to-purple-700/20 border border-violet-500/20 flex items-center justify-center font-black text-violet-300 text-sm">
                      {req.employeeName.charAt(0)}
                    </div>
                    <div>
                      <span className="font-semibold text-white/70">{req.employeeName}</span>
                      <p className="text-[10px] text-white/25">{req.department}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4 text-white/50">{req.typeTitle}</td>
                <td className="px-5 py-4 text-violet-400 font-mono text-xs whitespace-nowrap">{req.id}</td>
                <td className="px-5 py-4 text-white/30 text-xs whitespace-nowrap">{formatDate(req.submittedAt)}</td>
                <td className="px-5 py-4"><Badge status={req.status} /></td>
                <td className="px-5 py-4">
                  <button
                    onClick={e => { e.stopPropagation(); navigate(`/app/manager/requests/${req.id}`) }}
                    className="w-8 h-8 rounded-lg bg-white/[0.03] hover:bg-violet-500/10 flex items-center justify-center text-white/25 hover:text-violet-300 transition-all"
                    aria-label="عرض"
                  >
                    <Eye size={14} weight="regular" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
