import { Clock, CheckCircle, XCircle, ArrowsClockwise, Prohibit } from '@phosphor-icons/react'
import type { RequestStatus } from '@/types'

interface BadgeProps { status: RequestStatus }

const config: Record<RequestStatus, {
  label: string
  className: string
  dotClass: string
  icon: React.ElementType
}> = {
  pending:    { label: 'قيد الانتظار',   className: 'bg-amber-500/10 text-amber-300 border-amber-500/20',    dotClass: 'bg-amber-400',   icon: Clock },
  approved:   { label: 'تمت الموافقة',   className: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20', dotClass: 'bg-emerald-400', icon: CheckCircle },
  rejected:   { label: 'مرفوض',          className: 'bg-red-500/10 text-red-300 border-red-500/20',          dotClass: 'bg-red-400',     icon: XCircle },
  processing: { label: 'جاري المعالجة',  className: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/20',       dotClass: 'bg-cyan-400',    icon: ArrowsClockwise },
  cancelled:  { label: 'ملغي',           className: 'bg-white/[0.06] text-white/40 border-white/[0.1]',      dotClass: 'bg-white/30',    icon: Prohibit },
}

export default function Badge({ status }: BadgeProps) {
  const { label, className, dotClass } = config[status] ?? config.pending
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-xl border whitespace-nowrap ${className}`}>
      <span className="relative flex w-1.5 h-1.5">
        {status === 'pending' || status === 'processing'
          ? <span className={`absolute inline-flex h-full w-full rounded-full ${dotClass} opacity-60 animate-ping`} />
          : null}
        <span className={`relative inline-flex rounded-full w-1.5 h-1.5 ${dotClass}`} />
      </span>
      {label}
    </span>
  )
}
