import { useState } from 'react'
import Badge from '@/components/ui/Badge'
import { MagnifyingGlass, Eye, FileText } from '@phosphor-icons/react'

const allRequests = [
  { id: 'REQ-001', type: 'تثبيت راتب',           status: 'approved'   as const, date: '15 يناير 2024' },
  { id: 'REQ-002', type: 'سلفة',                  status: 'pending'    as const, date: '18 يناير 2024' },
  { id: 'REQ-003', type: 'شهادة خبرة',            status: 'processing' as const, date: '20 يناير 2024' },
  { id: 'REQ-004', type: 'تعريف الراتب',          status: 'rejected'   as const, date: '22 يناير 2024' },
  { id: 'REQ-005', type: 'مباشرة عمل بعد إجازة', status: 'approved'   as const, date: '25 يناير 2024' },
  { id: 'REQ-006', type: 'تغيير الحساب البنكي',  status: 'pending'    as const, date: '27 يناير 2024' },
]

const filters = [
  { id: 'all',        label: 'الكل' },
  { id: 'pending',    label: 'انتظار' },
  { id: 'approved',   label: 'موافق' },
  { id: 'rejected',   label: 'مرفوض' },
  { id: 'processing', label: 'معالجة' },
]

export default function MyRequests() {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')

  const filtered = allRequests.filter(r =>
    (filter === 'all' || r.status === filter) &&
    (r.type.includes(search) || r.id.includes(search))
  )

  return (
    <div className="space-y-5 animate-fade-up">

      {/* Top Bar */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="flex gap-1.5 p-1.5 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
          {filters.map(f => {
            const count = f.id === 'all' ? allRequests.length : allRequests.filter(r => r.status === f.id).length
            return (
              <button key={f.id} onClick={() => setFilter(f.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all
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
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="بحث..."
            className="bg-transparent text-sm text-white/60 placeholder-white/20 outline-none w-32" />
        </div>
      </div>

      {/* Table */}
      <div className="glass border-gradient overflow-hidden rounded-2xl">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/[0.06]">
              {['رقم الطلب','نوع الطلب','تاريخ التقديم','الحالة','إجراء'].map(h => (
                <th key={h} className="text-right px-5 py-3.5 text-xs font-black text-white/30 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04]">
            {filtered.length === 0 ? (
              <tr><td colSpan={5} className="text-center py-14 text-white/20 font-semibold">لا توجد طلبات</td></tr>
            ) : filtered.map(req => (
              <tr key={req.id} className="hover:bg-white/[0.02] transition-colors">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-violet-500/15 border border-violet-500/20 flex items-center justify-center">
                      <FileText size={14} weight="duotone" className="text-violet-400" />
                    </div>
                    <span className="font-black text-violet-400 font-mono text-xs">{req.id}</span>
                  </div>
                </td>
                <td className="px-5 py-4 font-semibold text-white/70">{req.type}</td>
                <td className="px-5 py-4 text-white/30 text-xs">{req.date}</td>
                <td className="px-5 py-4"><Badge status={req.status} /></td>
                <td className="px-5 py-4">
                  <button className="flex items-center gap-1.5 text-xs text-violet-400 hover:text-violet-300 font-bold transition-colors">
                    <Eye size={14} weight="regular" /> عرض
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
