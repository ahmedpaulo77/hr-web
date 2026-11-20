import { useState } from 'react'
import { MagnifyingGlass, Plus, DotsThreeVertical } from '@phosphor-icons/react'

const employees = [
  { id: 1, name: 'أحمد محمد علي',    email: 'ahmed@co.com',   dept: 'تقنية المعلومات', role: 'موظف',         status: 'active'   },
  { id: 2, name: 'فاطمة علي سعد',    email: 'fatima@co.com',  dept: 'المالية',          role: 'موظف',         status: 'active'   },
  { id: 3, name: 'محمد عبدالله',      email: 'mohamed@co.com', dept: 'تقنية المعلومات', role: 'مدير',         status: 'active'   },
  { id: 4, name: 'نورة سعد الغامدي', email: 'noura@co.com',   dept: 'الموارد البشرية', role: 'موظف',         status: 'inactive' },
  { id: 5, name: 'خالد إبراهيم',     email: 'khaled@co.com',  dept: 'المبيعات',         role: 'موظف',         status: 'active'   },
]

const gradients = [
  'from-violet-500 to-purple-700',
  'from-emerald-500 to-teal-600',
  'from-amber-500 to-orange-600',
  'from-cyan-500 to-blue-600',
  'from-pink-500 to-rose-600',
]

export default function Employees() {
  const [search, setSearch] = useState('')

  const filtered = employees.filter(e =>
    e.name.includes(search) || e.email.includes(search) || e.dept.includes(search)
  )

  return (
    <div className="space-y-5 animate-fade-up">

      {/* Top */}
      <div className="flex gap-3 items-center">
        <div className="flex-1 flex items-center gap-2 glass border border-white/[0.08] rounded-xl px-4 py-2.5">
          <MagnifyingGlass size={15} weight="regular" className="text-white/30 flex-shrink-0" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="بحث عن موظف..."
            className="flex-1 bg-transparent text-sm text-white/60 placeholder-white/20 outline-none" />
        </div>
        <button className="btn-primary text-sm flex-shrink-0">
          <Plus size={15} weight="bold" /> إضافة موظف
        </button>
      </div>

      {/* Table */}
      <div className="glass border-gradient overflow-hidden rounded-2xl">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/[0.06]">
              {['الموظف','القسم','الدور','الحالة',''].map((h,i) => (
                <th key={i} className="text-right px-5 py-3.5 text-xs font-black text-white/25 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04]">
            {filtered.map((emp, i) => (
              <tr key={emp.id} className="hover:bg-white/[0.02] transition-colors">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${gradients[i % gradients.length]} flex items-center justify-center font-black text-[#fff] text-sm shadow-lg`}>
                      {emp.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-white/80">{emp.name}</p>
                      <p className="text-xs text-white/30">{emp.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4 text-white/45 font-medium">{emp.dept}</td>
                <td className="px-5 py-4">
                  <span className={`text-xs font-black px-2.5 py-1 rounded-xl border ${
                    emp.role === 'مدير'
                      ? 'bg-amber-500/10 text-amber-300 border-amber-500/20'
                      : 'bg-violet-500/10 text-violet-300 border-violet-500/20'
                  }`}>
                    {emp.role}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-xl border ${
                    emp.status === 'active'
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      : 'bg-white/[0.05] text-white/25 border-white/[0.08]'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${emp.status === 'active' ? 'bg-emerald-400' : 'bg-white/20'}`} />
                    {emp.status === 'active' ? 'نشط' : 'غير نشط'}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <button className="w-8 h-8 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] flex items-center justify-center text-white/25 hover:text-white/60 transition-all">
                    <DotsThreeVertical size={15} weight="bold" />
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
