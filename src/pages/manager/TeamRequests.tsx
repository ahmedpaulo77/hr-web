import Badge from '@/components/ui/Badge'

const requests = [
  { id:'REQ-001', name:'أحمد محمد',    type:'تثبيت راتب',  status:'approved'   as const, date:'15 يناير' },
  { id:'REQ-002', name:'فاطمة علي',    type:'سلفة',         status:'pending'    as const, date:'18 يناير' },
  { id:'REQ-003', name:'خالد إبراهيم', type:'شهادة خبرة',  status:'processing' as const, date:'20 يناير' },
  { id:'REQ-004', name:'نورة سعد',     type:'تعريف الراتب', status:'approved'  as const, date:'22 يناير' },
  { id:'REQ-005', name:'محمد عمر',     type:'إجازة سنوية', status:'rejected'   as const, date:'24 يناير' },
]

export default function TeamRequests() {
  return (
    <div className="glass border-gradient overflow-hidden animate-fade-up">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-white/[0.06]">
            {['الموظف','نوع الطلب','التاريخ','الحالة'].map(h => (
              <th key={h} className="text-right px-5 py-3.5 text-xs font-black text-white/30 uppercase tracking-wider">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-white/[0.04]">
          {requests.map(req => (
            <tr key={req.id} className="hover:bg-white/[0.02] transition-colors">
              <td className="px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500/20 to-purple-700/20 border border-violet-500/20 flex items-center justify-center font-black text-violet-300 text-sm">
                    {req.name.charAt(0)}
                  </div>
                  <span className="font-semibold text-white/70">{req.name}</span>
                </div>
              </td>
              <td className="px-5 py-4 text-white/50">{req.type}</td>
              <td className="px-5 py-4 text-white/30 text-xs">{req.date}</td>
              <td className="px-5 py-4"><Badge status={req.status} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
