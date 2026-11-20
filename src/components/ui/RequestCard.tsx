import { useLocation, useNavigate } from 'react-router-dom'
import type { Icon } from '@phosphor-icons/react'

interface RequestCardProps {
  id: string
  title: string
  icon: Icon
  color: string
  description: string
  basePath: string
}

export default function RequestCard({ id, title, icon: Icon, color, description, basePath }: RequestCardProps) {
  const navigate = useNavigate()
  const { search } = useLocation()

  return (
    <button
      onClick={() => navigate(`${basePath}/requests/new/${id}${search}`)}
      className="glass request-card border p-5 text-center hover:-translate-y-1 transition-all duration-300 group rounded-2xl w-full"
      style={{ '--hover-border': color } as React.CSSProperties}
    >
      <div
        className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform"
        style={{ backgroundColor: color + '20', border: `1px solid ${color}40` }}
      >
        <Icon size={22} weight="duotone" style={{ color }} />
      </div>
      <p className="font-black text-white/70 text-sm mb-1 group-hover:text-white transition-colors">{title}</p>
      <p className="text-xs text-white/25 leading-relaxed line-clamp-2">{description}</p>
    </button>
  )
}
