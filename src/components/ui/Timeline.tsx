import { CheckCircle } from '@phosphor-icons/react'
import type { TimelineEvent } from '@/types'
import { formatDateTime } from '@/lib/format'

const toneFor = (label: string) =>
  label.includes('رفض')
    ? { dot: 'bg-red-400', ring: 'border-red-500/30 bg-red-500/10' }
    : label.includes('إلغاء')
      ? { dot: 'bg-white/30', ring: 'border-white/10 bg-white/[0.04]' }
      : label.includes('موافقة')
        ? { dot: 'bg-emerald-400', ring: 'border-emerald-500/30 bg-emerald-500/10' }
        : label.includes('معالجة')
          ? { dot: 'bg-cyan-400', ring: 'border-cyan-500/30 bg-cyan-500/10' }
          : { dot: 'bg-violet-400', ring: 'border-violet-500/30 bg-violet-500/10' }

export default function Timeline({ events }: { events: TimelineEvent[] }) {
  if (!events.length) return <p className="text-sm text-white/30">لا يوجد سجل بعد.</p>

  return (
    <ol className="relative space-y-5 pr-1">
      {events.map((event, i) => {
        const tone = toneFor(event.label)
        return (
          <li key={event.id} className="relative flex gap-3">
            <div className="flex flex-col items-center flex-shrink-0">
              <span className={`w-7 h-7 rounded-full border flex items-center justify-center ${tone.ring}`}>
                <CheckCircle size={14} weight="fill" className={tone.dot.replace('bg-', 'text-')} />
              </span>
              {i < events.length - 1 && <span className="w-px flex-1 bg-white/[0.08] mt-1.5" />}
            </div>
            <div className="pb-1 min-w-0">
              <p className="text-sm font-bold text-white/80">{event.label}</p>
              <p className="text-[11px] text-white/30 mt-0.5">
                {event.by} · {event.role} · {formatDateTime(event.at)}
              </p>
              {event.note && (
                <p className="text-xs text-white/45 mt-1.5 bg-white/[0.03] border border-white/[0.06] rounded-lg px-3 py-2 leading-relaxed">
                  {event.note}
                </p>
              )}
            </div>
          </li>
        )
      })}
    </ol>
  )
}
