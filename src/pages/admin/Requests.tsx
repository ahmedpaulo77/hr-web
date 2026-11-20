import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MagnifyingGlass, Eye, FileText } from '@phosphor-icons/react'
import Badge from '@/components/ui/Badge'
import { useRequestsStore } from '@/store/requestsStore'
import { sortByNewest } from '@/lib/requests'
import { formatDate } from '@/lib/format'
import type { RequestStatus } from '@/types'

const filters: { id: 'all' | RequestStatus; label: string }[] = [
  { id: 'all',        label: 'الكل' },
  { id: 'pending',    label: 'انتظار' },
  { id: 'processing', label: 'معالجة' },
  { id: 'approved',   label: 'موافق' },
  { id: 'rejected',   label: 'مرفوض' },
  { id: 'cancelled',  label: 'ملغي' },
]

export default function AdminRequests() {
  const { requests } = useRequestsStore()
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'all' | RequestStatus>('all')

  const all = useMemo(() => sortByNewest(requests), [requests])
  const filtered = useMemo(
    () => all.filter(r =>
      (filter === 'all' || r.status === filter) &&
      (r.typeTitle.includes(search) || r.employeeName.includes(search) || r.id.toLowerCase().includes(search.toLowerCase())),
    ),
    [all, filter, search],
  )

  return (
    <div className="space-y-5 animate-fade-up">
      <div className="flex flex-wrap gap-3 items-center">
        <div className="flex gap-1.5 p-1.5 rounded-2xl bg-white/[0.03] border border-white/[0.06] overflow-x-auto">
          {filters.map(f => {
            const count = f.id === 'all' ? all.length : all.filter(r => r.status === f.id).length
            return (
              <button key={f.id} onClick={() => setFilter(f.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap
                  ${filter === f.id ? 'bg-violet-600 text-[#fff] shadow-lg' : 'text-white/40 hover:text-white/70 hover:bg-white/[0.04]'}`}>
                {f.label}
                <span className={`text-[10px] px-1.5 py-0.5 rounded-lg ${filter === f.id ? 'bg-white/20' : 'bg-white/[0.06]'}`}>{count}</span>
              </button>
            )
          })}
        </div>

        <div className="flex items-center gap-2 glass border border-white/[0.08] rounded-xl px-4 py-2 mr-auto">
          <MagnifyingGlass size={14} weight="regular" className="text-white/30" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="بحث بالاسم أو رقم الطلب..."
            className="bg-transparent text-sm text-white/60 placeholder-white/20 outline-none w-48" />
        </div>
      </div>

      <div className="glass border-gradient overflow-hidden rounded-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[720px]">
            <thead>
              <tr className="border-b border-white/[0.06]">
                {['رقم الطلب', 'الموظف', 'نوع الطلب', 'التاريخ', 'الحالة', ''].map((h, i) => (
                  <th key={i} className="text-right px-5 py-3.5 text-xs font-black text-white/30 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-16">
                    <FileText size={32} weight="duotone" className="text-white/15 mx-auto mb-3" />
                    <p className="text-white/45 font-bold">لا توجد طلبات</p>
                  </td>
                </tr>
              ) : filtered.map(req => (
                <tr key={req.id}
                  onClick={() => navigate(`/app/admin/requests/${req.id}`)}
                  className="hover:bg-white/[0.02] transition-colors cursor-pointer">
                  <td className="px-5 py-4 font-black text-violet-400 font-mono text-xs whitespace-nowrap">{req.id}</td>
                  <td className="px-5 py-4">
                    <p className="font-semibold text-white/70">{req.employeeName}</p>
                    <p className="text-[10px] text-white/25">{req.department}</p>
                  </td>
                  <td className="px-5 py-4 text-white/50">{req.typeTitle}</td>
                  <td className="px-5 py-4 text-white/30 text-xs whitespace-nowrap">{formatDate(req.submittedAt)}</td>
                  <td className="px-5 py-4"><Badge status={req.status} /></td>
                  <td className="px-5 py-4">
                    <button
                      onClick={e => { e.stopPropagation(); navigate(`/app/admin/requests/${req.id}`) }}
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
    </div>
  )
}
