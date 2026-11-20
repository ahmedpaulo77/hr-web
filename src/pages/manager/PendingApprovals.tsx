import { useState } from 'react'
import { Check, X } from '@phosphor-icons/react'

const init = [
  { id: 'REQ-010', name: 'أحمد محمد',    dept: 'تقنية المعلومات', type: 'سلفة',          date: '27 يناير', urgent: true  },
  { id: 'REQ-011', name: 'فاطمة علي',    dept: 'المالية',          type: 'تثبيت راتب',   date: '26 يناير', urgent: false },
  { id: 'REQ-012', name: 'خالد إبراهيم', dept: 'المبيعات',         type: 'شهادة خبرة',   date: '25 يناير', urgent: false },
]

export default function PendingApprovals() {
  const [items, setItems] = useState(init)
  const remove = (id: string) => setItems(p => p.filter(r => r.id !== id))

  return (
    <div className="space-y-3 animate-fade-up">
      {items.length === 0 ? (
        <div className="glass border-gradient p-16 text-center rounded-3xl">
          <span className="text-5xl">🎉</span>
          <p className="text-xl font-black text-white mt-5 mb-2">لا توجد طلبات معلقة</p>
          <p className="text-white/35 text-sm">تمت معالجة جميع الطلبات</p>
        </div>
      ) : items.map(req => (
        <div key={req.id} className="glass border-gradient p-5 hover:-translate-y-0.5 transition-all duration-300">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500/20 to-purple-700/20 border border-violet-500/20 flex items-center justify-center font-black text-violet-300 text-lg">
                {req.name.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-black text-white">{req.name}</p>
                  {req.urgent && <span className="text-[10px] bg-red-500/20 text-red-400 border border-red-500/20 px-2 py-0.5 rounded-full font-black">🔴 عاجل</span>}
                </div>
                <p className="text-sm text-white/35">{req.dept} · {req.type} · {req.date}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => remove(req.id)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/15 text-emerald-400 font-bold text-sm border border-emerald-500/20 hover:bg-emerald-500/25 transition-colors">
                <Check size={15} weight="bold" /> موافقة
              </button>
              <button onClick={() => remove(req.id)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/15 text-red-400 font-bold text-sm border border-red-500/20 hover:bg-red-500/25 transition-colors">
                <X size={15} weight="bold" /> رفض
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
