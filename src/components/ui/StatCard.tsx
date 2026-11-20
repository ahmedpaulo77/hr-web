import { type Icon } from '@phosphor-icons/react'

interface StatCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon: Icon
  color: 'purple' | 'amber' | 'green' | 'red' | 'cyan'
  trend?: { value: number; label?: string }
}

const colorMap = {
  purple: {
    iconBg:  'bg-violet-500/15',
    iconClr: 'text-violet-400',
    glow:    'glow-purple',
    ring:    'bg-violet-400',
    trend:   'bg-violet-500/10 text-violet-300',
  },
  amber: {
    iconBg:  'bg-amber-500/15',
    iconClr: 'text-amber-400',
    glow:    'glow-amber',
    ring:    'bg-amber-400',
    trend:   'bg-amber-500/10 text-amber-300',
  },
  green: {
    iconBg:  'bg-emerald-500/15',
    iconClr: 'text-emerald-400',
    glow:    'glow-green',
    ring:    'bg-emerald-400',
    trend:   'bg-emerald-500/10 text-emerald-300',
  },
  red: {
    iconBg:  'bg-red-500/15',
    iconClr: 'text-red-400',
    glow:    'glow-red',
    ring:    'bg-red-400',
    trend:   'bg-red-500/10 text-red-300',
  },
  cyan: {
    iconBg:  'bg-cyan-500/15',
    iconClr: 'text-cyan-400',
    glow:    'glow-cyan',
    ring:    'bg-cyan-400',
    trend:   'bg-cyan-500/10 text-cyan-300',
  },
}

export default function StatCard({ title, value, subtitle, icon: Icon, color, trend }: StatCardProps) {
  const c = colorMap[color]

  return (
    <div className={`glass border-gradient p-5 hover:-translate-y-1 ${c.glow} transition-all duration-300 animate-fade-up cursor-default`}>
      <div className="flex items-start justify-between mb-5">
        <div className={`w-11 h-11 rounded-2xl ${c.iconBg} flex items-center justify-center`}>
          <Icon size={22} weight="duotone" className={c.iconClr} />
        </div>
        {trend && (
          <span className={`text-xs font-bold px-2.5 py-1 rounded-xl ${c.trend}`}>
            {trend.value >= 0 ? '↑' : '↓'} {Math.abs(trend.value)}%
          </span>
        )}
      </div>

      <p className="text-3xl font-black text-white mb-1 tracking-tight">{value}</p>
      <p className="text-sm font-semibold text-white/60">{title}</p>
      {subtitle && <p className="text-xs text-white/35 mt-1">{subtitle}</p>}

      {/* Bottom accent line */}
      <div className={`h-0.5 w-8 ${c.ring} rounded-full mt-4 opacity-60`} />
    </div>
  )
}
