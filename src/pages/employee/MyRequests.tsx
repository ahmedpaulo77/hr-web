import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MagnifyingGlass, Eye, FileText, Plus } from '@phosphor-icons/react'
import Badge from '@/components/ui/Badge'
import { useAuthStore } from '@/store/authStore'
import { useRequestsStore } from '@/store/requestsStore'
import { requestsForEmployee } from '@/lib/requests'
import { formatDate } from '@/lib/format'
import { getRequestType } from '@/data/requestTypes'
import { iconForType } from '@/lib/requestIcons'
import type { RequestStatus } from '@/types'

const filters: { id: 'all' | RequestStatus; label: string }[] = [
  { id: 'all',        label: 'الكل' },
  { id: 'pending',    label: 'انتظار' },
  { id: 'processing', label: 'معالجة' },
  { id: 'approved',   label: 'موافق' },
  { id: 'rejected',   label: 'مرفوض' },
  { id: 'cancelled',  label: 'ملغي' },
]

export default function MyRequests() {
  const { user } = useAuthStore()
  const { requests } = useRequestsStore()
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'all' | RequestStatus>('all')

  const mine = useMemo(() => requestsForEmployee(requests, user?.id), [requests, user?.id])

  const filtered = useMemo(
    () => mine.filter(r =>
      (filter === 'all' || r.status === filter) &&
      (r.typeTitle.includes(search) || r.id.toLowerCase().includes(search.toLowerCase())),
    ),
    [mine, filter, search],
  )

  return (
    <div className="space-y-5 animate-fade-up">

      {/* Top Bar */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="flex gap-1.5 p-1.5 rounded-2xl bg-white/[0.03] border border-white/[0.06] overflow-x-auto">
          {filters.map(f => {
            const count = f.id === 'all' ? mine.length : mine.filter(r => r.status === f.id).length
            return (
              <button key={f.id} onClick={() => setFilter(f.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap
                  ${filter === f.id ? 'bg-violet-600 text-[#fff] shadow-lg' : 'text-white/40 hover:text-white/70 hover:bg-white/[0.04]'}`}>
                {f.label}
                <span className={`text-[10px] px-1.5 py-0.5 rounded-lg ${filter === f.id ? 'bg-white/20' : 'bg-white/[0.06]'}`}>
                  {count}
                </span>
              </button>
            )
          })}
        </div>

        <div className="flex items-center gap-2 glass border border-white/[0.08] rounded-xl px-4 py-2 mr-auto">
          <MagnifyingGlass size={14} weight="regular" className="text-white/30" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="بحث برقم الطلب أو النوع..."
            className="bg-transparent text-sm text-white/60 placeholder-white/20 outline-none w-44" />
        </div>

        <button onClick={() => navigate('/app/employee/requests/new')} className="btn-primary text-sm flex-shrink-0">
          <Plus size={15} weight="bold" /> طلب جديد
        </button>
      </div>

      {/* Table */}
      <div className="glass border-gradient overflow-hidden rounded-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[640px]">
            <thead>
              <tr className="border-b border-white/[0.06]">
                {['رقم الطلب', 'نوع الطلب', 'تاريخ التقديم', 'الحالة', 'إجراء'].map(h => (
                  <th key={h} className="text-right px-5 py-3.5 text-xs font-black text-white/30 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-16 px-4">
                    <FileText size={34} weight="duotone" className="text-white/15 mx-auto mb-3" />
                    <p className="text-white/50 font-bold">لا توجد طلبات</p>
                    <p className="text-xs text-white/25 mt-1">
                      {mine.length === 0 ? 'ابدأ بتقديم أول طلب لك' : 'جرّب تغيير الفلتر أو كلمة البحث'}
                    </p>
                  </td>
                </tr>
              ) : filtered.map(req => {
                const type = getRequestType(req.typeId)
                const TypeIcon = iconForType(req.typeId)
                return (
                  <tr
                    key={req.id}
                    onClick={() => navigate(`/app/employee/requests/${req.id}`)}
                    className="hover:bg-white/[0.02] transition-colors cursor-pointer"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl flex items-center justify-center border"
                          style={{ backgroundColor: (type?.color ?? '#8b5cf6') + '1a', borderColor: (type?.color ?? '#8b5cf6') + '33' }}>
                          <TypeIcon size={14} weight="duotone" style={{ color: type?.color ?? '#a78bfa' }} />
                        </div>
                        <span className="font-black text-violet-400 font-mono text-xs whitespace-nowrap">{req.id}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 font-semibold text-white/70">{req.typeTitle}</td>
                    <td className="px-5 py-4 text-white/30 text-xs whitespace-nowrap">{formatDate(req.submittedAt)}</td>
                    <td className="px-5 py-4"><Badge status={req.status} /></td>
                    <td className="px-5 py-4">
                      <button
                        onClick={e => { e.stopPropagation(); navigate(`/app/employee/requests/${req.id}`) }}
                        className="flex items-center gap-1.5 text-xs text-violet-400 hover:text-violet-300 font-bold transition-colors"
                      >
                        <Eye size={14} weight="regular" /> عرض
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
