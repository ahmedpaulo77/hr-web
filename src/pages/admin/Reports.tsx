import { DownloadSimple, TrendUp } from '@phosphor-icons/react'

const monthlyData = [
  { month: 'يناير', total: 45, approved: 38 },
  { month: 'فبراير', total: 52, approved: 44 },
  { month: 'مارس',   total: 61, approved: 55 },
  { month: 'أبريل',  total: 48, approved: 40 },
  { month: 'مايو',   total: 70, approved: 63 },
  { month: 'يونيو',  total: 89, approved: 71 },
]

const max = Math.max(...monthlyData.map(d => d.total))

export default function Reports() {
  return (
    <div className="space-y-5 animate-fade-up">

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4 stagger">
        {[
          { label: 'إجمالي الطلبات',      value: '365',    change: '+12%', color: 'violet' },
          { label: 'معدل الموافقة',        value: '87%',    change: '+3%',  color: 'emerald' },
          { label: 'متوسط وقت المعالجة',  value: '2.4 يوم', change: '-8%', color: 'amber' },
        ].map(card => (
          <div key={card.label} className="glass border-gradient p-5 animate-fade-up">
            <p className="text-xs text-white/35 font-bold uppercase tracking-wider mb-3">{card.label}</p>
            <p className="text-4xl font-black text-white mb-2">{card.value}</p>
            <span className={`text-xs font-black px-2.5 py-1 rounded-xl ${
              card.color === 'violet'  ? 'bg-violet-500/10 text-violet-300'   :
              card.color === 'emerald' ? 'bg-emerald-500/10 text-emerald-300' :
              'bg-amber-500/10 text-amber-300'
            }`}>
              {card.change} هذا الشهر
            </span>
          </div>
        ))}
      </div>

      {/* Bar Chart */}
      <div className="glass border-gradient p-6 animate-fade-up">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <TrendUp size={18} weight="duotone" className="text-violet-400" />
            <h3 className="font-black text-white">الطلبات الشهرية</h3>
          </div>
          <button className="btn-ghost text-xs py-2 px-3">
            <DownloadSimple size={14} weight="bold" /> تصدير
          </button>
        </div>

        {/* Legend */}
        <div className="flex gap-4 mb-5">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-sm bg-violet-500" />
            <span className="text-xs text-white/40 font-semibold">إجمالي الطلبات</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-sm bg-emerald-500" />
            <span className="text-xs text-white/40 font-semibold">الموافق عليها</span>
          </div>
        </div>

        {/* Bars */}
        <div className="flex items-end gap-3" style={{ height: '180px' }}>
          {monthlyData.map(d => (
            <div key={d.month} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
              <div className="w-full flex gap-1 items-end" style={{ height: '150px' }}>
                {/* Total bar */}
                <div className="flex-1 relative group cursor-pointer"
                  style={{ height: `${(d.total / max) * 100}%`, minHeight: '12px' }}>
                  <div className="absolute bottom-0 inset-x-0 rounded-t-lg bg-gradient-to-t from-violet-700 to-violet-500 opacity-60 hover:opacity-100 transition-opacity h-full" />
                  <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-[var(--popover)] text-white text-[10px] font-black px-1.5 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-white/10">
                    {d.total}
                  </div>
                </div>
                {/* Approved bar */}
                <div className="flex-1 relative group cursor-pointer"
                  style={{ height: `${(d.approved / max) * 100}%`, minHeight: '8px' }}>
                  <div className="absolute bottom-0 inset-x-0 rounded-t-lg bg-gradient-to-t from-emerald-700 to-emerald-500 opacity-60 hover:opacity-100 transition-opacity h-full" />
                </div>
              </div>
              <span className="text-[10px] text-white/25 font-semibold">{d.month}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Distribution */}
      <div className="glass border-gradient p-6 animate-fade-up">
        <h3 className="font-black text-white mb-5">توزيع الطلبات حسب النوع</h3>
        <div className="space-y-4">
          {[
            { label: 'تثبيت راتب', pct: 35, color: '#7c3aed' },
            { label: 'سلفة',        pct: 25, color: '#10b981' },
            { label: 'شهادة خبرة', pct: 20, color: '#f59e0b' },
            { label: 'تعريف راتب', pct: 12, color: '#06b6d4' },
            { label: 'أخرى',        pct: 8,  color: '#ef4444' },
          ].map(item => (
            <div key={item.label} className="flex items-center gap-4">
              <span className="text-sm text-white/45 w-24 font-semibold flex-shrink-0">{item.label}</span>
              <div className="flex-1 h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${item.pct}%`, background: item.color }} />
              </div>
              <span className="text-sm font-black w-10 flex-shrink-0" style={{ color: item.color }}>{item.pct}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
