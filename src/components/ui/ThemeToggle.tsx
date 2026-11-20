import { Sun, Moon } from '@phosphor-icons/react'
import { useThemeStore } from '@/store/themeStore'

interface ThemeToggleProps {
  /** visual size of the square button in px */
  size?: number
}

export default function ThemeToggle({ size = 38 }: ThemeToggleProps) {
  const theme = useThemeStore(s => s.theme)
  const toggle = useThemeStore(s => s.toggle)
  const isLight = theme === 'light'

  return (
    <button
      onClick={toggle}
      aria-label={isLight ? 'التبديل إلى الوضع الليلي' : 'التبديل إلى الوضع الفاتح'}
      title={isLight ? 'الوضع الليلي' : 'الوضع الفاتح'}
      style={{
        width: size, height: size, borderRadius: 11, flexShrink: 0,
        background: 'rgba(var(--ov-rgb),0.04)',
        border: '1px solid rgba(var(--ov-rgb),0.1)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: 'rgba(var(--fg-rgb),0.65)', cursor: 'pointer',
        transition: 'all 0.18s',
      }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLButtonElement
        el.style.background = 'rgba(var(--ov-rgb),0.1)'
        el.style.color = 'var(--ink)'
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLButtonElement
        el.style.background = 'rgba(var(--ov-rgb),0.04)'
        el.style.color = 'rgba(var(--fg-rgb),0.65)'
      }}
    >
      {isLight ? <Moon size={17} weight="regular" /> : <Sun size={17} weight="regular" />}
    </button>
  )
}
