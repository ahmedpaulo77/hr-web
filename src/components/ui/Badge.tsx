import { Clock, CheckCircle, XCircle, ArrowsClockwise } from '@phosphor-icons/react'

type BadgeStatus = 'pending' | 'approved' | 'rejected' | 'processing'

interface BadgeProps { status: BadgeStatus }

const config: Record<BadgeStatus, {
  label: string
  className: string
  dotClass: string
  icon: React.ElementType
}> = {
  pending:    { label: 'قيد الانتظار',   className: 'bg-amber-500/10 text-amber-300 border-amber-500/20',    dotClass: 'bg-amber-400',   icon: Clock },
  approved:   { label: 'تمت الموافقة',   className: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20', dotClass: 'bg-emerald-400', icon: CheckCircle },
  rejected:   { label: 'مرفوض',          className: 'bg-red-500/10 text-red-300 border-red-500/20',          dotClass: 'bg-red-400',     icon: XCircle },
  processing: { label: 'جاري المعالجة',  className: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/20',       dotClass: 'bg-cyan-400',    icon: ArrowsClockwise },
}

export default function Badge({ status }: BadgeProps) {
  const { label, className, dotClass, icon: Icon } = config[status]
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-xl border ${className}`}>
      <span className={`relative flex w-1.5 h-1.5`}>
        {status === 'pending' || status === 'processing'
          ? <span className={`absolute inline-flex h-full w-full rounded-full ${dotClass} opacity-60 animate-ping`} />
          : null}
        <span className={`relative inline-flex rounded-full w-1.5 h-1.5 ${dotClass}`} />
      </span>
      {label}
    </span>
  )
}
